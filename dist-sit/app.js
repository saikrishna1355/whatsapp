"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const webhook_routes_1 = require("./routes/webhook.routes");
const auth_routes_1 = require("./routes/auth.routes");
const fe_admin_routes_1 = require("./routes/fe-admin.routes");
const error_middleware_1 = require("./middleware/error.middleware");
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(request_logger_middleware_1.requestLogger);
app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'WAU Business Assistant' });
});
app.use('/webhook', webhook_routes_1.webhookRoutes);
app.use('/api/auth', auth_routes_1.authRoutes);
app.use('/api/fe', fe_admin_routes_1.feAdminRoutes);
app.use(error_middleware_1.errorMiddleware);
//# sourceMappingURL=app.js.map