import { db } from '../../database/connection';

export const userRepository = {
  async getIdByPhone(phoneNumber: string): Promise<number> {
    const user = await db('users').where('phone_number', phoneNumber).select('id').first();
    if (!user) throw new Error(`User not found: ${phoneNumber}`);
    return user.id;
  },

  async ensureExists(phoneNumber: string): Promise<number> {
    await db.raw('INSERT IGNORE INTO users (phone_number) VALUES (?)', [phoneNumber]);
    const user = await db('users').where('phone_number', phoneNumber).select('id').first();
    return user.id;
  },
};
