import type { ReportData } from './report.types';
export declare const reportService: {
    generate(phoneNumber: string, period: "today" | "week", dateFrom: string, dateTo: string): Promise<ReportData>;
};
