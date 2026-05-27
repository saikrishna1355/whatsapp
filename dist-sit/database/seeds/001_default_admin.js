"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seed(knex) {
    const exists = await knex('admins').where('username', 'admin').first();
    if (exists)
        return;
    const password_hash = await bcryptjs_1.default.hash('Welcome@123', 10);
    await knex('admins').insert({ username: 'admin', password_hash });
}
//# sourceMappingURL=001_default_admin.js.map