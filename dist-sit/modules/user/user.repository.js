"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const connection_1 = require("../../database/connection");
exports.userRepository = {
    async getIdByPhone(phoneNumber) {
        const user = await (0, connection_1.db)('users').where('phone_number', phoneNumber).select('id').first();
        if (!user)
            throw new Error(`User not found: ${phoneNumber}`);
        return user.id;
    },
    async ensureExists(phoneNumber) {
        await connection_1.db.raw('INSERT IGNORE INTO users (phone_number) VALUES (?)', [phoneNumber]);
        const user = await (0, connection_1.db)('users').where('phone_number', phoneNumber).select('id').first();
        return user.id;
    },
};
//# sourceMappingURL=user.repository.js.map