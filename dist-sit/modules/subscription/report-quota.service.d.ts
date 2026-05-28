export type PlanType = 'free' | 'pro';
export declare const PLAN_REPORT_LIMIT: Record<PlanType, number>;
export declare const reportQuotaService: {
    getEffectivePlan(userId: number): Promise<PlanType>;
    getTodayReportUsage(userId: number): Promise<number>;
    canGenerateReport(userId: number): Promise<{
        allowed: boolean;
        used: number;
        limit: number;
        plan: PlanType;
    }>;
};
