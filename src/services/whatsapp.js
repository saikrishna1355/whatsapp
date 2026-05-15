const axios = require("axios");
const FormData = require("form-data");

const testMode = String(process.env.WHATSAPP_TEST_MODE || "").toLowerCase() === "true";

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_URL = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
const MEDIA_URL = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/media`;
const headers = {
  Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
  "Content-Type": "application/json",
};

async function sendMessage(to, message) {
  if (testMode) {
    console.log(`\n[WHATSAPP_TEST_MODE] to: ${to}\n${message}\n`);
    return;
  }

  await axios.post(API_URL, {
    messaging_product: "whatsapp",
    to,
    text: { body: message },
  }, { headers });
}

async function sendButtons(to, body, buttons) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: buttons.map((btn) => ({
          type: "reply",
          reply: { id: btn.id, title: btn.title.slice(0, 20) },
        })),
      },
    },
  };

  if (testMode) {
    console.log(`\n[WHATSAPP_TEST_MODE] to: ${to}\n${body}\nButtons: ${buttons.map((b) => b.title).join(", ")}\n`);
    return;
  }

  await axios.post(API_URL, payload, { headers });
}

async function sendList(to, body, buttonText, sections) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: body },
      action: {
        button: buttonText.slice(0, 20),
        sections,
      },
    },
  };

  if (testMode) {
    const items = sections.flatMap((s) => s.rows.map((r) => r.title));
    console.log(`\n[WHATSAPP_TEST_MODE] to: ${to}\n${body}\nList: ${items.join(", ")}\n`);
    return;
  }

  await axios.post(API_URL, payload, { headers });
}

async function sendDocument(to, pdfBuffer, filename) {
  if (testMode) {
    console.log(`\n[WHATSAPP_TEST_MODE] to: ${to}\nDocument: ${filename} (${pdfBuffer.length} bytes)\n`);
    return;
  }

  // Upload media
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("file", pdfBuffer, { filename, contentType: "application/pdf" });
  form.append("type", "application/pdf");

  const uploadRes = await axios.post(MEDIA_URL, form, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, ...form.getHeaders() },
  });

  const mediaId = uploadRes.data.id;

  // Send document message
  await axios.post(API_URL, {
    messaging_product: "whatsapp",
    to,
    type: "document",
    document: { id: mediaId, filename },
  }, { headers });
}

module.exports = { sendMessage, sendButtons, sendList, sendDocument };
