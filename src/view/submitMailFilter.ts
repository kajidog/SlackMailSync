import { ViewSubmitEvent } from '../types/slack';
import { initDB } from '../utils/sqlite/initiDB';
import { getReplayMailValue } from '../constants/ModalTemplate/CreateReplayMailModalTemplate';
import { sendMailBySMTP } from '../utils/emails/sendMailBySMTP';
import { getMailInfo } from '../utils/sqlite/getMailInfo';
import { getAccount_Config } from '../utils/sqlite/getAccountConfig';
import { getFilterValue } from '../constants/ModalTemplate/MailFilterModalTemplate';
import { upsertFilter } from '../utils/sqlite/upsertFilter';
import { sendHomeTab } from '../utils/slack/sendHomeTab';

export const submitMailFilter = async (e: ViewSubmitEvent) => {
  const { view, ack, body } = e as any;
  const db = await initDB();
  try {
    const data = await getFilterValue(view.state.values); // フォームの内容取得
    upsertFilter(db, body.user.id, view.blocks[1].text.text, data);
    ack()
  } catch (error) {
    console.log('fail send mail');
    console.log(error);
  }
  db.close();
  sendHomeTab(e, body.user.id);

};
