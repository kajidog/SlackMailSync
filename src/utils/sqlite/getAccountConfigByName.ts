import { AccountConfig } from 'account_config';
import { Database } from 'sqlite3';

export const getAccountConfigByName = async (db: Database, slackId: string, name: string) => {
  const existing = await new Promise((resolve) => {
    db.get('SELECT * FROM account_setting WHERE slack_id = ? AND user_name = ?', [slackId, name], (err, row) => {
      resolve(row);
    });
  });

  return existing as AccountConfig | null;
};
