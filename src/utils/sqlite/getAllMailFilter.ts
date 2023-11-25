import { Filter } from 'filter';
import { Database } from 'sqlite3';

export const getAllMailFilter = async (db: Database, slackId: string) => {
  const existing = await new Promise((resolve) => {
    db.all('SELECT * FROM filter WHERE slack_id = ? ORDER BY priority desc', [slackId], (err, row) => {
      resolve(row);
    });
  });

  return existing as Filter[] | null;
};
