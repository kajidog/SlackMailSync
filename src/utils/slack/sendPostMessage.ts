import { app } from '../../app';
import { convertDateFormat } from '..';
import { Email } from 'mail_box';
import { NewMailMessageTemplate } from '../../constants/MessageTemplate/NewMailMessageTemplate';
import { getChannelIDByUserID } from './getChannelIDByUserID';

export const sendPostMessage = async (slack_id: string, mailInfo: Email, url: string) => {
  if (slack_id === 'U01F68QPHJP' && -1 < mailInfo?.to?.indexOf('naganuma@icraft.jp')) {
    return;
  }

  const userChannel = await getChannelIDByUserID(slack_id); // 送信先のIDを取得

  // メッセージを生成して送信
  await app.client.chat
    .postMessage({
      channel: userChannel.id,
      text: `:email: *<${url}|${mailInfo.subject}>*\n  送信日: ${convertDateFormat(mailInfo.sentDate)}\n  送信者: ${mailInfo.from}\n  送信先: ${mailInfo.to}${
        mailInfo.cc ? '\n  cc: ' + mailInfo.cc : ''
      }`,
      blocks: NewMailMessageTemplate(mailInfo, url),
      unfurl_links: true,
      unfurl_media: true,
    })
    .catch((err) => {
      console.log('fail postmessage');
      console.log(err);
    });
};
