import { ViewSubmitEvent } from '../types/slack';
import { initDB } from '../utils/sqlite/initiDB';
import { getReplayMailValue } from '../constants/ModalTemplate/CreateReplayMailModalTemplate';
import { sendMailBySMTP } from '../utils/emails/sendMailBySMTP';
import { getMailInfo } from '../utils/sqlite/getMailInfo';
import { getAccount_Config } from '../utils/sqlite/getAccountConfig';

export const submitReplayMail = async (e: ViewSubmitEvent) => {
  const { view, ack, body } = e;
  try {
    const db = await initDB();
    const data = await getReplayMailValue(view.state.values); // フォームの内容取得
    const smtpConfig = await getAccount_Config(db, body.user.id); // ユーザーのSMTPの設定取得
    const ogMail = await getMailInfo(db, data.id); // フォームのメール内容を取得
    db.close();
    smtpConfig[0].smtp_host && sendMailBySMTP(smtpConfig[0], data, ogMail); // メール送信
    ack();
  } catch (error) {
    console.log('fail send mail');
    console.log(error);
  }
};
