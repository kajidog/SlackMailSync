import { Block, HomeView } from '@slack/bolt';
import { createEmailConfigBlocks } from '../../constants/MessageTemplate/createEmailConfigBlocks';

export const sendHomeTab = async (e: any, user: string, blocks?: HomeView['blocks']) => {
  return e.client.views.publish({
    user_id: user,
    view: {
      type: 'home',
      blocks: blocks ? blocks : [...(await createEmailConfigBlocks(user))],
    },
  });
};
