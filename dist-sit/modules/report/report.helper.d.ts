export interface GeneratedReport {
    buffer: Buffer;
    filename: string;
}
export declare function buildReport(phoneNumber: string, userId: number, period: 'today' | 'week', dateFrom: string, dateTo: string): Promise<GeneratedReport>;
