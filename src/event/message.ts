import { updateMailBoxURL } from '../utils/sqlite/updateMailBoxURL';
import { initDB } from '../utils/sqlite/initiDB';
import { getJobQueue } from '../utils/sqlite/getJobQueue';
import { updateJobQueueExecutionTime } from '../utils/sqlite/updateJobQueueExecutionTime';
import { sendPostMessage } from '../utils/slack/sendPostMessage';
import { getMailInfo } from '../utils/sqlite/getMailInfo';

export const messageEvent = async (event: any) => {
  // ファイル共有以外のメッセージ
  if (event.message.subtype !== 'file_share') {
    return;
  }

  // メールBOXチャンネル以外
  if (event.message.channel !== process.env.SLACK_MAIL_BOX_CHANNEL_ID) {
    return;
  }

  // 添付ファイルが複数
  if (event.message.files.length !== 1) {
    return;
  }

  for (const file of event.message.files || []) {
    if (file.filetype !== 'email') {
      break;
    }
    const mailID = file.from?.[0]?.name;
    if (!mailID) {
      break;
    }

    const db = await initDB();
    const mailInfo = await getMailInfo(db, mailID);
    if (mailInfo === null) {
      return;
    }

    // URL 登録
    void (await updateMailBoxURL(db, mailID, file.permalink));

    // wait list 宛にURLを送信
    const waitList = await getJobQueue(db, mailID);
    for (const { slack_id } of waitList) {
      await sendPostMessage(slack_id, mailInfo, file.permalink);
      await updateJobQueueExecutionTime(db, mailID, slack_id);
    }
    db.close();
  }
};
