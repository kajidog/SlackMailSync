import { sendHomeTab } from '../utils/slack/sendHomeTab';
import { fetchNewMail } from '../mail/fetchNewMail';
import { BlockButtonActionEvent } from '../types/slack';
import { createImapConfigBlocks } from '../slack/createImapConfigBlocks';

// 手動でメール受信
export const mailUpdate = async (e: BlockButtonActionEvent) => {
  const { body } = e;
  e.ack();
  sendHomeTab(e, body.user.id, [
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: '処理中...',
          emoji: true,
        },
      ],
    },
    ...(await createImapConfigBlocks(body.user.id, true)),
  ]);

  const newCount = await fetchNewMail(body.user.id);
  sendHomeTab(e, body.user.id, [
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: `完了(新着件数: ${newCount})`,
          emoji: true,
        },
      ],
    },
    ...(await createImapConfigBlocks(body.user.id)),
  ]);
};
