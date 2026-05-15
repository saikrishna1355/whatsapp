const fs = require("fs/promises");
const path = require("path");
const { createReadStream } = require("fs");
const OpenAI = require("openai");

const DATA_DIR = path.join(__dirname, "../../data");

let client;

function requireApiKey() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
}

function getClient() {
  requireApiKey();

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
}

function getAbsoluteMediaPath(capture) {
  return path.join(DATA_DIR, capture.file_path);
}

function parseJsonObject(raw) {
  const text = String(raw || "").trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

function normalizeEntries(entries) {
  if (!Array.isArray(entries)) return [];

  return entries
    .map((entry) => ({
      description: String(entry.description || "").trim(),
      amount: Number(entry.amount),
    }))
    .filter((entry) => entry.description && Number.isFinite(entry.amount) && entry.amount > 0);
}

async function parseEntriesFromText(text, moduleName) {
  const openai = getClient();

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Extract farm ${moduleName === "saveExpense" ? "expense" : "income"} entries from this text.
Return only valid JSON with this shape:
{"entries":[{"description":"Egg sales","amount":200}]}

Text:
${text}`,
          },
        ],
      },
    ],
  });

  const parsed = parseJsonObject(response.output_text);
  return normalizeEntries(parsed.entries);
}

async function analyzeReceiptImage(capture) {
  const openai = getClient();

  const filePath = getAbsoluteMediaPath(capture);
  const imageBuffer = await fs.readFile(filePath);
  const mimeType = capture.mime_type || "image/jpeg";
  const imageUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Read this farm receipt or handwritten note.
Extract ${capture.module === "saveExpense" ? "expense" : "income"} entries.
Return only valid JSON with this shape:
{"entries":[{"description":"Egg sales","amount":200}]}`,
          },
          {
            type: "input_image",
            image_url: imageUrl,
          },
        ],
      },
    ],
  });

  const parsed = parseJsonObject(response.output_text);
  return {
    source_text: response.output_text,
    entries: normalizeEntries(parsed.entries),
  };
}

async function analyzeVoice(capture) {
  const openai = getClient();

  const filePath = getAbsoluteMediaPath(capture);
  const transcription = await openai.audio.transcriptions.create({
    file: createReadStream(filePath),
    model: process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1",
  });
  const transcript = transcription.text || "";
  const entries = await parseEntriesFromText(transcript, capture.module);

  return {
    source_text: transcript,
    entries,
  };
}

async function analyzeCapturedMedia(capture) {
  if (capture.media_type === "image") {
    return analyzeReceiptImage(capture);
  }

  if (capture.media_type === "voice" || capture.media_type === "audio") {
    return analyzeVoice(capture);
  }

  throw new Error(`Unsupported media type: ${capture.media_type}`);
}

module.exports = { analyzeCapturedMedia };
