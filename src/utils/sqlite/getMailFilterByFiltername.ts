import { Filter } from 'filter';
import { Database } from 'sqlite3';

export const getMailFilterByFiltername = async (db: Database, slackId: string, user_name: string, filtername: string) => {
  const existing = await new Promise((resolve) => {
    db.get('SELECT * FROM filter WHERE slack_id = ? and user_name = ? and filter_name = ?', [slackId, user_name, filtername], (err, row) => {
      resolve(row);
    });
  });

  return existing as Filter | null;
};
