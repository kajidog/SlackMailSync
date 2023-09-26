import { Database } from "sqlite3";

export const getWaitList = async (db: Database, id: string) => {
  const existing = await new Promise((resolve) => {
    db.all(
      "SELECT * FROM job_queue WHERE id = ? AND date is null",
      [id],
      (err, row) => {
        resolve(row);
      }
    );
  });

  return existing as { id: string; slack_id: string }[];
};
