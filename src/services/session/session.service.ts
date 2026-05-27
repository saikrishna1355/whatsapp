import { db } from '../../database/connection';
import { userRepository } from '../../modules/user/user.repository';
import type { UserSession } from './session.types';

const SESSION_TIMEOUT_MINUTES = 30;

export const sessionService = {
  async getOrCreate(phoneNumber: string): Promise<UserSession> {
    const userId = await userRepository.ensureExists(phoneNumber);
    const row = await db('sessions').where('user_id', userId).first();

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

    await db('sessions').insert({
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

  async update(phoneNumber: string, patch: Partial<Pick<UserSession, 'module' | 'step' | 'context'>>): Promise<UserSession> {
    const userId = await userRepository.getIdByPhone(phoneNumber);
    const updateData: Record<string, unknown> = { updated_at: new Date() };
    if (patch.module !== undefined) updateData.module = patch.module;
    if (patch.step !== undefined) updateData.step = patch.step;
    if (patch.context !== undefined) updateData.context = JSON.stringify(patch.context);

    await db('sessions').where('user_id', userId).update(updateData);

    return this.getOrCreate(phoneNumber);
  },

  async reset(phoneNumber: string): Promise<UserSession> {
    return this.update(phoneNumber, { module: 'menu', step: 'main', context: {} });
  },
};
