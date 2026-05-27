import { TransactionType } from './transaction.repository';
import type { ParsedEntry } from '../../utils/parse-entries';
export declare const transactionService: {
    addMany(phoneNumber: string, type: TransactionType, entries: ParsedEntry[]): Promise<void>;
};
