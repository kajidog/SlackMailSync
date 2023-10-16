import { BlockButtonActionEvent } from '../types/slack';
import { MailConfigModalTemplate } from '../constants/ModalTemplate/MailConfigModalTemplate';
import { callbackIds } from '../constants';
import { initDB } from '../utils/sqlite/initiDB';
import { getSMTP_Config } from '../utils/sqlite/getSMTP_Config';
import { getIMAP_Config } from '../utils/sqlite/getIMAP_Config';
export const openModalMailConfig = async (e: BlockButtonActionEvent) => {
  const { body } = e;
  e.ack();
  const db = await initDB();
  const smtpConfig = await getSMTP_Config(db, body.user.id);
  const imapConfig = await getIMAP_Config(db, body.user.id);

  e.client.views.open({
    trigger_id: e.body['trigger_id'],
    view: {
      ...MailConfigModalTemplate(imapConfig, smtpConfig),
      callback_id: callbackIds.MAIL_CONFIG_MODAL,
    },
  });
  return;
};
