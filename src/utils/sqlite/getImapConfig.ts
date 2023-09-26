import { ImapConfig } from "imap_config";
import { Database } from "sqlite3";

export const getImapConfig = async (db: Database, slackId: string) => {
  const existing = await new Promise((resolve) => {
    db.get(
      "SELECT * FROM imap_setting WHERE slack_id = ?",
      [slackId],
      (err, row) => {
        resolve(row);
      }
    );
  });

  return existing as ImapConfig | null;
};
