import type { MessageHandler } from '../handler.types';
import type { InboundMessage } from '../../whatsapp/whatsapp.types';
import type { UserSession } from '../../session/session.types';
import { whatsappClient } from '../../whatsapp/whatsapp.client';
import { sessionService } from '../../session/session.service';
import { expenseService } from '../../../modules/expense/expense.service';
import { parseEntries } from '../../../utils/parse-entries';
import { sendMenu } from './menu.handler';
import { extractEntriesFromMedia } from '../media-ai.service';
import { logger } from '../../../utils/logger';

interface PendingAIContext {
  pendingEntries?: Array<{ description: string; amount: number }>;
}

function formatEntries(entries: Array<{ description: string; amount: number }>): string {
  return entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
}

export const expenseHandler: MessageHandler = {
  async handle(message: InboundMessage, session: UserSession): Promise<void> {
    const { from, text, mediaPayload } = message;
    const context = (session.context || {}) as PendingAIContext;

    if (session.step === 'await_ai_confirmation') {
      if (text === 'ai_confirm') {
        const entries = context.pendingEntries || [];
        if (entries.length === 0) {
          await whatsappClient.sendText(from, 'No pending entries found. Please send expense again.');
          await sessionService.reset(from);
          await sendMenu(from);
          return;
        }
        await expenseService.addMany(from, entries);
        logger.info({ from, count: entries.length }, 'Expense entries saved after AI confirmation');
        await whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${formatEntries(entries)}`);
        await sessionService.reset(from);
        await sendMenu(from);
        return;
      }
      if (text === 'ai_edit') {
        await sessionService.update(from, { step: 'await_ai_edit', context: context as Record<string, unknown> });
        await whatsappClient.sendText(from, 'Send corrected expense entries as text.\nFormat: Description Amount\nExample: Feed 150');
        return;
      }
      if (text === 'ai_cancel') {
        await sessionService.reset(from);
        await whatsappClient.sendText(from, 'Cancelled. No entries were saved.');
        await sendMenu(from);
        return;
      }
      await whatsappClient.sendText(from, 'Please choose: Confirm, Edit, or Cancel.');
      return;
    }

    if (session.step === 'await_ai_edit') {
      if (!text) {
        await whatsappClient.sendText(from, 'Please send corrected expense entries as text.');
        return;
      }
      const editedEntries = parseEntries(text);
      if (editedEntries.length === 0) {
        await whatsappClient.sendText(from, "Couldn't parse entries. Format: Description Amount");
        return;
      }
      await expenseService.addMany(from, editedEntries);
      logger.info({ from, count: editedEntries.length }, 'Expense entries saved from user edit');
      await whatsappClient.sendText(from, `✅ Saved ${editedEntries.length} expense item(s):\n${formatEntries(editedEntries)}`);
      await sessionService.reset(from);
      await sendMenu(from);
      return;
    }

    let entries = text ? parseEntries(text) : [];
    logger.debug({ from, source: text ? 'text' : 'media', parsedCount: entries.length }, 'Expense parsing attempt');
    if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
      try {
        entries = await extractEntriesFromMedia(mediaPayload, 'expense');
      } catch (err) {
        logger.error({ err, from, mediaType: mediaPayload.type }, 'Expense media extraction failed');
        await whatsappClient.sendText(from, 'Unable to process media now. Please send expense as text: Description Amount');
        return;
      }
    }

    if (entries.length === 0) {
      await whatsappClient.sendText(
        from,
        "I couldn't parse any expense entries. Send text like:\n*Description Amount*\nExample: Feed 150\n\nYou can also send a bill image or a voice note."
      );
      return;
    }

    if (mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio') && !text) {
      await sessionService.update(from, {
        step: 'await_ai_confirmation',
        context: { pendingEntries: entries },
      });
      await whatsappClient.sendButtons(from, `I found ${entries.length} expense item(s):\n${formatEntries(entries)}\n\nConfirm to save?`, [
        { id: 'ai_confirm', title: 'Confirm' },
        { id: 'ai_edit', title: 'Edit' },
        { id: 'ai_cancel', title: 'Cancel' },
      ]);
      return;
    }

    await expenseService.addMany(from, entries);
    logger.info({ from, count: entries.length }, 'Expense entries saved');

    await whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${formatEntries(entries)}`);

    await sessionService.reset(from);
    await sendMenu(from);
  },
};
