import { Database } from 'sqlite3';
import { FilterValues } from '../../constants/ModalTemplate/MailFilterModalTemplate';

export const upsertFilter = async (db: Database, slackId: string, username: string, formData: FilterValues) => {
  const { filter_name, priority, subject, from, to, cc, action_type, forward_channel, memo } = formData;
  await new Promise(async (resolve) => {
    const stmt = db.prepare(`INSERT INTO filter(slack_id, user_name, filter_name, priority, subject, 'from', 'to', cc, action_type, forward_channel, memo)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slack_id, user_name, filter_name) 
        DO UPDATE SET
          slack_id = excluded.slack_id,
          user_name = excluded.user_name,
          filter_name = excluded.filter_name,
          priority = excluded.priority,
          subject = excluded.subject,
          'from' = excluded.'from',
          'to' = excluded.'to',
          cc = excluded.cc,
          action_type = excluded.action_type,
          forward_channel = excluded.forward_channel,
          memo = excluded.memo
          `);
    stmt.run(slackId, username, filter_name, priority, subject, from, to, cc, action_type, forward_channel, memo, resolve);
    stmt.finalize();
  });
};

