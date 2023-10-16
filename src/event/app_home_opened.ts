import { SlackHomeOpenedEvent } from 'slack';
import { sendHomeTab } from '../utils/slack/sendHomeTab';

export const appHomeOpened = async (e: SlackHomeOpenedEvent) => {
  const { event } = e;
  await sendHomeTab(e, event.user); //　ブロック送信
};
