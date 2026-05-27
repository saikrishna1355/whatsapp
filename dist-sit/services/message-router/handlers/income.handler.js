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
function formatEntries(entries) {
    return entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
}
exports.incomeHandler = {
    async handle(message, session) {
        const { from, text, mediaPayload } = message;
        const context = (session.context || {});
        if (session.step === 'await_ai_confirmation') {
            if (text === 'ai_confirm') {
                const entries = context.pendingEntries || [];
                if (entries.length === 0) {
                    await whatsapp_client_1.whatsappClient.sendText(from, 'No pending entries found. Please send income again.');
                    await session_service_1.sessionService.reset(from);
                    await (0, menu_handler_1.sendMenu)(from);
                    return;
                }
                await income_service_1.incomeService.addMany(from, entries);
                logger_1.logger.info({ from, count: entries.length }, 'Income entries saved after AI confirmation');
                await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} income item(s):\n${formatEntries(entries)}`);
                await session_service_1.sessionService.reset(from);
                await (0, menu_handler_1.sendMenu)(from);
                return;
            }
            if (text === 'ai_edit') {
                await session_service_1.sessionService.update(from, { step: 'await_ai_edit', context: context });
                await whatsapp_client_1.whatsappClient.sendText(from, 'Send corrected income entries as text.\nFormat: Description Amount\nExample: Egg sales 200');
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
                await whatsapp_client_1.whatsappClient.sendText(from, 'Please send corrected income entries as text.');
                return;
            }
            const editedEntries = (0, parse_entries_1.parseEntries)(text);
            if (editedEntries.length === 0) {
                await whatsapp_client_1.whatsappClient.sendText(from, "Couldn't parse entries. Format: Description Amount");
                return;
            }
            await income_service_1.incomeService.addMany(from, editedEntries);
            logger_1.logger.info({ from, count: editedEntries.length }, 'Income entries saved from user edit');
            await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${editedEntries.length} income item(s):\n${formatEntries(editedEntries)}`);
            await session_service_1.sessionService.reset(from);
            await (0, menu_handler_1.sendMenu)(from);
            return;
        }
        let entries = text ? (0, parse_entries_1.parseEntries)(text) : [];
        logger_1.logger.debug({ from, source: text ? 'text' : 'media', parsedCount: entries.length }, 'Income parsing attempt');
        if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
            try {
                entries = await (0, media_ai_service_1.extractEntriesFromMedia)(mediaPayload, 'income');
            }
            catch (err) {
                logger_1.logger.error({ err, from, mediaType: mediaPayload.type }, 'Income media extraction failed');
                await whatsapp_client_1.whatsappClient.sendText(from, 'Unable to process media now. Please send income as text: Description Amount');
                return;
            }
        }
        if (entries.length === 0) {
            await whatsapp_client_1.whatsappClient.sendText(from, "I couldn't parse any income entries. Send text like:\n*Description Amount*\nExample: Egg sales 200\n\nYou can also send a receipt image or a voice note.");
            return;
        }
        if (mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio') && !text) {
            await session_service_1.sessionService.update(from, {
                step: 'await_ai_confirmation',
                context: { pendingEntries: entries },
            });
            await whatsapp_client_1.whatsappClient.sendButtons(from, `I found ${entries.length} income item(s):\n${formatEntries(entries)}\n\nConfirm to save?`, [
                { id: 'ai_confirm', title: 'Confirm' },
                { id: 'ai_edit', title: 'Edit' },
                { id: 'ai_cancel', title: 'Cancel' },
            ]);
            return;
        }
        await income_service_1.incomeService.addMany(from, entries);
        logger_1.logger.info({ from, count: entries.length }, 'Income entries saved');
        await whatsapp_client_1.whatsappClient.sendText(from, `✅ Saved ${entries.length} income item(s):\n${formatEntries(entries)}`);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=income.handler.js.map