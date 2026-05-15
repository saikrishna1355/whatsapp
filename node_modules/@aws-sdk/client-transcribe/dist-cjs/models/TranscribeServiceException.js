"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscribeServiceException = exports.__ServiceException = void 0;
const client_1 = require("@smithy/core/client");
Object.defineProperty(exports, "__ServiceException", { enumerable: true, get: function () { return client_1.ServiceException; } });
class TranscribeServiceException extends client_1.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, TranscribeServiceException.prototype);
    }
}
exports.TranscribeServiceException = TranscribeServiceException;
