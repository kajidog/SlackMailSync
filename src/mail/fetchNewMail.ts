import Imap from 'imap';
import { fetchNewEmails } from '../utils/emails/fetchNewEmails';
import { handleEmail } from '../utils/emails/handleEmail';
import { insertMailBox } from '../utils/sqlite/insertMailBox';
import { initDB } from '../utils/sqlite/initiDB';
import { getIMAP_Config } from '../utils/sqlite/getIMAP_Config';
import { updateIMAP_ExecutionTime } from '../utils/sqlite/updateIMAP_ExecutionTime';

export async function fetchNewMail(slackId: string) {
  const db = await initDB();
  const imapConfig = await getIMAP_Config(db, slackId);

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
    imap.once('error', (err: any) => {
      console.error('IMAP error:', err);
      reject(err);
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) throw err;
        fetchNewEmails(imap, handleEmail(insertMailBox(db, slackId)), box.uidnext - 1).then(async (count) => {
          await updateIMAP_ExecutionTime(db, slackId);
          imap.end();
          resolve(count);
        });
      });
    });

    imap.connect();
  });
}
