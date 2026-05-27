import type { MessageHandler } from '../handler.types';
export declare const menuHandler: MessageHandler;
declare function sendMenu(to: string): Promise<void>;
export { sendMenu };
