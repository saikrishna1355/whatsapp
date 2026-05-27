export interface InboundMessage {
  from: string;
  text: string | null;
  mediaPayload: MediaPayload | null;
  flowPayload: SupportFlowPayload | null;
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

export interface SupportFlowPayload {
  support_type?: string;
  issue_description?: string;
}

export function extractInboundMessage(body: unknown): InboundMessage | null {
  const entry = (body as any)?.entry?.[0];
  const change = entry?.changes?.[0]?.value;
  const message = change?.messages?.[0];

  if (!message) return null;

  const from: string = message.from;
  const text: string | null =
    message.interactive?.button_reply?.id ||
    message.interactive?.list_reply?.id ||
    message.text?.body?.trim() ||
    null;
  const flowPayload: SupportFlowPayload | null = message.interactive?.nfm_reply?.response_json || null;

  let mediaPayload: MediaPayload | null = null;
  for (const type of ['image', 'audio', 'document', 'video'] as const) {
    if (message[type]) {
      mediaPayload = {
        type,
        mediaId: message[type].id,
        mimeType: message[type].mime_type,
        sha256: message[type].sha256,
        caption: message[type].caption,
      };
      break;
    }
  }

  return {
    from,
    text: text || (flowPayload ? 'support_flow_submit' : null),
    mediaPayload,
    flowPayload,
    timestamp: message.timestamp,
    messageId: message.id,
  };
}
