const fs = require("fs/promises");
const { createReadStream } = require("fs");
const OpenAI = require("openai");
const {
  getAbsoluteMediaPath,
  getExtractionPrompt,
  parseJsonObject,
  normalizeEntries,
} = require("./aiUtils");

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
            text: `${getExtractionPrompt(moduleName, "transcript")}

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
            text: getExtractionPrompt(capture.module, "receipt or handwritten note"),
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
