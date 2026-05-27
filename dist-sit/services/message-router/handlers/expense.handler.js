"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseHandler = void 0;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const expense_service_1 = require("../../../modules/expense/expense.service");
const parse_entries_1 = require("../../../utils/parse-entries");
const menu_handler_1 = require("./menu.handler");
exports.expenseHandler = {
    async handle(message, session) {
        const { from, text } = message;
        if (!text) {
            await whatsapp_client_1.whatsappClient.sendText(from, 'Please enter your expenses as text.\n\nFormat: *Description Amount*');
            return;
        }
        const entries = (0, parse_entries_1.parseEntries)(text);
        if (entries.length === 0) {
            await whatsapp_client_1.whatsappClient.sendText(from, "I couldn't parse any entries. Please use the format:\n*Description Amount*\n\nExample: Feed 150");
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