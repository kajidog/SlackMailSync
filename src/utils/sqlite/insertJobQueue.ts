import { Database } from 'sqlite3';
import { MailInfo } from '../emails/fetchNewEmails';
import { createTimeStamp } from '..';

// 実行待ちに登録
export const insertJobQueue = (db: Database, slackId: string) => async (email: MailInfo) => {
  const { messageId } = email;

  const existing = await new Promise((resolve) => {
    db.get('SELECT id FROM job_queue WHERE id = ? and slack_id = ?', [messageId, slackId], (err, row) => {
      resolve(row);
    });
  });

  // 新規の場合
  if (!existing) {
    await new Promise(async (resolve) => {
      const stmt = db.prepare('INSERT INTO job_queue VALUES (?, ?, ?)');
      stmt.run(messageId, slackId, null, resolve);
      stmt.finalize();
    });

    return true;
  }
  return false;
};
