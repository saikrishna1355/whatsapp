import { Request, Response } from 'express';
import { db } from '../database/connection';
import { reportLogRepository } from '../modules/report/report-log.repository';
import { buildReport } from '../modules/report/report.helper';
import { toDateStr } from '../utils/date';
import { subscriptionRepository } from '../modules/subscription/subscription.repository';
import { reportQuotaService } from '../modules/subscription/report-quota.service';

export async function listUsers(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || '';
  const fromDate = req.query.fromDate as string;
  const toDate = req.query.toDate as string;

  let query = db('users');
  let countQuery = db('users');

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

  const userIds = users.map((u: any) => u.id);
  const txCounts = userIds.length > 0
    ? await db('transactions')
        .whereIn('user_id', userIds)
        .groupBy('user_id')
        .select('user_id', db.raw('COUNT(*) as transaction_count'))
    : [];

  const txMap = new Map(txCounts.map((t: any) => [t.user_id, t.transaction_count]));

  const usersWithCount = users.map((u: any) => ({
    ...u,
    transaction_count: txMap.get(u.id) || 0,
  }));

  res.json({ code: 200, data: { users: usersWithCount, total, page, limit } });
}

export async function getUserTransactions(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const type = req.query.type as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || '';
  const fromDate = req.query.fromDate as string;
  const toDate = req.query.toDate as string;

  const user = await db('users').where('id', id).first();
  if (!user) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  }

  let query = db('transactions').where('user_id', id);
  let countQuery = db('transactions').where('user_id', id);

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

export async function listTransactions(req: Request, res: Response): Promise<void> {
  const type = req.query.type as string;
  const user = req.query.user as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || '';
  const fromDate = req.query.fromDate as string;
  const toDate = req.query.toDate as string;

  let query = db('transactions');
  let countQuery = db('transactions');

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

export async function getFlow(_req: Request, res: Response): Promise<void> {
  const row = await db('flow').where('key', 'conversation_flow').first();
  if (!row) {
    res.json({ code: 200, data: { conversation: [] } });
    return;
  }
  const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
  res.json({ code: 200, data });
}

export async function listReportLogs(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const userId = req.query.userId as string;
  const period = req.query.period as string;
  const fromDate = req.query.fromDate as string;
  const toDate = req.query.toDate as string;

  const data = await reportLogRepository.list({ userId, period, fromDate, toDate, page, limit });
  res.json({ code: 200, data });
}

export async function downloadReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const log = await db('report_logs').join('users', 'users.id', 'report_logs.user_id').where('report_logs.id', id)
    .select('users.phone_number', 'users.id as user_id', 'report_logs.period', 'report_logs.date_from', 'report_logs.date_to').first();

  if (!log) {
    res.status(404).json({ code: 404, message: 'Report log not found' });
    return;
  }

  const dateFrom = toDateStr(log.date_from);
  const dateTo = toDateStr(log.date_to);

  const { buffer, filename } = await buildReport(log.phone_number, log.user_id, log.period, dateFrom, dateTo);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buffer);
}

export async function generateReport(req: Request, res: Response): Promise<void> {
  const { userId, fromDate, toDate } = req.body;
  if (!userId || !fromDate || !toDate) {
    res.status(400).json({ code: 400, message: 'userId, fromDate and toDate are required' });
    return;
  }

  const user = await db('users').where('id', userId).first();
  if (!user) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  }

  const period: 'today' | 'week' = fromDate === toDate ? 'today' : 'week';
  const { buffer, filename } = await buildReport(user.phone_number, userId, period, fromDate, toDate);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buffer);
}

export async function updateFlow(req: Request, res: Response): Promise<void> {
  const flowData = req.body;
  if (!flowData || !flowData.conversation) {
    res.status(400).json({ code: 400, message: 'Invalid flow data' });
    return;
  }

  const exists = await db('flow').where('key', 'conversation_flow').first();
  if (exists) {
    await db('flow').where('key', 'conversation_flow').update({
      data: JSON.stringify(flowData),
      updated_at: db.fn.now(),
    });
  } else {
    await db('flow').insert({
      key: 'conversation_flow',
      data: JSON.stringify(flowData),
    });
  }

  res.json({ code: 200, message: 'Flow updated successfully' });
}

export async function getUserSubscription(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.id, 10);
  if (!userId) {
    res.status(400).json({ code: 400, message: 'Invalid user id' });
    return;
  }

  const user = await db('users').where('id', userId).first();
  if (!user) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  }

  const sub = await subscriptionRepository.getByUserId(userId);
  const quota = await reportQuotaService.canGenerateReport(userId);

  res.json({
    code: 200,
    data: {
      subscription: sub || { plan: 'free', status: 'active', expires_at: null },
      reportQuota: quota,
    },
  });
}

export async function updateUserSubscription(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.id, 10);
  if (!userId) {
    res.status(400).json({ code: 400, message: 'Invalid user id' });
    return;
  }

  const { plan, status, expiresAt } = req.body as {
    plan?: 'free' | 'pro';
    status?: 'active' | 'expired' | 'cancelled';
    expiresAt?: string | null;
  };

  if (!plan || (plan !== 'free' && plan !== 'pro')) {
    res.status(400).json({ code: 400, message: 'plan must be free or pro' });
    return;
  }

  await subscriptionRepository.upsertByUserId(userId, {
    plan,
    status,
    expiresAt: expiresAt ?? null,
  });

  const sub = await subscriptionRepository.getByUserId(userId);
  res.json({ code: 200, data: sub, message: 'Subscription updated successfully' });
}
