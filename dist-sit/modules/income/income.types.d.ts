export interface IncomeRecord {
    id: number;
    userId: number;
    description: string;
    amount: number;
    category?: string;
    source: string;
    entryDate: string;
    createdAt: Date;
}
