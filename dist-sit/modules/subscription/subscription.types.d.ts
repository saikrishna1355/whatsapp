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
export declare const PLAN_FEATURES: Record<string, Feature[]>;
