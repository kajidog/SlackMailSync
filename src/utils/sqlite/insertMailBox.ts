import { Database } from 'sqlite3';
import { MailInfo } from '../emails/fetchNewEmails';
import { insertJobQueue } from './insertJobQueue';
import { sendEmail } from '../emails/sendMail';
import { sendPostMessage } from '../slack/sendPostMessage';
import { Email } from 'mail_box';
import { getSendHistory } from './getSendHistory';
import { insertSendHistory } from './insertSendHistory';

export const insertMailBox = (db: Database, slackId: string) => async (email: MailInfo) => {
  const { id, parsedEmail, subject, cc, from, to, body, messageId, references } = email;

  const existing = await new Promise<Email | null>((resolve) => {
    db.get('SELECT * FROM mail_box WHERE id = ?', [messageId], (err, row) => {
      resolve(row as any);
    });
  });

  //メールが新規もしくはURLが設定されていない場合は、DMに転送待ちに登録
  if (!existing || !existing.url) {
    await insertJobQueue(db, slackId)(email);
  }

  //　すでにURLが設定されている場合
  if (existing?.url && existing?.id) {
    const history = await getSendHistory(db, slackId, existing.id);
    if (history) {
      return false;
    }
    await sendPostMessage(slackId, existing, existing.url);
    await insertSendHistory(db, slackId, existing.id);
    return true;
  }

  // メールが新規の場合
  if (!existing) {
    await new Promise(async (resolve) => {
      const stmt = db.prepare('INSERT INTO mail_box VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run(messageId, parsedEmail.subject, parsedEmail.date.toISOString(), from, to, cc, body, null, references, resolve);
      stmt.finalize();
    });
    try {
      await sendEmail(parsedEmail);
    } catch (error) {
      console.log('fail send mail');
      console.log(error);
    }
    await insertSendHistory(db, slackId, messageId);

    return true;
  }
  return false;
};
