import { MailtrapClient } from "mailtrap";

export async function sendEmail(to, subject, text) {
  const client = new MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN,
  });

  const response = await client.send({
    from: {
      email: "memora@cloudbybilal.com",
      name: "Memora",
    },
    to: [{ email: to }],
    subject,
    text,
  });

  return response;
}