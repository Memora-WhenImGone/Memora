import nodemailer from "nodemailer";

export async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: Number(process.env.MAIL_TRAP_PORT),
    auth: {
      user: process.env.MAIL_TRAP_USERNAME,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Memora" <no-reply@memora.com>',
    to,
    subject,
    text,
  });

  return info;
}