"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRoutes = void 0;
const express_1 = require("express");
const webhook_controller_1 = require("../controllers/webhook.controller");
exports.webhookRoutes = (0, express_1.Router)();
exports.webhookRoutes.get('/', webhook_controller_1.verifyWebhook);
exports.webhookRoutes.post('/', webhook_controller_1.handleWebhook);
//# sourceMappingURL=webhook.routes.js.map