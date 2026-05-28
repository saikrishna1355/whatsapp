import { db } from '../../database/connection';
import { userRepository } from '../user/user.repository';

export const subscriptionRepository = {
  async getByPhone(phoneNumber: string) {
    const userId = await userRepository.getIdByPhone(phoneNumber);
    return db('subscriptions')
      .where('user_id', userId)
      .where('status', 'active')
      .orderBy('id', 'desc')
      .first();
  },

  async create(phoneNumber: string, plan: string) {
    const userId = await userRepository.getIdByPhone(phoneNumber);
    const [insertId] = await db('subscriptions').insert({
      user_id: userId,
      plan,
      status: 'active',
    });
    return { id: insertId, user_id: userId, plan, status: 'active' };
  },

  async getByUserId(userId: number) {
    return db('subscriptions')
      .where('user_id', userId)
      .orderBy('id', 'desc')
      .first();
  },

  async upsertByUserId(userId: number, payload: { plan: 'free' | 'pro'; status?: 'active' | 'expired' | 'cancelled'; expiresAt?: string | null }) {
    const existing = await db('subscriptions')
      .where('user_id', userId)
      .orderBy('id', 'desc')
      .first();

    const status = payload.status || 'active';

    if (existing) {
      await db('subscriptions').where('id', existing.id).update({
        plan: payload.plan,
        status,
        expires_at: payload.expiresAt ?? null,
      });
      return { id: existing.id };
    }

    const [id] = await db('subscriptions').insert({
      user_id: userId,
      plan: payload.plan,
      status,
      expires_at: payload.expiresAt ?? null,
    });
    return { id };
  },
};
