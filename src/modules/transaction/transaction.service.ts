import { transactionRepository, TransactionType } from './transaction.repository';
import type { ParsedEntry } from '../../utils/parse-entries';

export const transactionService = {
  async addMany(phoneNumber: string, type: TransactionType, entries: ParsedEntry[]): Promise<void> {
    for (const entry of entries) {
      await transactionRepository.insert(phoneNumber, type, entry.description, entry.amount);
    }
  },
};
