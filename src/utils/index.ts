import { Block, KnownBlock } from "@slack/bolt";
import { app } from "../app";

export async function getChannelIDByUserID(userId: string) {
  return await app.client.conversations
    .open({
      users: userId,
    })
    .then(({ channel }) => channel);
}

// DMへメッセージを送信
export async function sendMessageWithBlock(
  userId: string,
  blocks?: (Block | KnownBlock)[],
  text?: string
) {
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

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

export const createTimeStamp = () => new Date().toISOString();

export function convertDateFormat(dateStr: string) {
  const date = new Date(dateStr);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}
