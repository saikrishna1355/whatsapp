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
function formatEntries(entries) {
    return entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
}
exports.expenseHandler = {
    async handle(message, session) {
        const { from, text, mediaPayload } = message;
        const context = (session.context || {});
        if (session.step === 'await_ai_confirmation') {
            if (text === 'ai_confirm') {
                const entries = context.pendingEntries || [];
                if (entries.length === 0) {
                    await whatsapp_client_1.whatsappClient.sendText(from, 'No pending entries found. Please send expense again.');
                    await session_service_1.sessionService.reset(from);
                    await (0, menu_handler_1.sendMenu)(from);
                    return;
                }
                await expense_service_1.expenseService.addMany(from, entries);
                logger_1.logger.info({ from, count: entries.length }, 'Expense entries saved after AI confirmation');
                await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${formatEntries(entries)}`);
                await session_service_1.sessionService.reset(from);
                await (0, menu_handler_1.sendMenu)(from);
                return;
            }
            if (text === 'ai_edit') {
                await session_service_1.sessionService.update(from, { step: 'await_ai_edit', context: context });
                await whatsapp_client_1.whatsappClient.sendText(from, 'Send corrected expense entries as text.\nFormat: Description Amount\nExample: Feed 150');
                return;
            }
            if (text === 'ai_cancel') {
                await session_service_1.sessionService.reset(from);
                await whatsapp_client_1.whatsappClient.sendText(from, 'Cancelled. No entries were saved.');
                await (0, menu_handler_1.sendMenu)(from);
                return;
            }
            await whatsapp_client_1.whatsappClient.sendText(from, 'Please choose: Confirm, Edit, or Cancel.');
            return;
        }
        if (session.step === 'await_ai_edit') {
            if (!text) {
                await whatsapp_client_1.whatsappClient.sendText(from, 'Please send corrected expense entries as text.');
                return;
            }
            const editedEntries = (0, parse_entries_1.parseEntries)(text);
            if (editedEntries.length === 0) {
                await whatsapp_client_1.whatsappClient.sendText(from, "Couldn't parse entries. Format: Description Amount");
                return;
            }
            await expense_service_1.expenseService.addMany(from, editedEntries);
            logger_1.logger.info({ from, count: editedEntries.length }, 'Expense entries saved from user edit');
            await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${editedEntries.length} expense item(s):\n${formatEntries(editedEntries)}`);
            await session_service_1.sessionService.reset(from);
            await (0, menu_handler_1.sendMenu)(from);
            return;
        }
        let entries = text ? (0, parse_entries_1.parseEntries)(text) : [];
        logger_1.logger.debug({ from, source: text ? 'text' : 'media', parsedCount: entries.length }, 'Expense parsing attempt');
        if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
            try {
                entries = await (0, media_ai_service_1.extractEntriesFromMedia)(mediaPayload, 'expense');
            }
            catch (err) {
                logger_1.logger.error({ err, from, mediaType: mediaPayload.type }, 'Expense media extraction failed');
                await whatsapp_client_1.whatsappClient.sendText(from, 'Unable to process media now. Please send expense as text: Description Amount');
                return;
            }
        }
        if (entries.length === 0) {
            await whatsapp_client_1.whatsappClient.sendText(from, "I couldn't parse any expense entries. Send text like:\n*Description Amount*\nExample: Feed 150\n\nYou can also send a bill image or a voice note.");
            return;
        }
        if (mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio') && !text) {
            await session_service_1.sessionService.update(from, {
                step: 'await_ai_confirmation',
                context: { pendingEntries: entries },
            });
            await whatsapp_client_1.whatsappClient.sendButtons(from, `I found ${entries.length} expense item(s):\n${formatEntries(entries)}\n\nConfirm to save?`, [
                { id: 'ai_confirm', title: 'Confirm' },
                { id: 'ai_edit', title: 'Edit' },
                { id: 'ai_cancel', title: 'Cancel' },
            ]);
            return;
        }
        await expense_service_1.expenseService.addMany(from, entries);
        logger_1.logger.info({ from, count: entries.length }, 'Expense entries saved');
        await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${formatEntries(entries)}`);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=expense.handler.js.map