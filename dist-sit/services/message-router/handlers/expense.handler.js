"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseHandler = void 0;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const expense_service_1 = require("../../../modules/expense/expense.service");
const parse_entries_1 = require("../../../utils/parse-entries");
const menu_handler_1 = require("./menu.handler");
const media_ai_service_1 = require("../media-ai.service");
exports.expenseHandler = {
    async handle(message, session) {
        const { from, text, mediaPayload } = message;
        let entries = text ? (0, parse_entries_1.parseEntries)(text) : [];
        if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
            try {
                entries = await (0, media_ai_service_1.extractEntriesFromMedia)(mediaPayload, 'expense');
            }
            catch {
                await whatsapp_client_1.whatsappClient.sendText(from, 'Unable to process media now. Please send expense as text: Description Amount');
                return;
            }
        }
        if (entries.length === 0) {
            await whatsapp_client_1.whatsappClient.sendText(from, "I couldn't parse any expense entries. Send text like:\n*Description Amount*\nExample: Feed 150\n\nYou can also send a bill image or a voice note.");
            return;
        }
        await expense_service_1.expenseService.addMany(from, entries);
        const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
        await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${summary}`);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=expense.handler.js.map