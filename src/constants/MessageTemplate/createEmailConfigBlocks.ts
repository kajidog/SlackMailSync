import { initDB } from '../../utils/sqlite/initiDB';
import { actionIds } from '..';
import { EmptyConfigTemplate } from './EmptyConfigTemplate';
import { convertDateFormat } from '../../utils';
import { Block, KnownBlock } from '@slack/bolt';
import { getAccount_Config } from '../../utils/sqlite/getAccountConfig';
import { AccountConfig } from 'account_config';
import { getAllMailFilter } from '../../utils/sqlite/getAllMailFilter';
import { Filter } from 'filter';


// メールフィルターの設定画面のメッセージブロックを生成
export const createEmailConfigBlocks = async (slackId: string, isActionDisable?: boolean): Promise<(Block | KnownBlock)[]> => {
  const db = await initDB();
  const config = await getAccount_Config(db, slackId);
  let filters: { [user_name: string]: Filter[] } = {};

  ((await getAllMailFilter(db, slackId)) || []).forEach(filter => {
    if (!filters[filter.filter_name]) {
      filters[filter.user_name] = [];
    }
    filters[filter.user_name].push(filter)
  })
  db.close();
  console.log(filters);

  // 設定がまだの場合
  if (!config && !isActionDisable) {
    return EmptyConfigTemplate;
  }

  // メールアカウントのブロック生成
  let accountBlocks: Block[] = []
  config.forEach(config => {
    accountBlocks = [
      ...accountBlocks,
      ...createAccountBlock(config, isActionDisable),
      ...createFilterBlock(filters[config.user_name] || []),
      {
        type: 'divider',
      },

    ]
  });

  // アカウントのブロックの上にボタンを追加して返す
  return [
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "アカウント追加",
            "emoji": true
          },
          action_id: actionIds.OPEN_MODAL_MAIL_CONFIG,
        }
      ]
    },
    {
      type: 'divider',
    },
    ...accountBlocks,
  ];
};

// _______________________
//
const FILTER_ACTION = {
  'default': '受信する',
  'block': '受信しない',
  'forward_1': '指定のチャンネルに転送し、DMでに受信する',
  'forward_2': '指定のチャンネルに転送し、DMには受信しない'
} as any

const createFilterBlock = (filters: Filter[]): (Block | KnownBlock)[] => {
  return filters.map((filter) => {
    const NAME = `*フィルター名: ${filter.filter_name}*`
    const PRIORITY = `優先度: ${filter.priority}`
    const ACTION_TYPE = `実行内容: ${FILTER_ACTION[filter.action_type]}`
    const FORWARD = filter.action_type.indexOf('forward') === -1 ? '' : `転送先: ${filter.forward_channel.split(',').map(w => `<#${w}>`).join(' ')}`
    return {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `${NAME}\n${PRIORITY}\n ${ACTION_TYPE}\n${FORWARD}`,
        }
      ],
    }
  })
}

// _______________________
//
const createAccountBlock = (config: AccountConfig, isActionDisable?: boolean): (Block | KnownBlock)[] => {
  const USER = `*■ ${config.user_name}*`
  const IMAP = `IMAP: ${config.imap_host}:${config.imap_port}`;
  const SMTP = `SMTP: ${config.smtp_host ? config.smtp_host + ':' + config.smtp_port : '未設定'}`;
  const AUTO_GET = `自動取得: ${config.is_job ? "有効" : "無効"}`;
  const UPDATE_AT = `前回実行日時: ${config.update_at ? convertDateFormat(config.update_at) : "実行記録なし"}`

  const ActionButton = isActionDisable ? [] : [
    {
      type: 'actions',
      elements: [
        {
          action_id: actionIds.MAIL_UPDATE,
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'メール受信',
            emoji: true,
          },
          value: config.user_name
        },
        {
          action_id: actionIds.OPEN_MODAL_MAIL_CONFIG,
          type: 'button',
          text: {
            type: 'plain_text',
            text: '再設定',
            emoji: true,
          },
          value: config.user_name,
          style: 'primary',
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "フィルター・転送設定追加",
            "emoji": true
          },
          value: config.user_name,
          action_id: actionIds.OPEN_MODAL_MAIL_FILTER
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "削除",
            "emoji": true
          },
          "style": "danger",
          value: config.user_name,
          action_id: actionIds.DELETE_CONFIG
        },
      ],
    },
  ]

  return [
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `${USER}\n${IMAP}\n${SMTP}\n${AUTO_GET}\n${UPDATE_AT}`,
        }
      ],
    },
    ...ActionButton
  ]
}