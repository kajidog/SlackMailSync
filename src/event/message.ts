import { convertDateFormat, getChannelIDByUserID } from "../utils";
import { getEmailByMessageId } from "../utils/sqlite";
import { updateMailBoxURL } from "../utils/sqlite/updateMailBoxURL";
import { initDB } from "../utils/sqlite/initiDB";
import { getWaitList } from "../utils/sqlite/getWaitList";
import { updateMailJobComplete } from "../utils/sqlite/updateMailJobComplete";
import { sendPostMessage } from "../utils/slack/sendPostMessage";

export const messageEvent = async (event: any) => {
  const { client, message } = event;

  if (message.thread_ts) {
    try {
      // conversations.repliesを使用してスレッド内の全メッセージを取得
      const result = await client.conversations.replies({
        channel: message.channel,
        ts: message.thread_ts,
      });

      // 最初のメッセージ（スレッドの元のメッセージ）を取得
      const originalMessage = result.messages[0];

      // 元のメッセージの内容をログ出力
      console.log(originalMessage.text);
    } catch (error) {
      console.error(error);
    }
  }

  // ファイル共有以外のメッセージ
  if (event.message.subtype !== "file_share") {
    return;
  }

  // メールBOXチャンネル以外
  if (event.message.channel !== "C034A889TSS") {
    return;
  }

  // 添付ファイルが複数
  if (event.message.files.length !== 1) {
    return;
  }

  for (const file of event.message.files || []) {
    if (file.filetype !== "email") {
      break;
    }
    const mailID = file.from?.[0]?.name;
    if (!mailID!) {
      break;
    }
    const mailInfo = await getEmailByMessageId(mailID);
    if (mailInfo === null) {
      return;
    }

    const db = await initDB();

    // URL 登録
    void (await updateMailBoxURL(db, mailID, file.permalink));

    // wait list 宛にURLを送信
    const waitList = await getWaitList(db, mailID);
    for (const { slack_id } of waitList) {
      await sendPostMessage(slack_id, mailInfo, file.permalink);
      await updateMailJobComplete(db, mailID, slack_id);
    }
  }
};
