export const actionIds = {
  MAIL_UPDATE: "mail_update",
  OPEN_MODAL_MAIL_CONFIG: "open_modal_mail_config",
} as const;

export const callbackIds = {
  MAIL_CONFIG_MODAL: "mail_config_modal",
};

export const SYSTEM_SMTP_CONFIG = {
  host: "mail.transfer.icwebdemo.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@kajidog.com",
    pass: "yarn dev",
  },
};

export const SLACK_EMAIL_BOX_CHANNEL =
  "test_kajidog-aaaafxem5pzfmv4zni5b6vq5ny@icraft-jp.slack.com";
