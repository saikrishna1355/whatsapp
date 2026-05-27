"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_1 = require("../utils/logger");
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        logger_1.logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            ms: Date.now() - start,
        }, 'request');
    });
    next();
}
//# sourceMappingURL=request-logger.middleware.js.map