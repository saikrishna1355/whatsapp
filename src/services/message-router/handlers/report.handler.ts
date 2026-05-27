import type { MessageHandler } from '../handler.types';
import type { InboundMessage } from '../../whatsapp/whatsapp.types';
import type { UserSession } from '../../session/session.types';
import { whatsappClient } from '../../whatsapp/whatsapp.client';
import { sessionService } from '../../session/session.service';
import { buildReport } from '../../../modules/report/report.helper';
import { userRepository } from '../../../modules/user/user.repository';
import { sendMenu } from './menu.handler';
import { today, daysAgo } from '../../../utils/date';

export const reportHandler: MessageHandler = {
  async handle(message: InboundMessage, session: UserSession): Promise<void> {
    const { from, text, messageId } = message;
    const normalized = text?.toLowerCase() || '';

    let period: 'today' | 'week' = 'today';
    if (normalized.includes('week') || normalized === 'report_week') {
      period = 'week';
    }

    const dateTo = today();
    const dateFrom = period === 'week' ? daysAgo(7) : dateTo;
    const userId = await userRepository.getIdByPhone(from);

    try {
      await whatsappClient.indicateTyping(messageId);
    } catch {
      // non-blocking
    }

    const { buffer, filename } = await buildReport(from, userId, period, dateFrom, dateTo);
    await whatsappClient.sendDocument(from, buffer, filename);

    await sessionService.reset(from);
    await sendMenu(from);
  },
};
