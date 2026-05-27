"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserTransactions = getUserTransactions;
exports.listTransactions = listTransactions;
exports.getFlow = getFlow;
exports.listReportLogs = listReportLogs;
exports.downloadReport = downloadReport;
exports.generateReport = generateReport;
exports.updateFlow = updateFlow;
const connection_1 = require("../database/connection");
const report_log_repository_1 = require("../modules/report/report-log.repository");
const report_helper_1 = require("../modules/report/report.helper");
const date_1 = require("../utils/date");
async function listUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    let query = (0, connection_1.db)('users');
    let countQuery = (0, connection_1.db)('users');
    if (search) {
        query = query.where((qb) => {
            qb.where('phone_number', 'like', `%${search}%`)
                .orWhere('name', 'like', `%${search}%`);
        });
        countQuery = countQuery.where((qb) => {
            qb.where('phone_number', 'like', `%${search}%`)
                .orWhere('name', 'like', `%${search}%`);
        });
    }
    if (fromDate) {
        query = query.where('created_at', '>=', fromDate);
        countQuery = countQuery.where('created_at', '>=', fromDate);
    }
    if (toDate) {
        query = query.where('created_at', '<=', `${toDate} 23:59:59`);
        countQuery = countQuery.where('created_at', '<=', `${toDate} 23:59:59`);
    }
    const [users, [{ total }]] = await Promise.all([
        query.select('id', 'phone_number', 'name', 'business_type', 'created_at')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset),
        countQuery.count('id as total'),
    ]);
    const userIds = users.map((u) => u.id);
    const txCounts = userIds.length > 0
        ? await (0, connection_1.db)('transactions')
            .whereIn('user_id', userIds)
            .groupBy('user_id')
            .select('user_id', connection_1.db.raw('COUNT(*) as transaction_count'))
        : [];
    const txMap = new Map(txCounts.map((t) => [t.user_id, t.transaction_count]));
    const usersWithCount = users.map((u) => ({
        ...u,
        transaction_count: txMap.get(u.id) || 0,
    }));
    res.json({ code: 200, data: { users: usersWithCount, total, page, limit } });
}
async function getUserTransactions(req, res) {
    const { id } = req.params;
    const type = req.query.type;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const user = await (0, connection_1.db)('users').where('id', id).first();
    if (!user) {
        res.status(404).json({ code: 404, message: 'User not found' });
        return;
    }
    let query = (0, connection_1.db)('transactions').where('user_id', id);
    let countQuery = (0, connection_1.db)('transactions').where('user_id', id);
    if (type && (type === 'income' || type === 'expense')) {
        query = query.where('type', type);
        countQuery = countQuery.where('type', type);
    }
    if (search) {
        query = query.where('description', 'like', `%${search}%`);
        countQuery = countQuery.where('description', 'like', `%${search}%`);
    }
    if (fromDate) {
        query = query.where('created_at', '>=', fromDate);
        countQuery = countQuery.where('created_at', '>=', fromDate);
    }
    if (toDate) {
        query = query.where('created_at', '<=', `${toDate} 23:59:59`);
        countQuery = countQuery.where('created_at', '<=', `${toDate} 23:59:59`);
    }
    const [transactions, [{ total }]] = await Promise.all([
        query.select('*').orderBy('created_at', 'desc').limit(limit).offset(offset),
        countQuery.count('id as total'),
    ]);
    res.json({ code: 200, data: { user, transactions, total, page, limit } });
}
async function listTransactions(req, res) {
    const type = req.query.type;
    const user = req.query.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    let query = (0, connection_1.db)('transactions');
    let countQuery = (0, connection_1.db)('transactions');
    if (user) {
        query = query.where('user_id', user);
        countQuery = countQuery.where('user_id', user);
    }
    if (type && (type === 'income' || type === 'expense')) {
        query = query.where('type', type);
        countQuery = countQuery.where('type', type);
    }
    if (search) {
        query = query.where('description', 'like', `%${search}%`);
        countQuery = countQuery.where('description', 'like', `%${search}%`);
    }
    if (fromDate) {
        query = query.where('created_at', '>=', fromDate);
        countQuery = countQuery.where('created_at', '>=', fromDate);
    }
    if (toDate) {
        query = query.where('created_at', '<=', `${toDate} 23:59:59`);
        countQuery = countQuery.where('created_at', '<=', `${toDate} 23:59:59`);
    }
    const [transactions, [{ total }]] = await Promise.all([
        query.select('*').orderBy('created_at', 'desc').limit(limit).offset(offset),
        countQuery.count('id as total'),
    ]);
    res.json({ code: 200, data: { transactions, total, page, limit } });
}
async function getFlow(_req, res) {
    const row = await (0, connection_1.db)('flow').where('key', 'conversation_flow').first();
    if (!row) {
        res.json({ code: 200, data: { conversation: [] } });
        return;
    }
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    res.json({ code: 200, data });
}
async function listReportLogs(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.query.userId;
    const period = req.query.period;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const data = await report_log_repository_1.reportLogRepository.list({ userId, period, fromDate, toDate, page, limit });
    res.json({ code: 200, data });
}
async function downloadReport(req, res) {
    const { id } = req.params;
    const log = await (0, connection_1.db)('report_logs').join('users', 'users.id', 'report_logs.user_id').where('report_logs.id', id)
        .select('users.phone_number', 'users.id as user_id', 'report_logs.period', 'report_logs.date_from', 'report_logs.date_to').first();
    if (!log) {
        res.status(404).json({ code: 404, message: 'Report log not found' });
        return;
    }
    const dateFrom = (0, date_1.toDateStr)(log.date_from);
    const dateTo = (0, date_1.toDateStr)(log.date_to);
    const { buffer, filename } = await (0, report_helper_1.buildReport)(log.phone_number, log.user_id, log.period, dateFrom, dateTo);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
}
async function generateReport(req, res) {
    const { userId, fromDate, toDate } = req.body;
    if (!userId || !fromDate || !toDate) {
        res.status(400).json({ code: 400, message: 'userId, fromDate and toDate are required' });
        return;
    }
    const user = await (0, connection_1.db)('users').where('id', userId).first();
    if (!user) {
        res.status(404).json({ code: 404, message: 'User not found' });
        return;
    }
    const period = fromDate === toDate ? 'today' : 'week';
    const { buffer, filename } = await (0, report_helper_1.buildReport)(user.phone_number, userId, period, fromDate, toDate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
}
async function updateFlow(req, res) {
    const flowData = req.body;
    if (!flowData || !flowData.conversation) {
        res.status(400).json({ code: 400, message: 'Invalid flow data' });
        return;
    }
    const exists = await (0, connection_1.db)('flow').where('key', 'conversation_flow').first();
    if (exists) {
        await (0, connection_1.db)('flow').where('key', 'conversation_flow').update({
            data: JSON.stringify(flowData),
            updated_at: connection_1.db.fn.now(),
        });
    }
    else {
        await (0, connection_1.db)('flow').insert({
            key: 'conversation_flow',
            data: JSON.stringify(flowData),
        });
    }
    res.json({ code: 200, message: 'Flow updated successfully' });
}
//# sourceMappingURL=fe-admin.controller.js.map