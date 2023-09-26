import { fetchNewMail } from "../mail/fetchNewMail";
import { BlockButtonActionEvent } from "../types/slack";
import { MailConfigModalTemplate } from "../constants/MailConfigModalTemplate";
import { callbackIds } from "../constants";
export const openModalMailConfig = async (e: BlockButtonActionEvent) => {
  const { body } = e;
  e.ack();
  console.log("ok", body.user.id);
  e.client.views.open({
    trigger_id: e.body["trigger_id"],
    view: {
      ...MailConfigModalTemplate,
      callback_id: callbackIds.MAIL_CONFIG_MODAL,
    },
  });
  return;
};
