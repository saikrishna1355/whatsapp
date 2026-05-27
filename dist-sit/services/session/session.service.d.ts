import type { UserSession } from './session.types';
export declare const sessionService: {
    getOrCreate(phoneNumber: string): Promise<UserSession>;
    update(phoneNumber: string, patch: Partial<Pick<UserSession, "module" | "step" | "context">>): Promise<UserSession>;
    reset(phoneNumber: string): Promise<UserSession>;
};
