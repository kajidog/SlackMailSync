import { app } from '../../app';
import { convertDateFormat, removeDuplicates } from '..';
import { Email } from 'mail_box';
import { NewMailMessageTemplate } from '../../constants/MessageTemplate/NewMailMessageTemplate';
import { getChannelIDByUserID } from './getChannelIDByUserID';
import { getSendChannels } from './getSendChannels';

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
    let sendMailBlock: any[] = [...MailInfo];

    // DMに送信の場合のみ、返信ボタンを追加
    if (imChannel.id === channelId) {
      sendMailBlock = [...sendMailBlock, ...ActionBotton]
    }

    // メモがある場合は後ろに追加
    if (memo[channelId]) {
      sendMailBlock = [...sendMailBlock, ...memo[channelId]]
    }

    // メッセージ送信
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


