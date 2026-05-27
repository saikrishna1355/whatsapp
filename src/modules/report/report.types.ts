export interface ReportData {
  period: 'today' | 'week';
  date: string;
  incomes: ReportEntry[];
  expenses: ReportEntry[];
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export interface ReportEntry {
  id: number;
  description: string;
  amount: number;
  date: string | Date;
}
