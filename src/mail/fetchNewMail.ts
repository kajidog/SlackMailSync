import Imap from 'imap';
import { fetchNewEmails } from '../utils/emails/fetchNewEmails';
import { handleEmail } from '../utils/emails/handleEmail';
import { insertMailBox } from '../utils/sqlite/insertMailBox';
import { initDB } from '../utils/sqlite/initiDB';
import { updateAccountExecutionTime } from '../utils/sqlite/updateAccountExecutionTime';
import { getAccountConfigByName } from '../utils/sqlite/getAccountConfigByName';

export async function fetchNewMail(slackId: string, username: string) {
  const db = await initDB();
  const config = await getAccountConfigByName(db, slackId, username);

  if (!config || !config.imap_host) {
    db.close();
    return -1;
  }
  await updateAccountExecutionTime(db, slackId, username);

  return new Promise<number>((resolve, reject) => {
    console.table({
      config,
    });

    const imap = new Imap({
      host: config.imap_host,
      user: config.user_name,
      password: config.password,
      port: parseInt(config.imap_port),
      tls: !!config.secure,
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          console.error('INBOX error:', err);
          db.close();
          resolve(-1);
          return;
        }
        fetchNewEmails(imap, handleEmail(insertMailBox(db, slackId)), box.uidnext - 1).then(async ([count, imap]) => {
          await imap.end();
          db.close();
          resolve(count);
        }).catch((err) => {
          console.error('IMAP error:', err);
          resolve(-1);
        })
      });
    });

    imap.once('error', async (err: any) => {
      console.error('IMAP error:', err);
      resolve(-1);
    });

    imap.once('end', function () {
      console.log('Connection ended');
    });
    imap.connect();
  });
}
