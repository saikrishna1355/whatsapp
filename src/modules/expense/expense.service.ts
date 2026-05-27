import { transactionRepository } from '../transaction/transaction.repository';
import type { ParsedEntry } from '../../utils/parse-entries';

export const expenseService = {
  async addMany(phoneNumber: string, entries: ParsedEntry[]): Promise<void> {
    for (const entry of entries) {
      await transactionRepository.insert(phoneNumber, 'expense', entry.description, entry.amount);
    }
  },
};
