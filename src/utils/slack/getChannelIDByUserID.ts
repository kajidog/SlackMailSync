import { app } from '../../app';

export async function getChannelIDByUserID(userId: string) {
  return await app.client.conversations
    .open({
      users: userId,
    })
    .then(({ channel }) => channel);
}
