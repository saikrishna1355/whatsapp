"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRepository = void 0;
const connection_1 = require("../../database/connection");
const date_1 = require("../../utils/date");
const user_repository_1 = require("../user/user.repository");
exports.transactionRepository = {
    async insert(phoneNumber, type, description, amount, source = 'text') {
        const userId = await user_repository_1.userRepository.getIdByPhone(phoneNumber);
        const [insertId] = await (0, connection_1.db)('transactions').insert({
            user_id: userId,
            type,
            description,
            amount,
            source,
            entry_date: (0, date_1.today)(),
        });
        return { id: insertId, user_id: userId, type, description, amount, source, entry_date: (0, date_1.today)() };
    },
    async getByPhone(phoneNumber, type, startDate, endDate) {
        const userId = await user_repository_1.userRepository.getIdByPhone(phoneNumber);
        return (0, connection_1.db)('transactions')
            .where('user_id', userId)
            .where('type', type)
            .whereBetween('entry_date', [startDate, endDate])
            .orderBy('created_at', 'desc');
    },
};
//# sourceMappingURL=transaction.repository.js.map