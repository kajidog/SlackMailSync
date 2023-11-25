import { BlockButtonActionEvent } from '../types/slack';
import { initDB } from '../utils/sqlite/initiDB';
import { sendHomeTab } from '../utils/slack/sendHomeTab';
import { deleteAccountConfig } from '../utils/sqlite/deleteAccountConfig';
import { deleteMailFilterConfig } from '../utils/sqlite/deleteMailFilterConfig';

export const deleteMailFilter = async (e: BlockButtonActionEvent) => {
  const { body, } = e;
  e.ack();
  console.log("delete filter", body.actions[0].value);
  const [username, filtername] = body.actions[0]?.value?.split("--------") ?? [];

  const db = await initDB();
  await deleteMailFilterConfig(db, body.user.id, username, filtername)
  sendHomeTab(e, body.user.id)
  db.close();

  return;
};
