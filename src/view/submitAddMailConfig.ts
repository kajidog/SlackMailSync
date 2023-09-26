import { upsertMailServerConfig } from "../utils/sqlite/upsertMailServerConfig";
import { getMailConfigValue } from "../constants/MailConfigModalTemplate";
import { ViewSubmitEvent } from "../types/slack";
import { initDB } from "../utils/sqlite/initiDB";
import { sendHomeTab } from "../slack";

export const submitAddMailConfig = async (e: ViewSubmitEvent) => {
  const { view, ack, body } = e;
  //ack();
  const db = await initDB();
  const data = getMailConfigValue(view.state.values);
  await upsertMailServerConfig(db, body.user.id, data);
  console.log(data);

  ack();
  sendHomeTab(e, body.user.id);
};
