import { app } from '../../app';
import { convertDateFormat, removeDuplicates } from '..';
import { Email } from 'mail_box';
import { NewMailMessageTemplate } from '../../constants/MessageTemplate/NewMailMessageTemplate';
import { getChannelIDByUserID } from './getChannelIDByUserID';
import { initDB } from '../sqlite/initiDB';
import { getMailFilter } from '../sqlite/getMailFilter';
import { Block } from '@slack/bolt';

export const sendPostMessage = async (slack_id: string, mailUser: string, mailInfo: Email, url: string) => {
  if (slack_id === 'U01F68QPHJP' && -1 < mailInfo?.to?.indexOf('naganuma@icraft.jp')) {
    return;
  }

  const { channels: sendChannels, memo } = await getSendChannels(slack_id, mailUser, mailInfo); // 転送先を取得
  const imChannel = await getChannelIDByUserID(slack_id);
  console.log("sendChannels", { slack_id, mailUser, sendChannels });

  const { MailInfo, ActionBotton } = NewMailMessageTemplate(mailInfo, url);
  const mailText = `:email: *<${url}|${mailInfo.subject}>*\n  送信日: ${convertDateFormat(mailInfo.sentDate)}\n  送信者: ${mailInfo.from}\n  送信先: ${mailInfo.to}${mailInfo.cc ? '\n  cc: ' + mailInfo.cc : ''
    }`

  // メッセージ送信
  for (const channelId of sendChannels) {
    let sendMailBlock: any[] = [...MailInfo]
    if (imChannel.id === channelId) {
      sendMailBlock = [...sendMailBlock, ...ActionBotton]
    }
    if (memo[channelId]) {
      sendMailBlock = [...sendMailBlock, ...memo[channelId]]
    }
    try {
      await app.client.chat
        .postMessage({
          channel: channelId,
          text: mailText,
          blocks: sendMailBlock,
          unfurl_links: true,
          unfurl_media: true,
        })
        .catch((err) => {
          console.log('fail postmessage');
          console.log(err);
        });
    } catch (error) {
      console.log('fail postmessage');
      console.log(error);
    }
  }

};





async function getSendChannels(slackId: string, mail_user_name: string, mailInfo: Email) {
  const imChannel = await getChannelIDByUserID(slackId);
  const db = await initDB();
  const filters = await getMailFilter(db, slackId, mail_user_name);
  let sendChannels: string[] = [];
  let memo: { [channelid: string]: any[] } = {}
  let cancelflg = false;
  for (const filter of filters) {

    let hit = false

    // フィルターがメールにヒットするか
    if (filter.subject && -1 < mailInfo?.subject?.indexOf(filter.subject)) {
      hit = true;
    }
    else if (filter.from && -1 < mailInfo?.from?.indexOf(filter.from)) {
      hit = true;
    }
    else if (filter.cc && -1 < mailInfo?.cc?.indexOf(filter.cc)) {
      hit = true;
    }
    else if (filter.to && -1 < mailInfo?.to?.indexOf(filter.to)) {
      hit = true;
    }

    // ヒットしなければスキップ
    if (hit === false) {
      continue;
    }

    // ヒットした場合の処理
    // ブロックの場合は中断。以降のフィルターを実行しない
    if (filter.action_type === "block") {
      cancelflg = true;
      break;
    }

    // DMに受信する
    if (filter.action_type === "default" || filter.action_type === "forward_1") {
      sendChannels.push(imChannel.id);
    }

    // 指定のチャンネルに転送
    if (filter.action_type === "forward_1" || filter.action_type === "forward_2") {
      const forwardChannels = filter?.forward_channel?.split(",") || [];

      // メモ追加
      filter.memo && forwardChannels.forEach(channle => {
        if (!memo[channle]) {
          memo[channle] = [];
        }
        memo[channle].push(
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: filter.memo,
            },
          });
      });
      sendChannels = [...sendChannels, ...forwardChannels];
    }
  }

  // キャンセルしてなく、転送先がなければDMに転送
  if (!cancelflg && sendChannels.length <= 0) {
    return { channels: [imChannel.id], memo: {} }
  }
  //重複したチャンネルをなくしてから転送するチャンネルIDを返す
  return { channels: removeDuplicates(sendChannels), memo };
}