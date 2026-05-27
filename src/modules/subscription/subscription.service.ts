import { config } from '../../config';
import { subscriptionRepository } from './subscription.repository';
import { PLAN_FEATURES, type Feature } from './subscription.types';

export const subscriptionService = {
  async hasAccess(phoneNumber: string, feature: Feature): Promise<boolean> {
    if (!config.subscription.enabled) return true;

    const sub = await subscriptionRepository.getByPhone(phoneNumber);
    const plan = sub?.plan || 'free';
    const features = PLAN_FEATURES[plan] || PLAN_FEATURES.free;

    return features.includes(feature);
  },
};
