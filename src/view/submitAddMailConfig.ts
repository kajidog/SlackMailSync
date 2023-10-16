import { upsertMailServerConfig } from '../utils/sqlite/upsertMailServerConfig';
import { getMailConfigValue } from '../constants/ModalTemplate/MailConfigModalTemplate';
import { ViewSubmitEvent } from '../types/slack';
import { initDB } from '../utils/sqlite/initiDB';
import { sendHomeTab } from '../utils/slack/sendHomeTab';

// 設定登録
export const submitAddMailConfig = async (e: ViewSubmitEvent) => {
  const { view, ack, body } = e;
  const db = await initDB();
  const data = getMailConfigValue(view.state.values); // フォームの内容取得
  await upsertMailServerConfig(db, body.user.id, data); // DBに内容を保存
  db.close();
  ack();
  sendHomeTab(e, body.user.id);
};
