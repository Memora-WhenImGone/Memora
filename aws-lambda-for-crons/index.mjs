const TARGET_URL = process.env.CRON_ENDPOINT;
const CRON_SECRET = process.env.CRON_SECRET;

export async function handler() {
  if (!TARGET_URL || !CRON_SECRET) {
    const message = "CRON_ENDPOINT and CRON_SECRET must be configured.";
    console.error(message);
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
    if (!response.ok) {
      console.error("Release endpoint returned error:", response.status, bodyText);
      return { statusCode: response.status, body: bodyText };
    }

    console.log("Release endpoint response:", bodyText);
    return { statusCode: 200, body: bodyText };
  } catch (error) {
    console.error("Failed to invoke release endpoint:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "Invocation failed" }),
    };
  }
}
