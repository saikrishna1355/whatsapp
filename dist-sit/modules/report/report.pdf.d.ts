import type { ReportData } from './report.types';
export declare function generateReportPDF(data: ReportData, dateFrom: string, dateTo: string): Promise<Buffer>;
