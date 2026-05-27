import { db } from '../../database/connection';

export const reportLogRepository = {
  async insert(userId: number, period: 'today' | 'week', dateFrom: string, dateTo: string) {
    await db('report_logs').insert({ user_id: userId, period, date_from: dateFrom, date_to: dateTo });
  },

  async list(filters: { userId?: string; period?: string; fromDate?: string; toDate?: string; page: number; limit: number }) {
    const { userId, period, fromDate, toDate, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = db('report_logs').join('users', 'users.id', 'report_logs.user_id');
    let countQuery = db('report_logs');

    if (userId) {
      query = query.where('report_logs.user_id', userId);
      countQuery = countQuery.where('user_id', userId);
    }
    if (period) {
      query = query.where('report_logs.period', period);
      countQuery = countQuery.where('period', period);
    }
    if (fromDate) {
      query = query.where('report_logs.generated_at', '>=', fromDate);
      countQuery = countQuery.where('generated_at', '>=', fromDate);
    }
    if (toDate) {
      query = query.where('report_logs.generated_at', '<=', `${toDate} 23:59:59`);
      countQuery = countQuery.where('generated_at', '<=', `${toDate} 23:59:59`);
    }

    const [logs, [{ total }]] = await Promise.all([
      query.select(
        'report_logs.id', 'report_logs.user_id', 'report_logs.period',
        'report_logs.date_from', 'report_logs.date_to', 'report_logs.generated_at',
        'users.phone_number', 'users.name'
      ).orderBy('report_logs.generated_at', 'desc').limit(limit).offset(offset),
      countQuery.count('id as total'),
    ]);

    return { logs, total, page, limit };
  },
};
