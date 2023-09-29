import { Database } from "sqlite3";
import { MailInfo } from "../emails/fetchNewEmails";
import { insertJobQueue } from "./insertJobQueue";
import { sendEmail } from "../emails/sendMail";
import { sendPostMessage } from "../slack/sendPostMessage";
import { Email } from "mail_box";

export const insertNewMail =
  (db: Database, slackId: string) => async (email: MailInfo) => {
    const { id, parsedEmail, subject, cc, from, to, body, messageId } = email;

    const existing = await new Promise<Email | null>((resolve) => {
      db.get(
        "SELECT id, url FROM mail_box WHERE id = ?",
        [messageId],
        (err, row) => {
          resolve(row as any);
        }
      );
    });

    //メールが新規もしくはURLが設定されていない場合は、DMに転送待ちに登録
    if (!existing || !existing.url) {
      await insertJobQueue(db, slackId)(email);
    }

    //　すでにURLが設定されている場合
    if (existing?.url) {
      await sendPostMessage(slackId, existing, existing.url);
      return false;
    }

    // メールが新規の場合
    if (!existing) {
      await new Promise(async (resolve) => {
        const stmt = db.prepare(
          "INSERT INTO mail_box VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        stmt.run(
          messageId,
          parsedEmail.subject,
          parsedEmail.date.toISOString(),
          from,
          to,
          cc,
          body,
          null,
          resolve
        );
        stmt.finalize();
      });
      await sendEmail(parsedEmail);
      return true;
    }
    return false;
  };
