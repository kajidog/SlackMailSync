import Imap from "imap";
import { fetchNewEmails } from "../utils/emails/fetchNewEmails";
import { handleEmail } from "../utils/emails/handleEmail";
import { insertNewMail } from "../utils/sqlite/insertNewMail";
import { initDB } from "../utils/sqlite/initiDB";
import { getImapConfig } from "../utils/sqlite/getImapConfig";
import { updateIMAP_Date } from "../utils/sqlite/updateIMAP_Date";

export async function fetchNewMail(slackId: string) {
  const db = await initDB();
  const imapConfig = await getImapConfig(db, slackId);

  if (!imapConfig) {
    return;
  }

  return new Promise<number>((resolve, reject) => {
    console.table({
      imapConfig,
    });

    const imap = new Imap({
      host: imapConfig.host,
      user: imapConfig.user,
      password: imapConfig.password,
      port: parseInt(imapConfig.port),
      tls: !!imapConfig.secure,
    });
    imap.once("error", (err: any) => {
      console.error("IMAP error:", err);
      reject(err);
    });

    imap.once("end", () => {
      console.log("IMAP connection ended");
    });

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) throw err;
        fetchNewEmails(
          imap,
          handleEmail(insertNewMail(db, slackId)),
          box.uidnext - 1
        ).then(async (count) => {
          await updateIMAP_Date(db, slackId);
          imap.end();
          resolve(count);
        });
      });
    });

    imap.connect();
  });
}
