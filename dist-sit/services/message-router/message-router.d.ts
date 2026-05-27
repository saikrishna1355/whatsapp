import type { InboundMessage } from '../whatsapp/whatsapp.types';
export declare const messageRouter: {
    route(message: InboundMessage): Promise<void>;
};
