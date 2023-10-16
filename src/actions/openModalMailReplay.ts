import { fetchNewMail } from '../mail/fetchNewMail';
import { BlockButtonActionEvent } from '../types/slack';
import { CreateReplayMailModalTemplate } from '../constants/ModalTemplate/CreateReplayMailModalTemplate';
import { callbackIds } from '../constants';
import { getMailInfo } from '../utils/sqlite/getMailInfo';
import { initDB } from '../utils/sqlite/initiDB';
import { getSMTP_Config } from '../utils/sqlite/getSMTP_Config';
export const openModalMailReplay = async (e: BlockButtonActionEvent) => {
  const { body } = e;
  e.ack();
  console.log('ok', body.user.id);
  const db = await initDB();
  const mailId = e.payload.value;
  const mailInfo = await getMailInfo(db, mailId);
  const smtpConfig = await getSMTP_Config(db, body.user.id);
  db.close();

  if (!mailId || !mailInfo || !smtpConfig) {
    return;
  }
  e.client.views.open({
    trigger_id: e.body['trigger_id'],
    view: {
      ...CreateReplayMailModalTemplate(mailInfo.id, mailInfo.subject, smtpConfig.user, mailInfo.from, mailInfo.cc, mailInfo.body),
      callback_id: callbackIds.MAIL_REPLAY_MODAL,
    },
  });
  return;
};
