import { db } from '../../database/connection';
import { today } from '../../utils/date';
import { userRepository } from '../user/user.repository';

export type TransactionType = 'income' | 'expense';

export const transactionRepository = {
  async insert(phoneNumber: string, type: TransactionType, description: string, amount: number, source = 'text') {
    const userId = await userRepository.getIdByPhone(phoneNumber);
    const [insertId] = await db('transactions').insert({
      user_id: userId,
      type,
      description,
      amount,
      source,
      entry_date: today(),
    });
    return { id: insertId, user_id: userId, type, description, amount, source, entry_date: today() };
  },

  async getByPhone(phoneNumber: string, type: TransactionType, startDate: string, endDate: string) {
    const userId = await userRepository.getIdByPhone(phoneNumber);
    return db('transactions')
      .where('user_id', userId)
      .where('type', type)
      .whereBetween('entry_date', [startDate, endDate])
      .orderBy('created_at', 'desc');
  },
};
