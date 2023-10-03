import { Database } from "sqlite3";
import { MailInfo } from "../emails/fetchNewEmails";
import { createTimeStamp } from "..";

export const insertSendHistory = (
  db: Database,
  slackId: string,
  messageId: string
) => {
  return new Promise(async (resolve) => {
    const stmt = db.prepare("INSERT INTO send_history VALUES (?, ?, ?)");
    stmt.run(messageId, slackId, createTimeStamp(), resolve);
    stmt.finalize();
  });
};
