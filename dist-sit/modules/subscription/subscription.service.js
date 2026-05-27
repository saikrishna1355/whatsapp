"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = void 0;
const config_1 = require("../../config");
const subscription_repository_1 = require("./subscription.repository");
const subscription_types_1 = require("./subscription.types");
exports.subscriptionService = {
    async hasAccess(phoneNumber, feature) {
        if (!config_1.config.subscription.enabled)
            return true;
        const sub = await subscription_repository_1.subscriptionRepository.getByPhone(phoneNumber);
        const plan = sub?.plan || 'free';
        const features = subscription_types_1.PLAN_FEATURES[plan] || subscription_types_1.PLAN_FEATURES.free;
        return features.includes(feature);
    },
};
//# sourceMappingURL=subscription.service.js.map