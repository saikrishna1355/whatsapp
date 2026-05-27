"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhook = verifyWebhook;
exports.handleWebhook = handleWebhook;
const config_1 = require("../config");
const whatsapp_types_1 = require("../services/whatsapp/whatsapp.types");
const message_router_1 = require("../services/message-router/message-router");
const whatsapp_client_1 = require("../services/whatsapp/whatsapp.client");
const logger_1 = require("../utils/logger");
async function verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === config_1.config.whatsapp.verifyToken) {
        logger_1.logger.info('Webhook verified');
        res.status(200).send(challenge);
        return;
    }
    res.sendStatus(403);
}
async function handleWebhook(req, res) {
    try {
        const message = (0, whatsapp_types_1.extractInboundMessage)(req.body);
        if (!message || (!message.text && !message.mediaPayload)) {
            res.sendStatus(200);
            return;
        }
        if (config_1.config.whatsapp.testMode) {
            // In test mode: process synchronously and return replies in response
            (0, whatsapp_client_1.resetTestReplies)();
            await message_router_1.messageRouter.route(message);
            const replies = (0, whatsapp_client_1.collectTestReplies)();
            res.status(200).json({
                ok: true,
                testMode: true,
                from: message.from,
                input: message.text,
                replies,
            });
            return;
        }
        // Production: acknowledge immediately, process async
        res.sendStatus(200);
        await message_router_1.messageRouter.route(message);
    }
    catch (err) {
        logger_1.logger.error({ err }, 'Webhook handler error');
        if (!res.headersSent) {
            res.status(500).json({ ok: false, error: 'Internal server error' });
        }
    }
}
//# sourceMappingURL=webhook.controller.js.map