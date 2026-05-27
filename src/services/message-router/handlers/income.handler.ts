import type { MessageHandler } from '../handler.types';
import type { InboundMessage } from '../../whatsapp/whatsapp.types';
import type { UserSession } from '../../session/session.types';
import { whatsappClient } from '../../whatsapp/whatsapp.client';
import { sessionService } from '../../session/session.service';
import { incomeService } from '../../../modules/income/income.service';
import { parseEntries } from '../../../utils/parse-entries';
import { sendMenu } from './menu.handler';

export const incomeHandler: MessageHandler = {
  async handle(message: InboundMessage, session: UserSession): Promise<void> {
    const { from, text } = message;

    if (!text) {
      await whatsappClient.sendText(from, 'Please enter your income as text.\n\nFormat: *Description Amount*');
      return;
    }

    const entries = parseEntries(text);

    if (entries.length === 0) {
      await whatsappClient.sendText(from, "I couldn't parse any entries. Please use the format:\n*Description Amount*\n\nExample: Egg sales 200");
      return;
    }

    await incomeService.addMany(from, entries);

    const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
    await whatsappClient.sendText(from, `✅ Saved ${entries.length} income item(s):\n${summary}`);

    await sessionService.reset(from);
    await sendMenu(from);
  },
};
