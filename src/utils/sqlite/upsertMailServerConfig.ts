import { Database } from "sqlite3";
import { MailConfigValues } from "../../constants/MailConfigModalTemplate";

export const upsertMailServerConfig = async (
  db: Database,
  slackId: string,
  formData: MailConfigValues
) => {
  const { imap, info, smtp } = formData;

  // imap
  await new Promise(async (resolve) => {
    const stmt =
      db.prepare(`INSERT INTO imap_setting(slack_id, host, port, secure, user, password, update_at, is_job)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slack_id) 
        DO UPDATE SET
          slack_id = excluded.slack_id,
          host = excluded.host,
          port = excluded.port,
          secure = excluded.secure,
          user = excluded.user,
          password = excluded.password,
          update_at = excluded.update_at,
          is_job = excluded.is_job
          `);
    stmt.run(
      slackId,
      imap.host,
      imap.port,
      true,
      info.username,
      info.password,
      null,
      info.option.add_job,
      resolve
    );
    stmt.finalize();
  });

  // smtp
  if (smtp.host && smtp.port) {
    await new Promise(async (resolve) => {
      const stmt =
        db.prepare(`INSERT INTO smtp_setting(slack_id, host, port, secure, user, password)
        VALUES(?, ?, ?, ?, ?, ?)
        ON CONFLICT(slack_id) 
        DO UPDATE SET
          slack_id = excluded.slack_id,
          host = excluded.host,
          port = excluded.port,
          secure = excluded.secure,
          user = excluded.user,
          password = excluded.password`);
      stmt.run(
        slackId,
        smtp.host,
        smtp.port,
        true,
        info.username,
        info.password,
        resolve
      );
      stmt.finalize();
    });
  }
};
