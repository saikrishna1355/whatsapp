"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incomeService = void 0;
const transaction_repository_1 = require("../transaction/transaction.repository");
exports.incomeService = {
    async addMany(phoneNumber, entries) {
        for (const entry of entries) {
            await transaction_repository_1.transactionRepository.insert(phoneNumber, 'income', entry.description, entry.amount);
        }
    },
};
//# sourceMappingURL=income.service.js.map