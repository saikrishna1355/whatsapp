import { db } from '../database/connection';
import { userRepository } from '../modules/user/user.repository';

export async function audit(phone: string, action: string, module: string, payload?: unknown): Promise<void> {
  const userId = await userRepository.getIdByPhone(phone);
  await db('audit_log').insert({
    user_id: userId,
    action,
    module,
    payload: payload ? JSON.stringify(payload) : null,
  });
}
