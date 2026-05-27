import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('phone_number', 20).unique().notNullable();
    t.string('name', 100);
    t.string('business_type', 50).defaultTo('farm');
    t.boolean('consent_given').defaultTo(false);
    t.timestamp('consent_date').nullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('sessions', (t) => {
    t.integer('user_id').unsigned().primary().references('id').inTable('users').onDelete('CASCADE');
    t.string('module', 50).notNullable().defaultTo('menu');
    t.string('step', 100).notNullable().defaultTo('main');
    t.json('context');
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('transactions', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.enum('type', ['income', 'expense']).notNullable();
    t.text('description').notNullable();
    t.decimal('amount', 12, 2).notNullable();
    t.string('category', 50);
    t.string('source', 20).defaultTo('text');
    t.date('entry_date').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('media_captures', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('media_type', 20).notNullable();
    t.string('media_id', 100);
    t.text('file_path');
    t.string('mime_type', 50);
    t.string('module', 50);
    t.string('analysis_status', 20).defaultTo('pending');
    t.json('analysis_result');
    t.text('analysis_error');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('subscriptions', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('plan', 30).notNullable().defaultTo('free');
    t.string('status', 20).defaultTo('active');
    t.timestamp('started_at').defaultTo(knex.fn.now());
    t.timestamp('expires_at').nullable();
    t.string('payment_ref', 100);
  });

  await knex.schema.createTable('audit_log', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('action', 100).notNullable();
    t.string('module', 50);
    t.json('payload');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_log');
  await knex.schema.dropTableIfExists('subscriptions');
  await knex.schema.dropTableIfExists('media_captures');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('users');
}
