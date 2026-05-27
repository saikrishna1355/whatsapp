import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  const exists = await knex('admins').where('username', 'admin').first();
  if (exists) return;

  const password_hash = await bcrypt.hash('Welcome@123', 10);
  await knex('admins').insert({ username: 'admin', password_hash });
}
