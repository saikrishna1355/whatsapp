"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feAdminRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../middleware/jwt-auth.middleware");
const fe_admin_controller_1 = require("../controllers/fe-admin.controller");
exports.feAdminRoutes = (0, express_1.Router)();
exports.feAdminRoutes.use(jwt_auth_middleware_1.jwtAuthMiddleware);
exports.feAdminRoutes.get('/users', fe_admin_controller_1.listUsers);
exports.feAdminRoutes.get('/users/:id/transactions', fe_admin_controller_1.getUserTransactions);
exports.feAdminRoutes.get('/users/:id/subscription', fe_admin_controller_1.getUserSubscription);
exports.feAdminRoutes.put('/users/:id/subscription', fe_admin_controller_1.updateUserSubscription);
exports.feAdminRoutes.get('/transactions', fe_admin_controller_1.listTransactions);
exports.feAdminRoutes.get('/flow', fe_admin_controller_1.getFlow);
exports.feAdminRoutes.put('/flow', fe_admin_controller_1.updateFlow);
exports.feAdminRoutes.get('/report-logs', fe_admin_controller_1.listReportLogs);
exports.feAdminRoutes.get('/report-logs/:id/download', fe_admin_controller_1.downloadReport);
exports.feAdminRoutes.post('/reports/generate', fe_admin_controller_1.generateReport);
//# sourceMappingURL=fe-admin.routes.js.map