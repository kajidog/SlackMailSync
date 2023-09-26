export type ImapConfig = {
  slack_id: string;
  host: string;
  port: string;
  secure: boolean;
  user: string;
  password: string;
  update_at?: string;
};
