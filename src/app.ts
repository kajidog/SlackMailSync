import {
  App,
  BlockButtonAction,
  LogLevel,
  ViewSubmitAction,
} from "@slack/bolt";
import { actionIds, callbackIds } from "./constants";
import { mailUpdate } from "./actions/mailUpdate";
import { appHomeOpened } from "./event/app_home_opened";
import { messageEvent } from "./event/message";
import { openModalMailConfig } from "./actions/openModalMailConfig";
import { submitAddMailConfig } from "./view/submitAddMailConfig";
import { IMAP_Job } from "./utils/emails/IMAP_Job";

export const app = new App({
  logLevel: LogLevel.INFO,
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

// メール更新イベント
app.action<BlockButtonAction>(actionIds.MAIL_UPDATE, mailUpdate);
// メール設定追加
app.action<BlockButtonAction>(
  actionIds.OPEN_MODAL_MAIL_CONFIG,
  openModalMailConfig
);

// メール設定追加
app.view<ViewSubmitAction>(callbackIds.MAIL_CONFIG_MODAL, submitAddMailConfig);

// ホームタブを開いた
app.event("app_home_opened", appHomeOpened);

// メッセージを受信
app.event("message", messageEvent);

(async () => {
  await app.start();
  IMAP_Job();
  console.log("⚡️ Bolt app started");
})();
