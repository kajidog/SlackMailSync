import { BlockButtonActionEvent } from '../types/slack';
import { initDB } from '../utils/sqlite/initiDB';
import { sendHomeTab } from '../utils/slack/sendHomeTab';
import { deleteAccountConfig } from '../utils/sqlite/deleteAccountConfig';

export const deleteMailConfig = async (e: BlockButtonActionEvent) => {
  const { body, } = e;
  e.ack();
  console.log(body.actions[0].value);

  const db = await initDB();
  await deleteAccountConfig(db, body.user.id, body.actions[0].value)
  sendHomeTab(e, body.user.id)
  db.close();

  return;
};
