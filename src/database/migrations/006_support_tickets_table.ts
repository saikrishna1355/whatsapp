import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('support_tickets', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    t.string('phone_number', 20).notNullable();
    t.enum('ticket_type', ['feedback', 'complaint', 'suggestion', 'other']).notNullable().defaultTo('other');
    t.string('category', 50).nullable();
    t.enum('priority', ['low', 'medium', 'high']).notNullable().defaultTo('medium');
    t.string('title', 255).nullable();
    t.text('description').notNullable();
    t.enum('status', ['open', 'in_progress', 'resolved', 'closed']).notNullable().defaultTo('open');
    t.string('source', 20).notNullable().defaultTo('whatsapp_flow');
    t.string('external_message_id', 128).nullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('support_tickets');
}

