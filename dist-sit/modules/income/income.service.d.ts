import type { ParsedEntry } from '../../utils/parse-entries';
export declare const incomeService: {
    addMany(phoneNumber: string, entries: ParsedEntry[]): Promise<void>;
};
