import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ReplayMailValues } from '../../constants/ModalTemplate/CreateReplayMailModalTemplate';
import { Email } from 'mail_box';
import { AccountConfig } from 'account_config';

//指定したSMTPサーバを利用して、メール送信
export function sendMailBySMTP(accountConfig: AccountConfig, mailInfo: ReplayMailValues, ogMail: Email) {
  console.log(accountConfig);
  if(!accountConfig.smtp_host || !accountConfig.smtp_port){
    return 
  }

  const transporter = nodemailer.createTransport({
    host: accountConfig.smtp_host,
    port: parseInt(accountConfig.smtp_port),
    secure: true,
    auth: {
      type: 'LOGIN',
      user: accountConfig.user_name,
      pass: accountConfig.password,
    },
  });

  let newReferences = (ogMail.references || '') + ' ' + mailInfo.id;

  const mailOptions: Mail.Options = {
    from: accountConfig.user_name,
    to: mailInfo.to,
    cc: mailInfo.cc,
    bcc: mailInfo.option.includeBcc ? [...mailInfo.bcc, accountConfig.user_name] : mailInfo.bcc,
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
