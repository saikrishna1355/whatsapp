"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractInboundMessage = extractInboundMessage;
function extractInboundMessage(body) {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    if (!message)
        return null;
    const from = message.from;
    const text = message.interactive?.button_reply?.id ||
        message.interactive?.list_reply?.id ||
        message.text?.body?.trim() ||
        null;
    let mediaPayload = null;
    for (const type of ['image', 'audio', 'document', 'video']) {
        if (message[type]) {
            mediaPayload = {
                type,
                mediaId: message[type].id,
                mimeType: message[type].mime_type,
                sha256: message[type].sha256,
                caption: message[type].caption,
            };
            break;
        }
    }
    return {
        from,
        text,
        mediaPayload,
        timestamp: message.timestamp,
        messageId: message.id,
    };
}
//# sourceMappingURL=whatsapp.types.js.map