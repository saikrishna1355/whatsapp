"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const transaction_repository_1 = require("../transaction/transaction.repository");
exports.reportService = {
    async generate(phoneNumber, period, dateFrom, dateTo) {
        const incomes = await transaction_repository_1.transactionRepository.getByPhone(phoneNumber, 'income', dateFrom, dateTo);
        const expenses = await transaction_repository_1.transactionRepository.getByPhone(phoneNumber, 'expense', dateFrom, dateTo);
        const totalIncome = incomes.reduce((sum, r) => sum + Number(r.amount), 0);
        const totalExpense = expenses.reduce((sum, r) => sum + Number(r.amount), 0);
        return {
            period,
            date: dateTo,
            incomes: incomes.map((r) => ({ id: r.id, description: r.description, amount: Number(r.amount), date: r.created_at })),
            expenses: expenses.map((r) => ({ id: r.id, description: r.description, amount: Number(r.amount), date: r.created_at })),
            totalIncome,
            totalExpense,
            profit: totalIncome - totalExpense,
        };
    },
};
//# sourceMappingURL=report.service.js.map