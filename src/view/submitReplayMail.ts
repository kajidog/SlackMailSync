import { upsertMailServerConfig } from '../utils/sqlite/upsertMailServerConfig';
import { getMailConfigValue } from '../constants/ModalTemplate/MailConfigModalTemplate';
import { ViewSubmitEvent } from '../types/slack';
import { initDB } from '../utils/sqlite/initiDB';
import { sendHomeTab } from '../utils/slack/sendHomeTab';
import { getReplayMailValue } from '../constants/ModalTemplate/CreateReplayMailModalTemplate';
import { getSMTP_Config } from '../utils/sqlite/getSMTP_Config';
import { sendMailBySMTP } from '../utils/emails/sendMailBySMTP';
import { getMailInfo } from '../utils/sqlite/getMailInfo';

export const submitReplayMail = async (e: ViewSubmitEvent) => {
  const { view, ack, body } = e;
  try {
    const db = await initDB();
    const data = await getReplayMailValue(view.state.values); // フォームの内容取得
    const smtpConfig = await getSMTP_Config(db, body.user.id); // ユーザーのSMTPの設定取得
    const ogMail = await getMailInfo(db, data.id); // フォームのメール内容を取得
    db.close();
    smtpConfig && sendMailBySMTP(smtpConfig, data, ogMail); // メール送信
    ack();
  } catch (error) {
    console.log('fail send mail');
    console.log(error);
  }
};
