import type { MessageHandler } from '../handler.types';
import type { InboundMessage } from '../../whatsapp/whatsapp.types';
import type { UserSession } from '../../session/session.types';
import { whatsappClient } from '../../whatsapp/whatsapp.client';
import { sessionService } from '../../session/session.service';
import { buildReport } from '../../../modules/report/report.helper';
import { userRepository } from '../../../modules/user/user.repository';
import { sendMenu } from './menu.handler';
import { today, daysAgo } from '../../../utils/date';
import { reportQuotaService } from '../../../modules/subscription/report-quota.service';

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

    const quota = await reportQuotaService.canGenerateReport(userId);
    if (!quota.allowed) {
      await whatsappClient.sendText(
        from,
        `Daily report limit reached (${quota.used}/${quota.limit}). Upgrade to Pro for 5 reports/day.`
      );
      await sessionService.reset(from);
      await sendMenu(from);
      return;
    }

    try {
      await whatsappClient.indicateTyping(messageId);
    } catch {
      // non-blocking
    }

    const { buffer, filename } = await buildReport(from, userId, period, dateFrom, dateTo);
    await whatsappClient.sendDocument(from, buffer, filename);
    await whatsappClient.sendText(from, `Report usage today: ${quota.used + 1}/${quota.limit} (${quota.plan})`);

    await sessionService.reset(from);
    await sendMenu(from);
  },
};
