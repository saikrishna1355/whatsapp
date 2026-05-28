export declare const subscriptionRepository: {
    getByPhone(phoneNumber: string): Promise<any>;
    create(phoneNumber: string, plan: string): Promise<{
        id: number;
        user_id: number;
        plan: string;
        status: string;
    }>;
    getByUserId(userId: number): Promise<any>;
    upsertByUserId(userId: number, payload: {
        plan: "free" | "pro";
        status?: "active" | "expired" | "cancelled";
        expiresAt?: string | null;
    }): Promise<{
        id: any;
    }>;
};
