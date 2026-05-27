"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
app_1.app.listen(config_1.config.port, () => {
    logger_1.logger.info({ port: config_1.config.port, env: config_1.config.nodeEnv }, 'WAU Backend started');
});
//# sourceMappingURL=server.js.map