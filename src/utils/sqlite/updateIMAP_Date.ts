import { Database } from "sqlite3";

export const updateIMAP_Date = async (db: Database, slackId: string) => {
  // imap
  await new Promise(async (resolve) => {
    const stmt = db.prepare(`
        UPDATE imap_setting 
        SET 
            update_at = ?
        WHERE slack_id = ?
        `);
    stmt.run(new Date().toISOString(), slackId, resolve);
    stmt.finalize();
  });
};
