import type { InboundMessage } from '../whatsapp/whatsapp.types';
import type { MessageHandler } from './handler.types';
import { sessionService } from '../session/session.service';
import { menuHandler } from './handlers/menu.handler';
import { incomeHandler } from './handlers/income.handler';
import { expenseHandler } from './handlers/expense.handler';
import { reportHandler } from './handlers/report.handler';
import { sendMenu } from './handlers/menu.handler';
import { logger } from '../../utils/logger';
import { parseEntries } from '../../utils/parse-entries';
import { whatsappClient } from '../whatsapp/whatsapp.client';

const PENDING_EXPIRE_MINUTES = 3;

const handlers: Record<string, MessageHandler> = {
  menu: menuHandler,
  income: incomeHandler,
  expense: expenseHandler,
  report: reportHandler,
};

export const messageRouter = {
  async route(message: InboundMessage): Promise<void> {
    const { from } = message;

    try {
      let session = await sessionService.getOrCreate(from);
      const normalized = message.text?.trim().toLowerCase();

      if (normalized === 'back' || normalized === 'home') {
        await sessionService.reset(from);
        await sendMenu(from);
        return;
      }

      if (session.step === 'await_ai_confirmation' || session.step === 'await_ai_edit') {
        const elapsedMins = (Date.now() - new Date(session.updatedAt).getTime()) / 1000 / 60;
        if (elapsedMins > PENDING_EXPIRE_MINUTES) {
          await sessionService.reset(from);
          await whatsappClient.sendText(from, 'Inactive detected. Please send hi to start again.');
          session = await sessionService.getOrCreate(from);
        }
      }

      logger.debug({ from, module: session.module, step: session.step, text: message.text }, 'Routing message');

      if (session.module === 'menu' && message.text) {
        const entries = parseEntries(message.text);
        if (entries.length > 0) {
          const lowered = message.text.toLowerCase();
          const expenseHints = ['expense', 'spent', 'buy', 'bought', 'paid', 'fuel', 'feed', 'transport'];
          const looksExpense = expenseHints.some((hint) => lowered.includes(hint));
          const autoModule = looksExpense ? 'expense' : 'income';
          logger.info({ from, autoModule, entries: entries.length }, 'Auto-routing parsed text from menu');
          await sessionService.update(from, { module: autoModule, step: 'await_input' });
          const handler = autoModule === 'expense' ? expenseHandler : incomeHandler;
          await handler.handle(message, { ...session, module: autoModule, step: 'await_input' });
          return;
        }
      }

      const handler = handlers[session.module] || menuHandler;
      await handler.handle(message, session);
    } catch (err) {
      logger.error({ err, from }, 'Message routing failed');
      try {
        const { whatsappClient } = await import('../whatsapp/whatsapp.client');
        await whatsappClient.sendText(from, 'Sorry, something went wrong. Please try again.');
      } catch {
        // Swallow — can't notify user
      }
    }
  },
};
