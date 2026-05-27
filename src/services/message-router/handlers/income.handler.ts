import type { MessageHandler } from '../handler.types';
import type { InboundMessage } from '../../whatsapp/whatsapp.types';
import type { UserSession } from '../../session/session.types';
import { whatsappClient } from '../../whatsapp/whatsapp.client';
import { sessionService } from '../../session/session.service';
import { incomeService } from '../../../modules/income/income.service';
import { parseEntries } from '../../../utils/parse-entries';
import { sendMenu } from './menu.handler';
import { extractEntriesFromMedia } from '../media-ai.service';

export const incomeHandler: MessageHandler = {
  async handle(message: InboundMessage, session: UserSession): Promise<void> {
    const { from, text, mediaPayload } = message;

    let entries = text ? parseEntries(text) : [];
    if (entries.length === 0 && mediaPayload && (mediaPayload.type === 'image' || mediaPayload.type === 'audio')) {
      try {
        entries = await extractEntriesFromMedia(mediaPayload, 'income');
      } catch {
        await whatsappClient.sendText(from, 'Unable to process media now. Please send income as text: Description Amount');
        return;
      }
    }

    if (entries.length === 0) {
      await whatsappClient.sendText(
        from,
        "I couldn't parse any income entries. Send text like:\n*Description Amount*\nExample: Egg sales 200\n\nYou can also send a receipt image or a voice note."
      );
      return;
    }

    await incomeService.addMany(from, entries);

    const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
    await whatsappClient.sendText(from, `✅ Saved ${entries.length} income item(s):\n${summary}`);

    await sessionService.reset(from);
    await sendMenu(from);
  },
};
