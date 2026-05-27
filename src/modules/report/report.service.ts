import { transactionRepository } from '../transaction/transaction.repository';
import type { ReportData } from './report.types';

export const reportService = {
  async generate(phoneNumber: string, period: 'today' | 'week', dateFrom: string, dateTo: string): Promise<ReportData> {
    const incomes = await transactionRepository.getByPhone(phoneNumber, 'income', dateFrom, dateTo);
    const expenses = await transactionRepository.getByPhone(phoneNumber, 'expense', dateFrom, dateTo);

    const totalIncome = incomes.reduce((sum: number, r: any) => sum + Number(r.amount), 0);
    const totalExpense = expenses.reduce((sum: number, r: any) => sum + Number(r.amount), 0);

    return {
      period,
      date: dateTo,
      incomes: incomes.map((r: any) => ({ id: r.id, description: r.description, amount: Number(r.amount), date: r.created_at })),
      expenses: expenses.map((r: any) => ({ id: r.id, description: r.description, amount: Number(r.amount), date: r.created_at })),
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
    };
  },
};
