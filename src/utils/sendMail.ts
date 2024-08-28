import * as nodemailer from 'nodemailer'

async function sendMail(email: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: true,
  })

  return await transporter.sendMail({
    from: `India Gyaan ${process.env.SMTP_USER}`,
    to: email,
    subject: subject,
    html: html,
  })
}

export default sendMail
