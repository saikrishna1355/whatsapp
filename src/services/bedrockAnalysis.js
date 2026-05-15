const fs = require("fs/promises");
const path = require("path");
const axios = require("axios");
const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");
const {
  getAbsoluteMediaPath,
  getExtractionPrompt,
  parseJsonObject,
  normalizeEntries,
} = require("./aiUtils");

let bedrockClient;
let s3Client;
let transcribeClient;

function getRegion() {
  return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
}

function getBedrockClient() {
  if (!bedrockClient) {
    bedrockClient = new BedrockRuntimeClient({ region: getRegion() });
  }

  return bedrockClient;
}

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({ region: getRegion() });
  }

  return s3Client;
}

function getTranscribeClient() {
  if (!transcribeClient) {
    transcribeClient = new TranscribeClient({ region: getRegion() });
  }

  return transcribeClient;
}

function getBedrockModel() {
  return process.env.AWS_BEDROCK_MODEL || "anthropic.claude-3-haiku-20240307-v1:0";
}

function getImageFormat(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpeg";
}

function getS3Bucket() {
  if (!process.env.AWS_TRANSCRIBE_BUCKET) {
    throw new Error("AWS_TRANSCRIBE_BUCKET is required for voice analysis");
  }

  return process.env.AWS_TRANSCRIBE_BUCKET;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBedrockText(response) {
  return (response.output?.message?.content || [])
    .map((item) => item.text || "")
    .join("\n")
    .trim();
}

async function extractEntriesWithBedrock(text, moduleName) {
  const response = await getBedrockClient().send(
    new ConverseCommand({
      modelId: getBedrockModel(),
      messages: [
        {
          role: "user",
          content: [
            {
              text: `${getExtractionPrompt(moduleName, "text")}

Text:
${text}`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: Number(process.env.AWS_BEDROCK_MAX_TOKENS || 800),
        temperature: 0,
      },
    }),
  );

  const outputText = getBedrockText(response);
  const parsed = parseJsonObject(outputText);
  return {
    source_text: text,
    model_output: outputText,
    entries: normalizeEntries(parsed.entries),
  };
}

async function analyzeReceiptImage(capture) {
  const filePath = getAbsoluteMediaPath(capture);
  const imageBytes = await fs.readFile(filePath);

  const response = await getBedrockClient().send(
    new ConverseCommand({
      modelId: getBedrockModel(),
      messages: [
        {
          role: "user",
          content: [
            {
              text: getExtractionPrompt(capture.module, "receipt or handwritten note"),
            },
            {
              image: {
                format: getImageFormat(capture.mime_type),
                source: {
                  bytes: imageBytes,
                },
              },
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: Number(process.env.AWS_BEDROCK_MAX_TOKENS || 800),
        temperature: 0,
      },
    }),
  );

  const outputText = getBedrockText(response);
  const parsed = parseJsonObject(outputText);
  return {
    source_text: outputText,
    entries: normalizeEntries(parsed.entries),
  };
}

async function uploadAudioForTranscribe(capture) {
  const filePath = getAbsoluteMediaPath(capture);
  const body = await fs.readFile(filePath);
  const bucket = getS3Bucket();
  const key = [
    process.env.AWS_TRANSCRIBE_PREFIX || "whatsapp-transcribe",
    path.basename(filePath),
  ].join("/");

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: capture.mime_type || "application/octet-stream",
    }),
  );

  return {
    bucket,
    key,
    uri: `s3://${bucket}/${key}`,
  };
}

async function waitForTranscription(jobName) {
  const timeoutMs = Number(process.env.AWS_TRANSCRIBE_TIMEOUT_MS || 120000);
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const result = await getTranscribeClient().send(
      new GetTranscriptionJobCommand({ TranscriptionJobName: jobName }),
    );
    const job = result.TranscriptionJob;

    if (job.TranscriptionJobStatus === "COMPLETED") {
      return job.Transcript.TranscriptFileUri;
    }

    if (job.TranscriptionJobStatus === "FAILED") {
      throw new Error(job.FailureReason || "AWS Transcribe job failed");
    }

    await wait(Number(process.env.AWS_TRANSCRIBE_POLL_MS || 3000));
  }

  throw new Error("AWS Transcribe timed out");
}

async function transcribeAudio(capture) {
  const uploaded = await uploadAudioForTranscribe(capture);
  const jobName = `whatsapp-${capture.id}-${Date.now()}`.replace(/[^0-9A-Za-z._-]/g, "-");

  try {
    await getTranscribeClient().send(
      new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: process.env.AWS_TRANSCRIBE_LANGUAGE_CODE || "en-US",
        MediaFormat: path.extname(uploaded.key).replace(".", "") || undefined,
        Media: {
          MediaFileUri: uploaded.uri,
        },
      }),
    );

    const transcriptUrl = await waitForTranscription(jobName);
    const transcriptResponse = await axios.get(transcriptUrl);
    return transcriptResponse.data?.results?.transcripts?.[0]?.transcript || "";
  } finally {
    if (process.env.AWS_TRANSCRIBE_KEEP_AUDIO !== "true") {
      await getS3Client().send(
        new DeleteObjectCommand({
          Bucket: uploaded.bucket,
          Key: uploaded.key,
        }),
      );
    }
  }
}

async function analyzeVoice(capture) {
  const transcript = await transcribeAudio(capture);
  return extractEntriesWithBedrock(transcript, capture.module);
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
