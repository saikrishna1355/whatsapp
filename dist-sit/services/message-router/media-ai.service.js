"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractEntriesFromMedia = extractEntriesFromMedia;
const ai_service_1 = require("../../modules/ai/ai.service");
const whatsapp_client_1 = require("../whatsapp/whatsapp.client");
const logger_1 = require("../../utils/logger");
const parse_entries_1 = require("../../utils/parse-entries");
function guessDescription(text) {
    const cleaned = text.replace(/[^a-zA-Z\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleaned)
        return undefined;
    const words = cleaned.split(' ').filter(Boolean).slice(0, 3);
    return words.length ? words.join(' ') : undefined;
}
async function extractEntriesFromMedia(media, module) {
    logger_1.logger.info({ mediaType: media.type, mediaId: media.mediaId, module }, 'Starting media extraction');
    const provider = (0, ai_service_1.getAIProvider)();
    const meta = await whatsapp_client_1.whatsappClient.getMediaUrl(media.mediaId);
    const mimeType = media.mimeType || meta.mime_type || '';
    const buffer = await whatsapp_client_1.whatsappClient.downloadMedia(meta.url);
    logger_1.logger.debug({ mediaType: media.type, mimeType, size: buffer.length, module }, 'Media downloaded');
    if (media.type === 'image') {
        const entries = await provider.analyzeImage(buffer, mimeType, module);
        logger_1.logger.info({ module, count: entries.length }, 'Image analyzed and entries extracted');
        return { entries };
    }
    if (media.type === 'audio') {
        logger_1.logger.info({ mimeType, module }, 'Starting audio transcription');
        const transcript = await provider.transcribeAudio(buffer, mimeType);
        logger_1.logger.debug({ transcriptLength: transcript.length, transcriptPreview: transcript.slice(0, 120), module }, 'Audio transcription completed');
        if (!transcript?.trim())
            return { entries: [] };
        let entries = await provider.extractEntries(transcript, module);
        if (entries.length === 0) {
            entries = (0, parse_entries_1.parseEntries)(transcript);
            logger_1.logger.info({ module, count: entries.length }, 'Fallback parseEntries from transcript');
        }
        logger_1.logger.info({ module, count: entries.length }, 'Audio transcript converted to entries');
        return { entries, hintDescription: entries.length === 0 ? guessDescription(transcript) : undefined };
    }
    logger_1.logger.warn({ mediaType: media.type, module }, 'Unsupported media type for extraction');
    return { entries: [] };
}
//# sourceMappingURL=media-ai.service.js.map