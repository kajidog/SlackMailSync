import { Database, verbose } from 'sqlite3';

export function initDB() {
  return new Promise<Database>((resolve) => {
    const sqlite3 = verbose();
    const db = new sqlite3.Database('emails.db');

    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS mail_box (id TEXT PRIMARY KEY, subject TEXT, sentDate TEXT, 'from' TEXT, 'to' TEXT, cc TEXT, body TEXT, url TEXT, 'references' TEXT)");
      db.run('CREATE TABLE IF NOT EXISTS job_queue (id TEXT, slack_id TEXT, date TEXT, PRIMARY KEY(id, slack_id))');
      db.run('CREATE TABLE IF NOT EXISTS send_history (id TEXT, slack_id TEXT, date TEXT, PRIMARY KEY(id, slack_id))');
      db.run(
        "CREATE TABLE IF NOT EXISTS imap_setting (slack_id TEXT, host TEXT, port TEXT, 'secure' BOOLEAN, user TEXT, password TEXT, update_at TEXT, is_job BOOLEAN, PRIMARY KEY(slack_id))",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS account_setting (slack_id TEXT, imap_host TEXT, imap_port TEXT, smtp_host TEXT, smtp_port TEXT, 'secure' BOOLEAN, user_name TEXT, password TEXT, update_at TEXT, is_job BOOLEAN, PRIMARY KEY(slack_id, 'user_name'))",
      );
      db.run("CREATE TABLE IF NOT EXISTS smtp_setting (slack_id TEXT, host TEXT, port TEXT, 'secure' BOOLEAN, user TEXT, password TEXT, PRIMARY KEY(slack_id))");
      db.run('CREATE TABLE IF NOT EXISTS event (slack_id TEXT, host TEXT, date TEXT, is_deleted  BOOLEAN, PRIMARY KEY(slack_id, host))');
      db.run(`CREATE TABLE IF NOT EXISTS filter (slack_id TEXT, user_name TEXT, filter_name TEXT, priority INT, subject TEXT, 'from' TEXT, 'to' TEXT, cc TEXT, action_type TEXT, forward_channel TEXT, PRIMARY KEY(slack_id, user_name, filter_name))`);
      resolve(db);
    });
  });
}
