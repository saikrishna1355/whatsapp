import type { Button, ListSection } from './whatsapp.types';
export interface TestReply {
    type: 'text' | 'buttons' | 'list' | 'document';
    to: string;
    body?: string;
    buttons?: Button[];
    sections?: ListSection[];
    filename?: string;
    size?: number;
}
export declare function collectTestReplies(): TestReply[];
export declare function resetTestReplies(): void;
export declare const whatsappClient: {
    indicateTyping(messageId: string): Promise<void>;
    sendText(to: string, body: string): Promise<void>;
    sendButtons(to: string, body: string, buttons: Button[]): Promise<void>;
    sendList(to: string, body: string, buttonText: string, sections: ListSection[]): Promise<void>;
    sendDocument(to: string, pdfBuffer: Buffer, filename: string): Promise<void>;
    getMediaUrl(mediaId: string): Promise<{
        url: string;
        mime_type: string;
    }>;
    downloadMedia(url: string): Promise<Buffer>;
};
