"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractEntriesFromMedia = extractEntriesFromMedia;
const ai_service_1 = require("../../modules/ai/ai.service");
const whatsapp_client_1 = require("../whatsapp/whatsapp.client");
async function extractEntriesFromMedia(media, module) {
    const provider = (0, ai_service_1.getAIProvider)();
    const meta = await whatsapp_client_1.whatsappClient.getMediaUrl(media.mediaId);
    const mimeType = media.mimeType || meta.mime_type || '';
    const buffer = await whatsapp_client_1.whatsappClient.downloadMedia(meta.url);
    if (media.type === 'image') {
        return provider.analyzeImage(buffer, mimeType, module);
    }
    if (media.type === 'audio') {
        const transcript = await provider.transcribeAudio(buffer, mimeType);
        if (!transcript?.trim())
            return [];
        return provider.extractEntries(transcript, module);
    }
    return [];
}
//# sourceMappingURL=media-ai.service.js.map