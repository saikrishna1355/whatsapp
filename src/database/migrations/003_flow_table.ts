import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('flow', (t) => {
    t.increments('id').primary();
    t.string('key', 100).unique().notNullable();
    t.json('data').notNullable();
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('flow');
}
