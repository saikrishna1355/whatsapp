"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processedMessageRepository = void 0;
const connection_1 = require("../../database/connection");
exports.processedMessageRepository = {
    async markIfNew(messageId, phoneNumber) {
        try {
            await (0, connection_1.db)('processed_messages').insert({
                message_id: messageId,
                phone_number: phoneNumber,
            });
            return true;
        }
        catch (err) {
            // MySQL duplicate key error
            if (err?.code === 'ER_DUP_ENTRY')
                return false;
            throw err;
        }
    },
};
//# sourceMappingURL=processed-message.repository.js.map