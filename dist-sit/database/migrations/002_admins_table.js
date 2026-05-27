"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('admins', (t) => {
        t.increments('id').primary();
        t.string('username', 50).unique().notNullable();
        t.string('password_hash', 255).notNullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('admins');
}
//# sourceMappingURL=002_admins_table.js.map