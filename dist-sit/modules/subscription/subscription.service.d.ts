import { type Feature } from './subscription.types';
export declare const subscriptionService: {
    hasAccess(phoneNumber: string, feature: Feature): Promise<boolean>;
};
