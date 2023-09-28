import { Email } from "mail_box";
import sqlite3 from "sqlite3";

class DatabaseHandler {
  private db: sqlite3.Database;

  constructor(databasePath: string) {
    this.db = new sqlite3.Database(databasePath, (err) => {
      if (err) {
        console.error("Error connecting to the database:", err);
      }
    });
  }

  public getEmailByMessageId(
    messageId: string,
    callback: (error: Error | null, row: any) => void
  ): void {
    const query = "SELECT * FROM mail_box WHERE id = ?";
    this.db.get(query, [messageId], (err, row) => {
      callback(err, row);
    });
  }

  // Remember to close the database connection when you're done
  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
}

export function getEmailByMessageId(messageIdToSearch: string) {
  return new Promise<Email | null>((resolve, reject) => {
    const dbHandler = new DatabaseHandler("emails.db");
    dbHandler.getEmailByMessageId(messageIdToSearch, (err, email) => {
      if (err) {
        console.error("Error fetching email:", err);
        reject(err);
        return;
      } else if (email) {
        resolve(email as Email);
        console.log("Fetched email:", email);
      } else {
        console.log("No email found with the given message ID.");
        resolve(null);
      }
      dbHandler.close();
    });
  });
}
