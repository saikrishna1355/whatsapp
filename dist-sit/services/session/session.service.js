"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const connection_1 = require("../../database/connection");
const user_repository_1 = require("../../modules/user/user.repository");
const SESSION_TIMEOUT_MINUTES = 30;
exports.sessionService = {
    async getOrCreate(phoneNumber) {
        const userId = await user_repository_1.userRepository.ensureExists(phoneNumber);
        const row = await (0, connection_1.db)('sessions').where('user_id', userId).first();
        if (row) {
            const updatedAt = new Date(row.updated_at);
            const elapsed = (Date.now() - updatedAt.getTime()) / 1000 / 60;
            if (elapsed > SESSION_TIMEOUT_MINUTES) {
                return this.reset(phoneNumber);
            }
            return {
                phoneNumber,
                module: row.module,
                step: row.step,
                context: row.context || {},
                updatedAt,
            };
        }
        await (0, connection_1.db)('sessions').insert({
            user_id: userId,
            module: 'menu',
            step: 'main',
            context: JSON.stringify({}),
            updated_at: new Date(),
        });
        return {
            phoneNumber,
            module: 'menu',
            step: 'main',
            context: {},
            updatedAt: new Date(),
        };
    },
    async update(phoneNumber, patch) {
        const userId = await user_repository_1.userRepository.getIdByPhone(phoneNumber);
        const updateData = { updated_at: new Date() };
        if (patch.module !== undefined)
            updateData.module = patch.module;
        if (patch.step !== undefined)
            updateData.step = patch.step;
        if (patch.context !== undefined)
            updateData.context = JSON.stringify(patch.context);
        await (0, connection_1.db)('sessions').where('user_id', userId).update(updateData);
        return this.getOrCreate(phoneNumber);
    },
    async reset(phoneNumber) {
        return this.update(phoneNumber, { module: 'menu', step: 'main', context: {} });
    },
};
//# sourceMappingURL=session.service.js.map