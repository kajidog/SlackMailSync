import { BlockButtonActionEvent } from '../types/slack';
import { CreateReplayMailModalTemplate } from '../constants/ModalTemplate/CreateReplayMailModalTemplate';
import { callbackIds } from '../constants';
import { getMailInfo } from '../utils/sqlite/getMailInfo';
import { initDB } from '../utils/sqlite/initiDB';
import { getAccount_Config } from '../utils/sqlite/getAccountConfig';

// メールの返信のモーダルを開く
export const openModalMailReplay = async (e: BlockButtonActionEvent) => {
  const { body } = e;
  e.ack();
  console.log('ok', body.user.id);

  // データ取得
  const db = await initDB();
  const mailId = e.payload.value;
  const mailInfo = await getMailInfo(db, mailId);
  const config = await getAccount_Config(db, body.user.id);
  db.close();

  if (!mailId || !mailInfo || !config) {
    return;
  }

  // 返信のモーダルを開く
  e.client.views.open({
    trigger_id: e.body['trigger_id'],
    view: {
      ...CreateReplayMailModalTemplate(mailInfo.id, mailInfo.subject, config[0].user_name, mailInfo.from, mailInfo.cc, mailInfo.body),
      callback_id: callbackIds.MAIL_REPLAY_MODAL,
    },
  });

  return;
};
