import { BlockButtonActionEvent } from '../types/slack';
import { MailConfigModalTemplate } from '../constants/ModalTemplate/MailConfigModalTemplate';
import { callbackIds } from '../constants';
import { initDB } from '../utils/sqlite/initiDB';
import { getAccountConfigByName } from '../utils/sqlite/getAccountConfigByName';
export const openModalMailConfig = async (e: BlockButtonActionEvent) => {
  const { body, } = e;
  e.ack();
  console.log(body.actions[0].value);
  
  const db = await initDB();
  const config = await getAccountConfigByName(db, body.user.id, body.actions[0].value ?? "");

  e.client.views.open({
    trigger_id: e.body['trigger_id'],
    view: {
      ...MailConfigModalTemplate(config),
      callback_id: callbackIds.MAIL_CONFIG_MODAL,
    },
  });

  db.close();

  return;
};
