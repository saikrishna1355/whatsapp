"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportTicketRepository = void 0;
const connection_1 = require("../../database/connection");
const user_repository_1 = require("../user/user.repository");
exports.supportTicketRepository = {
    async create(input) {
        const userId = await user_repository_1.userRepository.ensureExists(input.phoneNumber);
        const [id] = await (0, connection_1.db)('support_tickets').insert({
            user_id: userId,
            phone_number: input.phoneNumber,
            ticket_type: input.ticketType,
            description: input.description,
            external_message_id: input.externalMessageId || null,
            status: 'open',
            source: 'whatsapp_flow',
        });
        return { id };
    },
};
//# sourceMappingURL=support-ticket.repository.js.map