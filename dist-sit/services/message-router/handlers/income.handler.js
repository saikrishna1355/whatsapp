"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incomeHandler = void 0;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const income_service_1 = require("../../../modules/income/income.service");
const parse_entries_1 = require("../../../utils/parse-entries");
const menu_handler_1 = require("./menu.handler");
const media_ai_service_1 = require("../media-ai.service");
const logger_1 = require("../../../utils/logger");
exports.incomeHandler = {
    async handle(message, session) {
        const { from, text, mediaPayload } = message;
        let entries = text ? (0, parse_entries_1.parseEntries)(text) : [];
        logger_1.logger.debug({ from, source: text ? 'text' : 'media', parsedCount: entries.length }, 'Income parsing attempt');
        if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
            try {
                entries = await (0, media_ai_service_1.extractEntriesFromMedia)(mediaPayload, 'income');
            }
            catch {
                logger_1.logger.error({ from, mediaType: mediaPayload.type }, 'Income media extraction failed');
                await whatsapp_client_1.whatsappClient.sendText(from, 'Unable to process media now. Please send income as text: Description Amount');
                return;
            }
        }
        if (entries.length === 0) {
            await whatsapp_client_1.whatsappClient.sendText(from, "I couldn't parse any income entries. Send text like:\n*Description Amount*\nExample: Egg sales 200\n\nYou can also send a receipt image or a voice note.");
            return;
        }
        await income_service_1.incomeService.addMany(from, entries);
        logger_1.logger.info({ from, count: entries.length }, 'Income entries saved');
        const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
        await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} income item(s):\n${summary}`);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=income.handler.js.map