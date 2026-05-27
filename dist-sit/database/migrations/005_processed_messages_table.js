"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('processed_messages', (t) => {
        t.increments('id').primary();
        t.string('message_id', 128).notNullable().unique();
        t.string('phone_number', 20).notNullable();
        t.timestamp('processed_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('processed_messages');
}
//# sourceMappingURL=005_processed_messages_table.js.map