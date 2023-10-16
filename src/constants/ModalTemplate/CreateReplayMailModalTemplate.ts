import { View } from '@slack/bolt';
import { splitAndProcess, splitStringByDelimiters } from '../../utils';
import { ViewSubmitViews } from 'slack';
import { MAIL_ADDRESS_DELIMITER } from '..';

export const CreateReplayMailModalTemplate = (id: string, subject: string, from: string, to?: string, cc?: string, replyText?: string): View => {
  const _replyText: any[] = splitAndProcess(replyText || '', 3000, (str) => {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: str,
      },
    };
  });
  const replaySubject = subject.substring(0, 3) !== 'Re:' ? 'Re: ' + subject : subject;

  return {
    type: 'modal',
    submit: {
      type: 'plain_text',
      text: '送信',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true,
    },
    title: {
      type: 'plain_text',
      text: `メール送信`,
      emoji: true,
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:wave: Hey David!\n\n*差出人: * ${from}`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          action_id: 'subject',
          initial_value: replaySubject,
        },
        label: {
          type: 'plain_text',
          text: '件名',
          emoji: true,
        },
        block_id: 'subject',
      },
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          action_id: 'to',
          multiline: true,

          initial_value: `${to}`,
        },
        label: {
          type: 'plain_text',
          text: '宛先: 改行orカンマ 区切り',
          emoji: true,
        },
        block_id: 'to',
      },
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          action_id: 'cc',
          multiline: true,
          initial_value: `${cc}`,
        },
        label: {
          type: 'plain_text',
          text: 'CC',
          emoji: true,
        },
        optional: true,
        block_id: 'cc',
      },
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          action_id: 'bcc',
        },
        label: {
          type: 'plain_text',
          text: 'BCC',
          emoji: true,
        },
        optional: true,
        block_id: 'bcc',
      },
      {
        type: 'divider',
      },
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          multiline: true,
          action_id: 'body',
        },
        label: {
          type: 'plain_text',
          text: '本文',
          emoji: true,
        },
        block_id: 'body',
      },
      {
        type: 'divider',
      },
      {
        type: 'input',
        element: {
          type: 'checkboxes',
          options: [
            {
              text: {
                type: 'plain_text',
                text: 'BCCに自身を含める',
                emoji: true,
              },
              value: 'value-0',
            },
            {
              text: {
                type: 'plain_text',
                text: '元のメッセージを引用しない',
                emoji: true,
              },
              value: 'value-1',
            },
          ],
          action_id: 'option',
        },
        label: {
          type: 'plain_text',
          text: 'オプション',
          emoji: true,
        },
        optional: true,
        block_id: 'option',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*元のメッセージ*',
        },
      },
      ..._replyText,
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          action_id: 'id',
          multiline: true,
          initial_value: `${id}`,
        },
        label: {
          type: 'plain_text',
          text: 'mail-id',
          emoji: true,
        },
        block_id: 'id',
      },
    ],
  };
};

export type ReplayMailValues = {
  id: string;
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  body: string;
  option: {
    includeBcc: boolean;
    skipOriginalQuote: boolean;
  };
};

export const getReplayMailValue = (values: ViewSubmitViews): ReplayMailValues => {
  const { subject, to, cc, bcc, body, option, id } = values;

  // オプションの内容を取得
  let includeBcc = false;
  let skipOriginalQuote = false;
  for (const _ of option.option.selected_options) {
    if (_.value === 'value-0') {
      includeBcc = true;
    }
    if (_.value === 'value-1') {
      skipOriginalQuote = true;
    }
  }

  // 結果を返す
  return {
    id: id.id.value, // メールID
    subject: subject.subject.value, // 件名
    to: splitStringByDelimiters(to.to.value || '', MAIL_ADDRESS_DELIMITER), // 宛先
    cc: splitStringByDelimiters(cc.cc.value || '', MAIL_ADDRESS_DELIMITER),
    bcc: splitStringByDelimiters(bcc.bcc.value || '', MAIL_ADDRESS_DELIMITER),
    body: body.body.value, // 本文
    option: {
      includeBcc,
      skipOriginalQuote,
    },
  };
};
