"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const transaction_repository_1 = require("./transaction.repository");
exports.transactionService = {
    async addMany(phoneNumber, type, entries) {
        for (const entry of entries) {
            await transaction_repository_1.transactionRepository.insert(phoneNumber, type, entry.description, entry.amount);
        }
    },
};
//# sourceMappingURL=transaction.service.js.map