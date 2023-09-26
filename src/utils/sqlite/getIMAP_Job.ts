import { ImapConfig } from "imap_config";
import { Database } from "sqlite3";

export const getIMAP_Job = async (db: Database) => {
  const existing = await new Promise((resolve) => {
    db.get(
      `SELECT * FROM imap_setting WHERE is_job = TRUE
        ORDER BY 
            CASE WHEN update_at IS NULL THEN 1 ELSE 0 END, 
            update_at ASC 
        LIMIT 1
      `,
      [],
      (_, row) => {
        resolve(row);
      }
    );
  });

  return existing as ImapConfig | null;
};
