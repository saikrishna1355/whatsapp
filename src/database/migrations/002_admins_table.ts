import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('admins', (t) => {
    t.increments('id').primary();
    t.string('username', 50).unique().notNullable();
    t.string('password_hash', 255).notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('admins');
}
