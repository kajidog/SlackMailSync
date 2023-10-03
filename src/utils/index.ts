import { Block, KnownBlock } from "@slack/bolt";
import { app } from "../app";
import { parseISO, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

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

export function convertDateFormat(
  isoStr: string,
  timezone: string = "Asia/Tokyo"
) {
  const date = parseISO(isoStr);

  // タイムゾーンに合わせて変換
  const zonedDate = utcToZonedTime(date, timezone);

  // yyyy/mm/dd HH:MM:SS形式にフォーマットして返す
  return format(zonedDate, "yyyy/MM/dd HH:mm:ss");
}
