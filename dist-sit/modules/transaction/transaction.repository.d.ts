export type TransactionType = 'income' | 'expense';
export declare const transactionRepository: {
    insert(phoneNumber: string, type: TransactionType, description: string, amount: number, source?: string): Promise<{
        id: number;
        user_id: number;
        type: TransactionType;
        description: string;
        amount: number;
        source: string;
        entry_date: string;
    }>;
    getByPhone(phoneNumber: string, type: TransactionType, startDate: string, endDate: string): Promise<any[]>;
};
