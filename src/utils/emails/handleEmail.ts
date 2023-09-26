import { MailInfo } from "./fetchNewEmails";

export const handleEmail =
  (callback: (email: MailInfo) => Promise<boolean>) =>
  async (email: MailInfo) => {
    return callback(email);
  };
