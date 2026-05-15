const fs = require("fs/promises");
const path = require("path");
const { getMediaUrl, downloadMedia } = require("./whatsapp");

const MEDIA_DIR = path.join(__dirname, "../../data/media");

function getMediaPayload(message) {
  if (message.image?.id) {
    return {
      type: "image",
      media: message.image,
      text: message.image.caption?.trim() || "",
    };
  }

  if (message.audio?.id) {
    return {
      type: message.audio.voice ? "voice" : "audio",
      media: message.audio,
      text: "",
    };
  }

  return null;
}

function extensionFromMimeType(mimeType, mediaType) {
  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
  };

  return map[mimeType] || (mediaType === "image" ? "jpg" : "bin");
}

async function saveInboundMedia(message, from, answerKey) {
  const payload = getMediaPayload(message);
  if (!payload) return null;

  const mediaInfo = await getMediaUrl(payload.media.id);
  const buffer = await downloadMedia(mediaInfo.url);
  const extension = extensionFromMimeType(payload.media.mime_type || mediaInfo.mime_type, payload.type);
  const fileName = `${Date.now()}-${from}-${payload.media.id}.${extension}`;
  const relativePath = path.join("media", fileName);
  const absolutePath = path.join(MEDIA_DIR, fileName);

  await fs.mkdir(MEDIA_DIR, { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  return {
    media_type: payload.type,
    media_id: payload.media.id,
    mime_type: payload.media.mime_type || mediaInfo.mime_type || null,
    sha256: payload.media.sha256 || mediaInfo.sha256 || null,
    file_path: relativePath,
    caption: payload.text,
    answer_key: answerKey,
  };
}

module.exports = { getMediaPayload, saveInboundMedia };
