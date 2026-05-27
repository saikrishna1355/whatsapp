import { db } from '../../database/connection';
import { userRepository } from '../user/user.repository';

export const subscriptionRepository = {
  async getByPhone(phoneNumber: string) {
    const userId = await userRepository.getIdByPhone(phoneNumber);
    return db('subscriptions')
      .where('user_id', userId)
      .where('status', 'active')
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
};
