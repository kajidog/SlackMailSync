import { Database } from 'sqlite3';
import { MailInfo } from '../emails/fetchNewEmails';

// Slackにメールを転送して、そのメールの届く待ちに登録
export const insertJobQueue = (db: Database, slackId: string, user_name: string) => async (email: MailInfo) => {
  const { messageId } = email;

  const existing = await new Promise((resolve) => {
    db.get('SELECT id FROM job_queue WHERE id = ? and slack_id = ? user_name = ?', [messageId, slackId, user_name], (err, row) => {
      resolve(row);
    });
  });

  // 新規の場合
  if (!existing) {
    await new Promise(async (resolve) => {
      const stmt = db.prepare('INSERT INTO job_queue VALUES (?, ?, ?, ?)');
      stmt.run(messageId, slackId, null, user_name, resolve);
      stmt.finalize();
    });
    return true;
  }
  return false;
};
