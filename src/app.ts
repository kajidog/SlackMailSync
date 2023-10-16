import { App, LogLevel } from '@slack/bolt';
import { actionIds, callbackIds } from './constants';
import { mailUpdate } from './actions/mailUpdate';
import { appHomeOpened } from './event/app_home_opened';
import { messageEvent } from './event/message';
import { openModalMailConfig } from './actions/openModalMailConfig';
import { submitAddMailConfig } from './view/submitAddMailConfig';
import { IMAP_Job } from './utils/emails/IMAP_Job';
import { openModalMailReplay } from './actions/openModalMailReplay';
import { submitReplayMail } from './view/submitReplayMail';

export const app = new App({
  logLevel: LogLevel.INFO,
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.action(actionIds.MAIL_UPDATE, mailUpdate); // メール更新イベント
app.action(actionIds.OPEN_MODAL_MAIL_CONFIG, openModalMailConfig); // メール設定画面を開く
app.action(actionIds.MAIL_REPLAY, openModalMailReplay); // メール返信ボタンクリック

app.view(callbackIds.MAIL_CONFIG_MODAL, submitAddMailConfig); // メール設定更新
app.view(callbackIds.MAIL_REPLAY_MODAL, submitReplayMail); // 返信メール送信

app.event('app_home_opened', appHomeOpened); // ホームタブを開いた
app.event('message', messageEvent); // メッセージを受信

(async () => {
  await app.start();
  IMAP_Job(); // 定期的にIMAPを受信する関数を実行
  console.log('⚡️ Bolt app started');
})();
