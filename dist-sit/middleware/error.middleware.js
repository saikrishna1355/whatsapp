"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorMiddleware = errorMiddleware;
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
function errorMiddleware(err, _req, res, _next) {
    logger_1.logger.error({ err }, 'Unhandled error');
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    res.status(500).json({
        error: config_1.config.isProduction ? 'Internal server error' : err.message,
    });
}
//# sourceMappingURL=error.middleware.js.map