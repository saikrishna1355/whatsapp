"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuthMiddleware = jwtAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'wau-jwt-secret-2025';
function jwtAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ code: 401, message: 'Unauthorized' });
        return;
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ code: 401, message: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=jwt-auth.middleware.js.map