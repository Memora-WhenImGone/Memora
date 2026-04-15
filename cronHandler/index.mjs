const TARGET_URL = process.env.CRON_ENDPOINT;
const CRON_SECRET = process.env.CRON_SECRET;

export async function handler() {
  if (!TARGET_URL || !CRON_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ message }) };
  }

  try {
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "x-cron-secret": CRON_SECRET,
      },
    });

    const bodyText = await response.text();
    return { statusCode: 200, body: bodyText };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "Invocation failed" }),
    };
  }
}
