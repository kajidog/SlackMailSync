import { Database } from 'sqlite3';

// IMAPから取得した時間を記録
export const updateAccountExecutionTime = async (db: Database, slackId: string, username: string) => {
  await new Promise(async (resolve) => {
    const stmt = db.prepare(`
        UPDATE account_setting 
        SET 
            update_at = ?
        WHERE slack_id = ? AND user_name = ?
        `);
    stmt.run(new Date().toISOString(), slackId, username,resolve);
    stmt.finalize();
  });
};
