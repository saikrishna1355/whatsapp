"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportHandler = void 0;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const report_helper_1 = require("../../../modules/report/report.helper");
const user_repository_1 = require("../../../modules/user/user.repository");
const menu_handler_1 = require("./menu.handler");
const date_1 = require("../../../utils/date");
exports.reportHandler = {
    async handle(message, session) {
        const { from, text } = message;
        const normalized = text?.toLowerCase() || '';
        let period = 'today';
        if (normalized.includes('week') || normalized === 'report_week') {
            period = 'week';
        }
        const dateTo = (0, date_1.today)();
        const dateFrom = period === 'week' ? (0, date_1.daysAgo)(7) : dateTo;
        const userId = await user_repository_1.userRepository.getIdByPhone(from);
        const { buffer, filename } = await (0, report_helper_1.buildReport)(from, userId, period, dateFrom, dateTo);
        await whatsapp_client_1.whatsappClient.sendDocument(from, buffer, filename);
        await session_service_1.sessionService.reset(from);
        await (0, menu_handler_1.sendMenu)(from);
    },
};
//# sourceMappingURL=report.handler.js.map