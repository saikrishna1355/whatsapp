"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post('/login', auth_controller_1.login);
exports.authRoutes.get('/verify', auth_controller_1.verifyToken);
//# sourceMappingURL=auth.routes.js.map