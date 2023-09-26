import { Database } from "sqlite3";

export const updateMailJobComplete = async (
  db: Database,
  mailId: string,
  slackId: string
) => {
  // imap
  await new Promise(async (resolve) => {
    const stmt = db.prepare(`
        UPDATE job_queue 
        SET 
            date = ?
        WHERE slack_id = ? AND id = ?
        `);
    stmt.run(new Date().toISOString(), slackId, mailId, resolve);
    stmt.finalize();
  });
};
