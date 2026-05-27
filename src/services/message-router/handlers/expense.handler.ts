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

export const expenseHandler: MessageHandler = {
  async handle(message: InboundMessage, session: UserSession): Promise<void> {
    const { from, text, mediaPayload } = message;

    let entries = text ? parseEntries(text) : [];
    logger.debug({ from, source: text ? 'text' : 'media', parsedCount: entries.length }, 'Expense parsing attempt');
    if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
      try {
        entries = await extractEntriesFromMedia(mediaPayload, 'expense');
      } catch {
        logger.error({ from, mediaType: mediaPayload.type }, 'Expense media extraction failed');
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

    await expenseService.addMany(from, entries);
    logger.info({ from, count: entries.length }, 'Expense entries saved');

    const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
    await whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${summary}`);

    await sessionService.reset(from);
    await sendMenu(from);
  },
};
