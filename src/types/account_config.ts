export type AccountConfig = {
  slack_id: string;
  imap_host: string;
  imap_port: string;
  smtp_host?: string;
  smtp_port?: string;
  secure: boolean;
  user_name: string;
  password: string;
  update_at?: string;
  is_job?: string;
};
