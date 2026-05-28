"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQuotaService = exports.PLAN_REPORT_LIMIT = void 0;
const connection_1 = require("../../database/connection");
const subscription_repository_1 = require("./subscription.repository");
function nowInIST() {
    const now = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    return new Date(now.getTime() + istOffsetMs + now.getTimezoneOffset() * 60 * 1000);
}
function istDateString(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
exports.PLAN_REPORT_LIMIT = {
    free: 2,
    pro: 5,
};
exports.reportQuotaService = {
    async getEffectivePlan(userId) {
        const sub = await subscription_repository_1.subscriptionRepository.getByUserId(userId);
        if (!sub)
            return 'free';
        const plan = sub.plan === 'pro' ? 'pro' : 'free';
        const status = sub.status || 'active';
        if (status !== 'active')
            return 'free';
        if (sub.expires_at) {
            const now = nowInIST();
            const exp = new Date(sub.expires_at);
            if (exp.getTime() < now.getTime())
                return 'free';
        }
        return plan;
    },
    async getTodayReportUsage(userId) {
        const istNow = nowInIST();
        const date = istDateString(istNow);
        const startUtc = new Date(`${date}T00:00:00+05:30`).toISOString().slice(0, 19).replace('T', ' ');
        const endUtc = new Date(`${date}T23:59:59+05:30`).toISOString().slice(0, 19).replace('T', ' ');
        const row = await (0, connection_1.db)('report_logs')
            .where('user_id', userId)
            .whereBetween('generated_at', [startUtc, endUtc])
            .count('id as total')
            .first();
        return Number(row?.total || 0);
    },
    async canGenerateReport(userId) {
        const plan = await this.getEffectivePlan(userId);
        const limit = exports.PLAN_REPORT_LIMIT[plan];
        const used = await this.getTodayReportUsage(userId);
        return {
            allowed: used < limit,
            used,
            limit,
            plan,
        };
    },
};
//# sourceMappingURL=report-quota.service.js.map