import { fetchNewMail } from '../../mail/fetchNewMail';
import { getAccountJob } from '../sqlite/getAccountJob';
import { initDB } from '../sqlite/initiDB';

// 定期的にIMAPからメールを取得する関数
export const IMAP_Job = async (): Promise<void> => {

  console.log('job ready');
  try {
    setInterval(getMail, 15000)
  } catch (error) {
    console.log(error);
  }
  return;
};

async function getMail() {
  const db = await initDB();
  const config = await getAccountJob(db);
  db.close();
  try {
    if (config) {
      console.log('job done', config.slack_id);
      await fetchNewMail(config.slack_id, config.user_name);
    }
  } catch (error) {
    console.log(error, config);
  }
}