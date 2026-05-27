export interface InboundMessage {
    from: string;
    text: string | null;
    mediaPayload: MediaPayload | null;
    timestamp: string;
    messageId: string;
}
export interface MediaPayload {
    type: 'image' | 'audio' | 'document' | 'video';
    mediaId: string;
    mimeType?: string;
    sha256?: string;
    caption?: string;
}
export interface Button {
    id: string;
    title: string;
}
export interface ListRow {
    id: string;
    title: string;
    description?: string;
}
export interface ListSection {
    title: string;
    rows: ListRow[];
}
export declare function extractInboundMessage(body: unknown): InboundMessage | null;
