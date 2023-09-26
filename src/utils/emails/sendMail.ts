import { ParsedMail } from "mailparser";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { SLACK_EMAIL_BOX_CHANNEL, SYSTEM_SMTP_CONFIG } from "../../constants";

export function sendEmail(parsedEmail: ParsedMail) {
  const transporter = nodemailer.createTransport({ ...SYSTEM_SMTP_CONFIG });
  const messageId = parsedEmail.messageId || "";

  const senderAddress = `"${messageId}" <${SYSTEM_SMTP_CONFIG.auth.user}>`;

  const mailOptions: Mail.Options = {
    from: senderAddress,
    to: SLACK_EMAIL_BOX_CHANNEL,
    subject: parsedEmail.subject,
    text: parsedEmail.text,
    html: parsedEmail.html || null,
    attachments: parsedEmail.attachments as any,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info);
      }
    });
  });
}
