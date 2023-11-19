import { Database } from 'sqlite3';
import { MailConfigValues } from '../../constants/ModalTemplate/MailConfigModalTemplate';

// DBにメールサーバの設定を保存
export const upsertMailServerConfig = async (db: Database, slackId: string, formData: MailConfigValues) => {
  const { imap, info, smtp } = formData;

  // imap
  await new Promise(async (resolve) => {
    const stmt = db.prepare(`INSERT INTO account_setting(slack_id, imap_host, imap_port, smtp_host, smtp_port, secure, user_name, password, update_at, is_job)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slack_id, user_name) 
        DO UPDATE SET
          slack_id = excluded.slack_id,
          imap_host = excluded.imap_host,
          imap_port = excluded.imap_port,
          smtp_host = excluded.smtp_host,
          smtp_port = excluded.smtp_port,
          secure = excluded.secure,
          user_name = excluded.user_name,
          password = excluded.password,
          update_at = excluded.update_at,
          is_job = excluded.is_job
          `);
    stmt.run(slackId, imap.host, imap.port, smtp.host, smtp.port, true, info.username, info.password, null, info.option.add_job, resolve);
    stmt.finalize();
  });
};
