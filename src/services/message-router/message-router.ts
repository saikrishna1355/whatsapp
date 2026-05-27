import type { InboundMessage } from '../whatsapp/whatsapp.types';
import type { MessageHandler } from './handler.types';
import { sessionService } from '../session/session.service';
import { menuHandler } from './handlers/menu.handler';
import { incomeHandler } from './handlers/income.handler';
import { expenseHandler } from './handlers/expense.handler';
import { reportHandler } from './handlers/report.handler';
import { logger } from '../../utils/logger';

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
      const session = await sessionService.getOrCreate(from);

      logger.debug({ from, module: session.module, step: session.step, text: message.text }, 'Routing message');

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
