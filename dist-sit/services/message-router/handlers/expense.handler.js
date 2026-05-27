"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseHandler = void 0;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const expense_service_1 = require("../../../modules/expense/expense.service");
const parse_entries_1 = require("../../../utils/parse-entries");
const menu_handler_1 = require("./menu.handler");
const media_ai_service_1 = require("../media-ai.service");
const logger_1 = require("../../../utils/logger");
exports.expenseHandler = {
    async handle(message, session) {
        const { from, text, mediaPayload } = message;
        let entries = text ? (0, parse_entries_1.parseEntries)(text) : [];
        logger_1.logger.debug({ from, source: text ? 'text' : 'media', parsedCount: entries.length }, 'Expense parsing attempt');
        if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
            try {
                entries = await (0, media_ai_service_1.extractEntriesFromMedia)(mediaPayload, 'expense');
            }
            catch {
                logger_1.logger.error({ from, mediaType: mediaPayload.type }, 'Expense media extraction failed');
                await whatsapp_client_1.whatsappClient.sendText(from, 'Unable to process media now. Please send expense as text: Description Amount');
                return;
            }
        }
        if (entries.length === 0) {
            await whatsapp_client_1.whatsappClient.sendText(from, "I couldn't parse any expense entries. Send text like:\n*Description Amount*\nExample: Feed 150\n\nYou can also send a bill image or a voice note.");
            return;
        }
        await expense_service_1.expenseService.addMany(from, entries);
        logger_1.logger.info({ from, count: entries.length }, 'Expense entries saved');
        const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
        await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${summary}`);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=expense.handler.js.map