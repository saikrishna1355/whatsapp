"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('report_logs', (t) => {
        t.increments('id').primary();
        t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        t.enum('period', ['today', 'week']).notNullable();
        t.date('date_from').notNullable();
        t.date('date_to').notNullable();
        t.timestamp('generated_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('report_logs');
}
//# sourceMappingURL=004_report_logs_table.js.map