import { Database } from "sqlite3";
import { MailInfo } from "../emails/fetchNewEmails";
import { insertJobQueue } from "./insertJobQueue";
import { sendEmail } from "../emails/sendMail";

export const insertNewMail =
  (db: Database, slackId: string) => async (email: MailInfo) => {
    const { id, parsedEmail, subject, cc, from, to, body, messageId } = email;

    const existing = await new Promise<MailInfo | null>((resolve) => {
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
