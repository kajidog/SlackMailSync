import { Filter } from 'filter';
import { Database } from 'sqlite3';

export const getMailFilter = async (db: Database, slackId: string, user_name: string) => {
  const existing = await new Promise((resolve) => {
    db.all('SELECT * FROM filter WHERE slack_id = ? and user_name = ?', [slackId, user_name], (err, row) => {
      resolve(row);
    });
  });

  return existing as Filter[] | null;
};
