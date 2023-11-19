import { actionIds } from '..';

export const EmptyConfigTemplate = [
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
  ]