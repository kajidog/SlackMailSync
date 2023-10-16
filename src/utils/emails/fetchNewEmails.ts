import Imap from 'imap';
import { ParsedMail, simpleParser } from 'mailparser';
import { createReplayText } from './createReplayText';
import { formatDate } from '..';
const RETRY_COUNT = 5;
const MAIL_LENGTH = 1;

export interface MailInfo {
  id: number;
  body: string;
  from: string;
  to: string;
  cc: string;
  subject: string;
  parsedEmail: ParsedMail;
  messageId: string;
  url?: string;
  references: string;
}

export function fetchNewEmails(imap: Imap, callback: (mail: MailInfo) => Promise<boolean>, latestUid: number, retryCount = 0) {
  return new Promise<[number, Imap]>((resolveALL) => {
    const fetch = imap.fetch(`${latestUid - (MAIL_LENGTH - 1)}:${latestUid}`, {
      bodies: ['HEADER', 'TEXT'],
      struct: true,
    });

    let emailPromises: any[] = [];

    fetch.on('message', (message) => {
      const emailPromise = new Promise(async (resolve) => {
        let emailBuffer: any[] = [];

        message.on('body', (stream) => {
          stream.on('data', (chunk) => {
            emailBuffer.push(chunk);
          });
        });

        message.once('attributes', async (attrs) => {
          const emailId = attrs.uid;
          const parsedEmail: any = await simpleParser(Buffer.concat(emailBuffer));
          const fromText = parsedEmail.from.text || '';
          const toText = parsedEmail.to ? parsedEmail.to.text : '';
          const ccText = parsedEmail.cc ? parsedEmail.cc.text : '';
          const subject = parsedEmail.subject || '';
          const body = parsedEmail.text || '';
          const date = formatDate(parsedEmail.date || '');
          const replyText = createReplayText({ date, from: fromText, body });
          const messageId = parsedEmail.messageId || '';
          const references = parsedEmail.references || '';

          const isNewEmail = await callback({
            id: emailId,
            body: replyText,
            from: fromText,
            to: toText,
            cc: ccText,
            subject: subject,
            parsedEmail,
            messageId: messageId,
            references,
          });
          resolve(isNewEmail);
        });
      });

      emailPromises.push(emailPromise);
    });

    // 一通りメール取得後
    fetch.once('end', async () => {
      // 全ての処理が終わるのを待機
      const results = await Promise.all(emailPromises);

      // 新着のメールの件数をカウント
      const newEmailCount = results.filter((result) => result).length;
      console.log('Handled MAIL_LENGTH emails.', newEmailCount);

      // 終了条件
      // 取得件数と新着件数が同じ　かつ　ネストが指定回数以下
      // 上記の場合は再起的に再度メールを取得
      if (0 < newEmailCount && retryCount < RETRY_COUNT) {
        resolveALL(await fetchNewEmails(imap, callback, latestUid - MAIL_LENGTH, retryCount + 1));
        return;
      } else {
        // そうでない場合は終了
        resolveALL([newEmailCount + MAIL_LENGTH * retryCount, imap]);
      }
    });
  });
}
