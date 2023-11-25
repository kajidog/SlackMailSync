import { BlockButtonActionEvent } from '../types/slack';
import { MailFilterModalTemplate } from '../constants/ModalTemplate/MailFilterModalTemplate';
import { callbackIds } from '../constants';
import { initDB } from '../utils/sqlite/initiDB';
import { getAccountConfigByName } from '../utils/sqlite/getAccountConfigByName';
import { getMailFilterByFiltername } from '../utils/sqlite/getMailFilterByFiltername';


export const openModalMailFilter = async (e: BlockButtonActionEvent) => {
  const { body, } = e;
  e.ack();
  const [username, filtername] = body.actions[0]?.value?.split("--------") ?? [];
  console.log(username, filtername);

  // メールサーバの設定を取得
  const db = await initDB();
  const config = await getAccountConfigByName(db, body.user.id, username ?? "");

  // フィルターの設定を取得
  const filter = await getMailFilterByFiltername(db, body.user.id, username, filtername ?? "!!undefined!!");


  // メールサーバの設定を取得した時だけ、フィルターのテンプレートを開く
  config && e.client.views.open({
    trigger_id: e.body['trigger_id'],
    view: {
      ...MailFilterModalTemplate(config, filter),
      callback_id: callbackIds.MAIL_FILTER_MODAL,
    },
  });
  return;
};
