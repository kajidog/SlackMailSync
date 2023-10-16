export const actionIds = {
  MAIL_UPDATE: 'mail_update',
  OPEN_MODAL_MAIL_CONFIG: 'open_modal_mail_config',
  MAIL_REPLAY: 'replay_mail',
  MAIL_FORWARD: 'forward_mail',
} as const;

export const callbackIds = {
  MAIL_CONFIG_MODAL: 'mail_config_modal',
  MAIL_REPLAY_MODAL: 'mail_replay_modal',
} as const;

export const SYSTEM_SMTP_CONFIG = {
  host: process.env.SYSTEM_SMTP_HOST,
  port: parseInt(process.env.SYSTEM_SMTP_PORT),
  secure: !!process.env.SYSTEM_SMTP_SECURE,
  auth: {
    user: process.env.SYSTEM_SMTP_USER,
    pass: process.env.SYSTEM_SMTP_PASS,
  },
};
export const SLACK_EMAIL_BOX_CHANNEL = process.env.SLACK_MAIL_BOX_CHANNEL_EMAIL;
export const MAIL_ADDRESS_DELIMITER = [',', '\n'];
