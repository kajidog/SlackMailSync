import { View } from '@slack/bolt';
import { ViewSubmitViews } from '../../types/slack';
import { AccountConfig } from 'account_config';
import { Filter } from 'filter';

export const MailFilterModalTemplate = (accountConfig: AccountConfig, filter?: Filter): View => {
  return {
    type: 'modal',
    submit: {
      type: 'plain_text',
      text: '登録',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'キャンセル',
      emoji: true,
    },
    title: {
      type: 'plain_text',
      text: 'メールフィルター設定',
      emoji: true,
    },
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": ":wave: Hey David!\n\nWe'd love to hear from you how we can make this place the best place you’ve ever worked.",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": accountConfig.user_name,
          "emoji": true
        },
        "block_id": "user_name",
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "filter_name",
          initial_value: filter?.filter_name ?? "",
        },
        "label": {
          "type": "plain_text",
          "text": "フィルター名",
          "emoji": true
        },
        "block_id": "filter_name",
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "filter_memo",
          initial_value: filter?.memo ?? "",
        },
        "label": {
          "type": "plain_text",
          "text": "メモ（転送時にこのテキストがメール情報に追加されます）",
          "emoji": true
        },
        "block_id": "filter_memo",
        "optional": true,
      },
      {
        "type": "input",
        "element": {
          "type": "number_input",
          "is_decimal_allowed": false,
          "action_id": "priority",
          initial_value: String(filter?.priority || 0),
        },
        "label": {
          "type": "plain_text",
          "text": "フィルターの優先度",
          "emoji": true
        },
        "block_id": "priority",
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*以下の項目のワードを含むメールを*"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "スペース区切りで複数指定可能（OR検索）"
        }
      },
      {
        "type": "input",
        "optional": true,
        "element": {
          "type": "plain_text_input",
          "action_id": "subject",
          initial_value: filter?.subject ?? "",
        },
        "label": {
          "type": "plain_text",
          "text": "件名"
        },
        "block_id": "subject",
      },
      {
        "type": "input",
        "optional": true,
        "element": {
          "type": "plain_text_input",
          "action_id": "from",
          initial_value: filter?.from ?? "",
        },
        "label": {
          "type": "plain_text",
          "text": "送信元",
          "emoji": true
        },
        "block_id": "from",
      },
      {
        "type": "input",
        "optional": true,
        "element": {
          "type": "plain_text_input",
          "action_id": "to",
          initial_value: filter?.to ?? "",

        },
        "label": {
          "type": "plain_text",
          "text": "宛先",
          "emoji": true
        },
        "block_id": "to",
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "cc",
          initial_value: filter?.cc ?? "",
        },
        "label": {
          "type": "plain_text",
          "text": "CC",
          "emoji": true
        },
        "optional": true,
        "block_id": "cc",
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "element": {
          "type": "radio_buttons",
          "options": [
            {
              "text": {
                "type": "mrkdwn",
                "text": "受信する"
              },
              "value": "default"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "受信しない",
                "emoji": true
              },
              "value": "block"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "指定のチャンネルに転送し、DMでも受信する",
                "emoji": true
              },
              "value": "forward_1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "指定のチャンネルに転送し、DMには受信しない",
                "emoji": true
              },
              "value": "forward_2"
            }
          ],
          "action_id": "action_type"
        },
        "label": {
          "type": "plain_text",
          "text": "アクション内容",
          "emoji": true
        },
        "block_id": "action_type",
      },
      {
        "type": "input",
        "element": {
          "type": "multi_conversations_select",
          "action_id": "forward_channel",
        },
        "label": {
          "type": "plain_text",
          "text": "指定のチャンネル",
          "emoji": true,
        },
        "optional": true,
        "block_id": "forward_channel",
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*注意*: 指定のチャンネルへ転送する場合、このBotがそのチャンネルに参加している必要があります"
        }
      }
    ]
  };
};

export type FilterValues = {
  filter_name: string;
  priority: number;
  subject?: string;
  from?: string;
  to?: string;
  cc?: string;
  action_type: string;
  forward_channel?: string;
  memo?: string;
};

export const getFilterValue = (values: ViewSubmitViews): FilterValues => {
  const { filter_name, priority, subject, from, to, cc, action_type, forward_channel, filter_memo } = values;
  return {
    filter_name: filter_name.filter_name.value,
    priority: parseInt(priority.priority.value),
    subject: subject?.subject?.value,
    from: from?.from?.value,
    to: to?.to?.value,
    cc: cc?.cc?.value,
    memo: filter_memo?.filter_memo?.value,
    action_type: action_type?.action_type?.selected_option.value,
    forward_channel: String(forward_channel?.forward_channel?.selected_conversations)
  };
};