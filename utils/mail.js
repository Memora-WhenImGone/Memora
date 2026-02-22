import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
export async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.MAILTRAP_API_TOKEN,
    })
  );

  const info = await transporter.sendMail({
    from: "memora@cloudbybilal.com",
    to,
    subject,
    text,
  });

  return info;
}