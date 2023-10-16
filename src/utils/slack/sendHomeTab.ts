import { Block, HomeView } from '@slack/bolt';
import { createImapConfigBlocks } from '../../constants/MessageTemplate/createImapConfigBlocks';

export const sendHomeTab = async (e: any, user: string, blocks?: HomeView['blocks']) => {
  return e.client.views.publish({
    user_id: user,
    view: {
      type: 'home',
      blocks: blocks ? blocks : [...(await createImapConfigBlocks(user))],
    },
  });
};
