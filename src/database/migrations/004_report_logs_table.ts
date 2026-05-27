import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('report_logs', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.enum('period', ['today', 'week']).notNullable();
    t.date('date_from').notNullable();
    t.date('date_to').notNullable();
    t.timestamp('generated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('report_logs');
}
