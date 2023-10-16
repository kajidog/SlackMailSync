import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SmtpConfig } from 'smtp_config';
import { ReplayMailValues } from '../../constants/ModalTemplate/CreateReplayMailModalTemplate';
import { Email } from 'mail_box';

//指定したSMTPサーバを利用して、メール送信
export function sendMailBySMTP(smtpConfig: SmtpConfig, mailInfo: ReplayMailValues, ogMail: Email) {
  console.log(smtpConfig);

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: true,
    auth: {
      type: 'LOGIN',
      user: smtpConfig.user,
      pass: smtpConfig.password,
    },
  });

  let newReferences = (ogMail.references || '') + ' ' + mailInfo.id;

  const mailOptions: Mail.Options = {
    from: smtpConfig.user,
    to: mailInfo.to,
    cc: mailInfo.cc,
    bcc: mailInfo.option.includeBcc ? [...mailInfo.bcc, smtpConfig.user] : mailInfo.bcc,
    subject: mailInfo.subject,
    text: mailInfo.body + (mailInfo.option.skipOriginalQuote ? '' : '\n' + ogMail.body),
    headers: {
      'In-Reply-To': mailInfo.id,
      References: newReferences.trim(),
    },
  };
  console.log('send to', mailInfo.to);

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
}
