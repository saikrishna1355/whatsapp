"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportHandler = void 0;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const report_helper_1 = require("../../../modules/report/report.helper");
const user_repository_1 = require("../../../modules/user/user.repository");
const menu_handler_1 = require("./menu.handler");
const date_1 = require("../../../utils/date");
const report_quota_service_1 = require("../../../modules/subscription/report-quota.service");
exports.reportHandler = {
    async handle(message, session) {
        const { from, text, messageId } = message;
        const normalized = text?.toLowerCase() || '';
        let period = 'today';
        if (normalized.includes('week') || normalized === 'report_week') {
            period = 'week';
        }
        const dateTo = (0, date_1.today)();
        const dateFrom = period === 'week' ? (0, date_1.daysAgo)(7) : dateTo;
        const userId = await user_repository_1.userRepository.getIdByPhone(from);
        const quota = await report_quota_service_1.reportQuotaService.canGenerateReport(userId);
        if (!quota.allowed) {
            await whatsapp_client_1.whatsappClient.sendText(from, `Daily report limit reached (${quota.used}/${quota.limit}). Upgrade to Pro for 5 reports/day.`);
            await session_service_1.sessionService.reset(from);
            await (0, menu_handler_1.sendMenu)(from);
            return;
        }
        try {
            await whatsapp_client_1.whatsappClient.indicateTyping(messageId);
        }
        catch {
            // non-blocking
        }
        const { buffer, filename } = await (0, report_helper_1.buildReport)(from, userId, period, dateFrom, dateTo);
        await whatsapp_client_1.whatsappClient.sendDocument(from, buffer, filename);
        await whatsapp_client_1.whatsappClient.sendText(from, `Report usage today: ${quota.used + 1}/${quota.limit} (${quota.plan})`);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=report.handler.js.map