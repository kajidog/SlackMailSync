import { Block, KnownBlock } from '@slack/bolt';
import { app } from '../../app';

// DMへメッセージを送信
export async function sendMessageWithBlock(userId: string, blocks?: (Block | KnownBlock)[], text?: string) {
  try {
    // ユーザーとのDMのチャンネルIDを取得
    const { channel } = await app.client.conversations.open({
      users: userId,
    });

    const result = await app.client.chat.postMessage({
      channel: channel.id,
      blocks,
      text,
    });
  } catch (error) {
    console.error(error);
  }
}
