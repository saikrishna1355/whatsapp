"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRepository = void 0;
const connection_1 = require("../../database/connection");
const user_repository_1 = require("../user/user.repository");
exports.subscriptionRepository = {
    async getByPhone(phoneNumber) {
        const userId = await user_repository_1.userRepository.getIdByPhone(phoneNumber);
        return (0, connection_1.db)('subscriptions')
            .where('user_id', userId)
            .where('status', 'active')
            .orderBy('id', 'desc')
            .first();
    },
    async create(phoneNumber, plan) {
        const userId = await user_repository_1.userRepository.getIdByPhone(phoneNumber);
        const [insertId] = await (0, connection_1.db)('subscriptions').insert({
            user_id: userId,
            plan,
            status: 'active',
        });
        return { id: insertId, user_id: userId, plan, status: 'active' };
    },
    async getByUserId(userId) {
        return (0, connection_1.db)('subscriptions')
            .where('user_id', userId)
            .orderBy('id', 'desc')
            .first();
    },
    async upsertByUserId(userId, payload) {
        const existing = await (0, connection_1.db)('subscriptions')
            .where('user_id', userId)
            .orderBy('id', 'desc')
            .first();
        const status = payload.status || 'active';
        if (existing) {
            await (0, connection_1.db)('subscriptions').where('id', existing.id).update({
                plan: payload.plan,
                status,
                expires_at: payload.expiresAt ?? null,
            });
            return { id: existing.id };
        }
        const [id] = await (0, connection_1.db)('subscriptions').insert({
            user_id: userId,
            plan: payload.plan,
            status,
            expires_at: payload.expiresAt ?? null,
        });
        return { id };
    },
};
//# sourceMappingURL=subscription.repository.js.map