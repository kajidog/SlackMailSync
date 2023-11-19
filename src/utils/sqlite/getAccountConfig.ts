import { AccountConfig } from 'account_config';
import { Database } from 'sqlite3';

export const getAccount_Config = async (db: Database, slackId: string) => {
  const existing = await new Promise((resolve) => {
    db.all('SELECT * FROM account_setting WHERE slack_id = ?', [slackId], (err, row) => {
      resolve(row);
    });
  });

  return existing as AccountConfig[] | null;
};
