"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startInactivityReminderWorker = startInactivityReminderWorker;
const connection_1 = require("../../database/connection");
const logger_1 = require("../../utils/logger");
const whatsapp_client_1 = require("../whatsapp/whatsapp.client");
const session_service_1 = require("./session.service");
const INACTIVITY_MINUTES = 3;
const CHECK_INTERVAL_MS = 60 * 1000;
const INACTIVE_TEXT = 'Inactive detected. Please send hi to start again.';
let timer = null;
async function processStaleSessions() {
    const cutoff = new Date(Date.now() - INACTIVITY_MINUTES * 60 * 1000);
    const rows = await (0, connection_1.db)('sessions')
        .join('users', 'users.id', 'sessions.user_id')
        .select('users.phone_number as phone_number', 'sessions.module as module', 'sessions.step as step', 'sessions.updated_at as updated_at')
        .where('sessions.updated_at', '<', cutoff)
        .where((q) => q.whereNot('sessions.module', 'menu').orWhereNot('sessions.step', 'main'))
        .limit(100);
    for (const row of rows) {
        try {
            await whatsapp_client_1.whatsappClient.sendText(row.phone_number, INACTIVE_TEXT);
            await session_service_1.sessionService.reset(row.phone_number);
            logger_1.logger.info({ phone: row.phone_number, module: row.module, step: row.step }, 'Inactive session reminded and reset');
        }
        catch (err) {
            logger_1.logger.error({ err, phone: row.phone_number }, 'Failed to send inactivity reminder');
        }
    }
}
function startInactivityReminderWorker() {
    if (timer)
        return;
    timer = setInterval(() => {
        processStaleSessions().catch((err) => {
            logger_1.logger.error({ err }, 'Inactivity reminder worker tick failed');
        });
    }, CHECK_INTERVAL_MS);
    logger_1.logger.info({ inactivityMinutes: INACTIVITY_MINUTES, checkIntervalMs: CHECK_INTERVAL_MS }, 'Inactivity reminder worker started');
}
//# sourceMappingURL=inactivity-reminder.service.js.map