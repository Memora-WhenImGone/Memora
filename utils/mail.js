import { MailtrapClient } from "mailtrap";

export async function sendEmail(to, subject, text) {
  const client = new MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN,
  });

  const response = await client.send({
    from: {
      email: process.env.MAIL_FROM_EMAIL,
      name: process.env.MAIL_FROM_NAME,
    },
    to: [{ email: to }],
    subject,
    text,
  });

  return response;
}
