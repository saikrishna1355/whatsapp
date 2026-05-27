"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReport = buildReport;
const report_service_1 = require("./report.service");
const report_pdf_1 = require("./report.pdf");
const report_log_repository_1 = require("./report-log.repository");
const date_1 = require("../../utils/date");
async function buildReport(phoneNumber, userId, period, dateFrom, dateTo) {
    const from = (0, date_1.toDateStr)(dateFrom);
    const to = (0, date_1.toDateStr)(dateTo);
    const reportData = await report_service_1.reportService.generate(phoneNumber, period, from, to);
    const buffer = await (0, report_pdf_1.generateReportPDF)(reportData, from, to);
    const filename = `report-${phoneNumber}-${Date.now()}.pdf`;
    await report_log_repository_1.reportLogRepository.insert(userId, period, from, to);
    return { buffer, filename };
}
//# sourceMappingURL=report.helper.js.map