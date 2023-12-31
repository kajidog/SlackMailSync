import { Email } from 'mail_box';
import { convertDateFormat } from '../../utils';
import { actionIds } from '..';

export const NewMailMessageTemplate = (mailInfo: Email, url: string) => {
  const MailInfo = [{
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `:email: *<${url}|${mailInfo.subject}>*`,
    },
  },
  {
    type: 'section',
    fields: [
      {
        type: 'mrkdwn',
        text: `*送信元:* ${mailInfo.from}`,
      },
      {
        type: 'mrkdwn',
        text: `*送信日:* ${convertDateFormat(mailInfo.sentDate)}`,
      },
      {
        type: 'mrkdwn',
        text: `*宛先:* ${mailInfo.to}`,
      },
      {
        type: 'mrkdwn',
        text: `*CC:* ${mailInfo.cc || 'なし'}`,
      },
    ],
  },]

  const ActionBotton = [
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: '返信',
          },
          style: 'primary',
          value: mailInfo.id,
          action_id: actionIds.MAIL_REPLAY,
        },
      ],
    },
  ]
  return {
    MailInfo,
    ActionBotton
  }
};
