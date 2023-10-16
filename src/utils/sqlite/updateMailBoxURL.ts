import { Database } from 'sqlite3';

export const updateMailBoxURL = async (db: Database, mailId: string, url: string) => {
  await new Promise(async (resolve) => {
    const stmt = db.prepare(`UPDATE mail_box SET url = ? WHERE id = ? `);
    stmt.run(url, mailId, resolve);
    stmt.finalize();
  });
};
