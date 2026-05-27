export interface Subscription {
  id: number;
  userId: number;
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'expired' | 'cancelled';
  startedAt: Date;
  expiresAt: Date | null;
  paymentRef: string | null;
}

export type Feature = 'income' | 'expense' | 'report' | 'ai_analysis' | 'pdf_export';

export const PLAN_FEATURES: Record<string, Feature[]> = {
  free: ['income', 'expense'],
  pro: ['income', 'expense', 'report', 'pdf_export'],
  business: ['income', 'expense', 'report', 'pdf_export', 'ai_analysis'],
};
