import { app } from "../../app";
import { convertDateFormat, getChannelIDByUserID } from "..";
import { Email } from "mail_box";

export const sendPostMessage = async (
  slack_id: string,
  mailInfo: Email,
  url: string
) => {
  const userChannel = await getChannelIDByUserID(slack_id);

  await app.client.chat.postMessage({
    channel: userChannel.id,
    text: `:email: *<${url}|${
      mailInfo.subject
    }>*\n  送信日: ${convertDateFormat(mailInfo.sentDate)}\n  送信者: ${
      mailInfo.from
    }\n  送信先: ${mailInfo.to}${mailInfo.cc ? "\n  cc: " + mailInfo.cc : ""}`,
    unfurl_links: true,
    unfurl_media: true,
  });
};
