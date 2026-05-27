"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = require("../database/connection");
const JWT_SECRET = process.env.JWT_SECRET || 'wau-jwt-secret-2025';
async function login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ code: 400, message: 'Username and password required' });
        return;
    }
    const admin = await (0, connection_1.db)('admins').where('username', username).first();
    if (!admin) {
        res.status(401).json({ code: 401, message: 'Invalid credentials' });
        return;
    }
    const valid = await bcryptjs_1.default.compare(password, admin.password_hash);
    if (!valid) {
        res.status(401).json({ code: 401, message: 'Invalid credentials' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
        code: 200,
        data: {
            response: {
                token,
                username: admin.username,
                userId: admin.id,
            },
        },
    });
}
async function verifyToken(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ code: 401, message: 'No token provided' });
        return;
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({ code: 200, data: { response: true } });
    }
    catch {
        res.status(401).json({ code: 401, message: 'Invalid token' });
    }
}
//# sourceMappingURL=auth.controller.js.map