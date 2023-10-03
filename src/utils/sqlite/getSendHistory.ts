import { SendHistory } from "sendHistory";
import { Database } from "sqlite3";

export const getSendHistory = async (
  db: Database,
  slackId: string,
  messageId: string
) => {
  const existing: any = await new Promise((resolve) => {
    db.get(
      "SELECT * FROM send_history WHERE slack_id = ? AND id = ?",
      [slackId, messageId],
      (err, row) => {
        resolve(row);
      }
    );
  });

  return existing as SendHistory | null;
};
