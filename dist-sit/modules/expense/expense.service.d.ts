import type { ParsedEntry } from '../../utils/parse-entries';
export declare const expenseService: {
    addMany(phoneNumber: string, entries: ParsedEntry[]): Promise<void>;
};
