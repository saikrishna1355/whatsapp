"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
const config_1 = require("../config");
exports.db = (0, knex_1.default)({
    client: 'mysql2',
    connection: {
        host: config_1.config.db.host,
        port: config_1.config.db.port,
        user: config_1.config.db.user,
        password: config_1.config.db.password,
        database: config_1.config.db.name,
        charset: 'utf8mb4',
    },
    pool: { min: 2, max: 10 },
});
//# sourceMappingURL=connection.js.map