"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const inactivity_reminder_service_1 = require("./services/session/inactivity-reminder.service");
app_1.app.listen(config_1.config.port, () => {
    logger_1.logger.info({ port: config_1.config.port, env: config_1.config.nodeEnv }, 'WAU Backend started');
    (0, inactivity_reminder_service_1.startInactivityReminderWorker)();
});
//# sourceMappingURL=server.js.map