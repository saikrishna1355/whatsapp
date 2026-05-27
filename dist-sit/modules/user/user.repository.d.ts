export declare const userRepository: {
    getIdByPhone(phoneNumber: string): Promise<number>;
    ensureExists(phoneNumber: string): Promise<number>;
};
