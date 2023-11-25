import { Database } from 'sqlite3';

export const deleteMailFilterConfig = async (db: Database, slackId: string, username: string, filtername: string) => {
  const existing = await new Promise((resolve) => {
    db.get('DELETE FROM filter WHERE slack_id = ? AND user_name = ? AND filter_name = ?', [slackId, username, filtername], (err, row) => {
      resolve(row);
    });
  });

  return existing;
};
