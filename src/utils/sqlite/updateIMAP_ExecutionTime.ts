import { Database } from 'sqlite3';

// IMAPから取得した時間を記録
export const updateIMAP_ExecutionTime = async (db: Database, slackId: string) => {
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
