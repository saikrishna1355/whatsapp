"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incomeHandler = void 0;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const income_service_1 = require("../../../modules/income/income.service");
const parse_entries_1 = require("../../../utils/parse-entries");
const menu_handler_1 = require("./menu.handler");
exports.incomeHandler = {
    async handle(message, session) {
        const { from, text } = message;
        if (!text) {
            await whatsapp_client_1.whatsappClient.sendText(from, 'Please enter your income as text.\n\nFormat: *Description Amount*');
            return;
        }
        const entries = (0, parse_entries_1.parseEntries)(text);
        if (entries.length === 0) {
            await whatsapp_client_1.whatsappClient.sendText(from, "I couldn't parse any entries. Please use the format:\n*Description Amount*\n\nExample: Egg sales 200");
            return;
        }
        await income_service_1.incomeService.addMany(from, entries);
        const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
        await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} income item(s):\n${summary}`);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=income.handler.js.map