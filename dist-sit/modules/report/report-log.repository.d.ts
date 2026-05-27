export declare const reportLogRepository: {
    insert(userId: number, period: "today" | "week", dateFrom: string, dateTo: string): Promise<void>;
    list(filters: {
        userId?: string;
        period?: string;
        fromDate?: string;
        toDate?: string;
        page: number;
        limit: number;
    }): Promise<{
        logs: any[];
        total: string | number;
        page: number;
        limit: number;
    }>;
};
