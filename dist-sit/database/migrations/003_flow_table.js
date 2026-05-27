"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('flow', (t) => {
        t.increments('id').primary();
        t.string('key', 100).unique().notNullable();
        t.json('data').notNullable();
        t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('flow');
}
//# sourceMappingURL=003_flow_table.js.map