import { View } from '@slack/bolt';
import { ViewSubmitViews } from '../../types/slack';
import { AccountConfig } from 'account_config';

export const MailConfigModalTemplate = (accountConfig?: AccountConfig): View => {
  return {
    type: 'modal',
    submit: {
      type: 'plain_text',
      text: '登録',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'キャンセル',
      emoji: true,
    },
    title: {
      type: 'plain_text',
      text: 'メールサーバ登録',
      emoji: true,
    },
    blocks: [
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'アカウント名',
          emoji: true,
        },
        element: {
          type: 'plain_text_input',
          placeholder: {
            type: 'plain_text',
            text: 'username@icraft.jp',
            emoji: true,
          },
          initial_value: accountConfig?.user_name,
          action_id: 'username',
          focus_on_load: true,
        },
        block_id: 'username',
      },
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'パスワード',
          emoji: true,
        },
        element: {
          type: 'plain_text_input',
          action_id: 'password',
          //initial_value: accountConfig?.password,
        },
        block_id: 'password',
      },
      {
        type: 'input',
        optional: true,
        element: {
          type: 'checkboxes',

          options: [
            {
              text: {
                type: 'plain_text',
                text: '新着メールを定期的に受信',
                emoji: true,
              },

              value: 'add_job',
            },
          ],
          ...(accountConfig?.is_job
            ? {
                initial_options: [
                  {
                    value: 'add_job',
                    text: {
                      type: 'plain_text',
                      text: '新着メールを定期的に受信',
                      emoji: true,
                    },
                  },
                ],
              }
            : {}),
          action_id: 'add_job',
        },

        label: {
          type: 'plain_text',
          text: 'オプション',
          emoji: true,
        },
        block_id: 'add_job',
      },
      {
        type: 'divider',
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'IMAPサーバ（メール受信）',
          emoji: true,
        },
      },
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'host',
          emoji: true,
        },
        element: {
          type: 'plain_text_input',
          action_id: 'imap_host',
          initial_value: accountConfig?.imap_host,
        },
        block_id: 'imap_host',
      },
      {
        type: 'input',
        element: {
          type: 'number_input',
          is_decimal_allowed: false,
          action_id: 'imap_port',
          initial_value: accountConfig?.imap_port,
        },
        label: {
          type: 'plain_text',
          text: 'port',
          emoji: true,
        },
        block_id: 'imap_port',
      },
      {
        type: 'divider',
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'SMTPサーバ(メール送信)',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'メールを送信したい場合のみ',
          emoji: true,
        },
      },
      {
        optional: true,
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'host',
          emoji: true,
        },
        element: {
          type: 'plain_text_input',
          action_id: 'smtp_host',
          initial_value: accountConfig?.smtp_host,
        },
        block_id: 'smtp_host',
      },
      {
        optional: true,
        type: 'input',
        element: {
          type: 'number_input',
          is_decimal_allowed: false,
          action_id: 'smtp_port',
          initial_value: accountConfig?.smtp_port ? String(accountConfig?.smtp_port) : undefined,
        },
        label: {
          type: 'plain_text',
          text: 'port',
          emoji: true,
        },
        block_id: 'smtp_port',
      },
    ],
  };
};

export type MailConfigValues = {
  info: {
    username: string;
    password: string;
    option: {
      add_job: boolean;
    };
  };
  imap: {
    host: string;
    port: string;
  };
  smtp: {
    host?: string;
    port?: string;
  };
};

export const getMailConfigValue = (values: ViewSubmitViews): MailConfigValues => {
  const { username, password, imap_host, imap_port, add_job, smtp_port, smtp_host } = values;

  return {
    info: {
      username: username.username.value,
      password: password.password.value,
      option: {
        add_job: !!add_job.add_job.selected_options?.length,
      },
    },
    imap: {
      host: imap_host.imap_host.value,
      port: imap_port.imap_port.value,
    },
    smtp: {
      host: smtp_host?.smtp_host?.value,
      port: smtp_port?.smtp_port?.value,
    },
  };
};
