import { SmtpConfig } from 'smtp_config';
import { Database } from 'sqlite3';

export const getSMTP_Config = async (db: Database, slackId: string) => {
  const existing: any = await new Promise((resolve) => {
    db.get('SELECT * FROM smtp_setting WHERE slack_id = ?', [slackId], (err, row) => {
      resolve(row);
    });
  });

  if (existing) {
    return {
      ...existing,
      port: parseInt(existing.port || 0),
    } as SmtpConfig;
  }
  return null;
};
