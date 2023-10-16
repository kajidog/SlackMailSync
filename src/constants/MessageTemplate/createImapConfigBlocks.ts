import { initDB } from '../../utils/sqlite/initiDB';
import { getIMAP_Config } from '../../utils/sqlite/getIMAP_Config';
import { actionIds } from '..';
import { getSMTP_Config } from '../../utils/sqlite/getSMTP_Config';

export const createImapConfigBlocks = async (slackId: string, isActionDisable?: boolean) => {
  const db = await initDB();
  const config = await getIMAP_Config(db, slackId);
  const smtpConfig = await getSMTP_Config(db, slackId);

  if (!config && !isActionDisable) {
    return [
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '利用するには設定が必要です。',
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            action_id: actionIds.OPEN_MODAL_MAIL_CONFIG,
            type: 'button',
            text: {
              type: 'plain_text',
              text: '設定はこちら',
              emoji: true,
            },
            style: 'primary',
          },
        ],
      },
    ];
  }
  const { host, user, port, update_at } = config;
  const actionBlock = isActionDisable
    ? []
    : [
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
            },
            {
              action_id: actionIds.OPEN_MODAL_MAIL_CONFIG,
              type: 'button',
              text: {
                type: 'plain_text',
                text: '再設定',
                emoji: true,
              },
              style: 'primary',
            },
          ],
        },
      ];
  return [
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: `前回実行日時: ${update_at ?? '実行履歴なし'}`,
          emoji: true,
        },
      ],
    },
    ...actionBlock,
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: `imap: ${host}:${port}`,
        },
        {
          type: 'plain_text',
          text: `smtp: ${smtpConfig ? smtpConfig.host + ':' + smtpConfig.port : '未設定'}`,
        },
        {
          type: 'plain_text',
          text: `user: ${user}`,
        },
      ],
    },
  ];
};
