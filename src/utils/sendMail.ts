import * as nodemailer from 'nodemailer';

async function sendMail(email: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: true,
  });

  return await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: subject,
    html: html,
  });
}

export default sendMail;
