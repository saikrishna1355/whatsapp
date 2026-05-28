import { db } from '../../database/connection';
import { subscriptionRepository } from './subscription.repository';

export type PlanType = 'free' | 'pro';

function nowInIST(): Date {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffsetMs + now.getTimezoneOffset() * 60 * 1000);
}

function istDateString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const PLAN_REPORT_LIMIT: Record<PlanType, number> = {
  free: 2,
  pro: 5,
};

export const reportQuotaService = {
  async getEffectivePlan(userId: number): Promise<PlanType> {
    const sub = await subscriptionRepository.getByUserId(userId);
    if (!sub) return 'free';

    const plan = sub.plan === 'pro' ? 'pro' : 'free';
    const status = sub.status || 'active';
    if (status !== 'active') return 'free';

    if (sub.expires_at) {
      const now = nowInIST();
      const exp = new Date(sub.expires_at);
      if (exp.getTime() < now.getTime()) return 'free';
    }

    return plan;
  },

  async getTodayReportUsage(userId: number): Promise<number> {
    const istNow = nowInIST();
    const date = istDateString(istNow);
    const startUtc = new Date(`${date}T00:00:00+05:30`).toISOString().slice(0, 19).replace('T', ' ');
    const endUtc = new Date(`${date}T23:59:59+05:30`).toISOString().slice(0, 19).replace('T', ' ');

    const row = await db('report_logs')
      .where('user_id', userId)
      .whereBetween('generated_at', [startUtc, endUtc])
      .count<{ total: number }[]>('id as total')
      .first();

    return Number(row?.total || 0);
  },

  async canGenerateReport(userId: number): Promise<{ allowed: boolean; used: number; limit: number; plan: PlanType }> {
    const plan = await this.getEffectivePlan(userId);
    const limit = PLAN_REPORT_LIMIT[plan];
    const used = await this.getTodayReportUsage(userId);

    return {
      allowed: used < limit,
      used,
      limit,
      plan,
    };
  },
};
