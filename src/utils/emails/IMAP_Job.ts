import { fetchNewMail } from "../../mail/fetchNewMail";
import { getIMAP_Job } from "../sqlite/getIMAP_Job";
import { initDB } from "../sqlite/initiDB";

export const IMAP_Job = async (): Promise<void> => {
  console.log("job done");
  const db = await initDB();
  const config = await getIMAP_Job(db);

  try {
    if (config) {
      console.log("job done", config.slack_id);

      await fetchNewMail(config.slack_id);
    }
  } catch (error) {
    console.log(error, config);
  }
  await delay(30);
  return IMAP_Job();
};

function delay(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000); // 秒をミリ秒に変換
  });
}
