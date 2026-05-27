export declare const subscriptionRepository: {
    getByPhone(phoneNumber: string): Promise<any>;
    create(phoneNumber: string, plan: string): Promise<{
        id: number;
        user_id: number;
        plan: string;
        status: string;
    }>;
};
