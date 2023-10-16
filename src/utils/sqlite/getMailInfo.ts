import { Email } from 'mail_box';
import { Database } from 'sqlite3';

export const getMailInfo = async (db: Database, id: string) => {
  const existing = await new Promise((resolve) => {
    db.get('SELECT * FROM mail_box WHERE id = ?', [id], (err, row) => {
      resolve(row);
    });
  });

  return existing as Email | null;
};
