import { MailInfo } from './fetchNewEmails';

// メール取得時にMailInfoを実行
export const handleEmail = (callback: (email: MailInfo) => Promise<boolean>) => async (email: MailInfo) => {
  return callback(email);
};
