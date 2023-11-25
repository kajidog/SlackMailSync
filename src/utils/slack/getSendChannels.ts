import { initDB } from '../sqlite/initiDB';
import { getMailFilter } from '../sqlite/getMailFilter';
import { getChannelIDByUserID } from './getChannelIDByUserID';
import { removeDuplicates } from '..';
import { Email } from 'mail_box';



export async function getSendChannels(slackId: string, mail_user_name: string, mailInfo: Email) {
    const imChannel = await getChannelIDByUserID(slackId);
    const db = await initDB();
    const filters = await getMailFilter(db, slackId, mail_user_name);
    let sendChannels: string[] = [];
    let memo: { [channelid: string]: any[] } = {}
    let cancelflg = false;
    for (const filter of filters) {

        let hit = false

        // フィルターがメールにヒットするか
        if (filter.subject && -1 < mailInfo?.subject?.indexOf(filter.subject)) {
            hit = true;
        }
        else if (filter.from && -1 < mailInfo?.from?.indexOf(filter.from)) {
            hit = true;
        }
        else if (filter.cc && -1 < mailInfo?.cc?.indexOf(filter.cc)) {
            hit = true;
        }
        else if (filter.to && -1 < mailInfo?.to?.indexOf(filter.to)) {
            hit = true;
        }

        // ヒットしなければスキップ
        if (hit === false) {
            continue;
        }

        // ヒットした場合の処理
        // ブロックの場合は中断。以降のフィルターを実行しない
        if (filter.action_type === "block") {
            cancelflg = true;
            break;
        }

        // DMに受信する
        if (filter.action_type === "default" || filter.action_type === "forward_1") {
            sendChannels.push(imChannel.id);
        }

        // 指定のチャンネルに転送
        if (filter.action_type === "forward_1" || filter.action_type === "forward_2") {
            const forwardChannels = filter?.forward_channel?.split(",") || [];

            // メモ追加
            filter.memo && forwardChannels.forEach(channle => {
                if (!memo[channle]) {
                    memo[channle] = [];
                }
                memo[channle].push(
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: filter.memo,
                        },
                    });
            });
            sendChannels = [...sendChannels, ...forwardChannels];
        }
    }

    // キャンセルしてなく、転送先がなければDMに転送
    if (!cancelflg && sendChannels.length <= 0) {
        return { channels: [imChannel.id], memo: {} }
    }
    //重複したチャンネルをなくしてから転送するチャンネルIDを返す
    return { channels: removeDuplicates(sendChannels), memo };
}