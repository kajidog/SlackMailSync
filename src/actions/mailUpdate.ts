import { sendHomeTab } from '../utils/slack/sendHomeTab';
import { fetchNewMail } from '../mail/fetchNewMail';
import { BlockButtonActionEvent } from '../types/slack';
import { createEmailConfigBlocks } from '../constants/MessageTemplate/createEmailConfigBlocks';

// 手動でメール受信
export const mailUpdate = async (e: BlockButtonActionEvent) => {
  const { body } = e;
  e.ack();
  const username = body.actions[0].value;

  if (!username) {
    return
  }

  // ユーザーのタブを読み込み中にしておく
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
    ...(await createEmailConfigBlocks(body.user.id, true)),
  ]);

  const newCount = await fetchNewMail(body.user.id, username);

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
    ...(await createEmailConfigBlocks(body.user.id)),
  ]);
};
