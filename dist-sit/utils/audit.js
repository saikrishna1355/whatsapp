"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = audit;
const connection_1 = require("../database/connection");
const user_repository_1 = require("../modules/user/user.repository");
async function audit(phone, action, module, payload) {
    const userId = await user_repository_1.userRepository.getIdByPhone(phone);
    await (0, connection_1.db)('audit_log').insert({
        user_id: userId,
        action,
        module,
        payload: payload ? JSON.stringify(payload) : null,
    });
}
//# sourceMappingURL=audit.js.map