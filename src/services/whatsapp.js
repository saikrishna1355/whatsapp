const axios = require("axios");

async function sendMessage(to, message) {
  const testMode = String(process.env.WHATSAPP_TEST_MODE || "").toLowerCase() === "true";

  if (testMode) {
    console.log(`\n[WHATSAPP_TEST_MODE] to: ${to}\n${message}\n`);
    return;
  }

  await axios.post(
    `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: {
        body: message,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

module.exports = { sendMessage };
