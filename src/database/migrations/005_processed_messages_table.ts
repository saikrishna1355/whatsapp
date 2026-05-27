import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('processed_messages', (t) => {
    t.increments('id').primary();
    t.string('message_id', 128).notNullable().unique();
    t.string('phone_number', 20).notNullable();
    t.timestamp('processed_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('processed_messages');
}

