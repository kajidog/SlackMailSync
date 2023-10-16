import { Database } from 'sqlite3';

// 実行待ち取得
export const getJobQueue = async (db: Database, id: string) => {
  const existing = await new Promise((resolve) => {
    db.all('SELECT * FROM job_queue WHERE id = ? AND date is null', [id], (err, row) => {
      resolve(row);
    });
  });

  return existing as { id: string; slack_id: string }[];
};
