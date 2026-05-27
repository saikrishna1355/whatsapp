import type { MessageHandler } from '../handler.types';
import type { InboundMessage } from '../../whatsapp/whatsapp.types';
import type { UserSession } from '../../session/session.types';
import { whatsappClient } from '../../whatsapp/whatsapp.client';
import { sessionService } from '../../session/session.service';
import { expenseService } from '../../../modules/expense/expense.service';
import { parseEntries } from '../../../utils/parse-entries';
import { sendMenu } from './menu.handler';

export const expenseHandler: MessageHandler = {
  async handle(message: InboundMessage, session: UserSession): Promise<void> {
    const { from, text } = message;

    if (!text) {
      await whatsappClient.sendText(from, 'Please enter your expenses as text.\n\nFormat: *Description Amount*');
      return;
    }

    const entries = parseEntries(text);

    if (entries.length === 0) {
      await whatsappClient.sendText(from, "I couldn't parse any entries. Please use the format:\n*Description Amount*\n\nExample: Feed 150");
      return;
    }

    await expenseService.addMany(from, entries);

    const summary = entries.map((e) => `• ${e.description}: ${e.amount}`).join('\n');
    await whatsappClient.sendText(from, `✅ Saved ${entries.length} expense item(s):\n${summary}`);

    await sessionService.reset(from);
    await sendMenu(from);
  },
};
