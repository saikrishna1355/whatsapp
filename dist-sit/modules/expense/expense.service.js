"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseService = void 0;
const transaction_repository_1 = require("../transaction/transaction.repository");
exports.expenseService = {
    async addMany(phoneNumber, entries) {
        for (const entry of entries) {
            await transaction_repository_1.transactionRepository.insert(phoneNumber, 'expense', entry.description, entry.amount);
        }
    },
};
//# sourceMappingURL=expense.service.js.map