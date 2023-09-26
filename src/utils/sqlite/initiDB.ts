import { Database, verbose } from "sqlite3";

export function initDB() {
  return new Promise<Database>((resolve) => {
    const sqlite3 = verbose();
    const db = new sqlite3.Database("emails.db");

    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS mail_box (id TEXT PRIMARY KEY, subject TEXT, sentDate TEXT, 'from' TEXT, 'to' TEXT, cc TEXT, body TEXT, url TEXT)"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS job_queue (id TEXT, slack_id TEXT, date TEXT, PRIMARY KEY(id, slack_id))"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS send_history (id TEXT, slack_id TEXT, date TEXT, PRIMARY KEY(id, slack_id))"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS imap_setting (slack_id TEXT, host TEXT, port TEXT, 'secure' BOOLEAN, user TEXT, password TEXT, update_at TEXT, is_job BOOLEAN, PRIMARY KEY(slack_id))"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS smtp_setting (slack_id TEXT, host TEXT, port TEXT, 'secure' BOOLEAN, user TEXT, password TEXT, PRIMARY KEY(slack_id))"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS event (slack_id TEXT, host TEXT, date TEXT, is_deleted  BOOLEAN, PRIMARY KEY(slack_id, host))"
      );
      resolve(db);
    });
  });
}
