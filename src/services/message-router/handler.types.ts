import type { InboundMessage } from '../whatsapp/whatsapp.types';
import type { UserSession } from '../session/session.types';

export interface MessageHandler {
  handle(message: InboundMessage, session: UserSession): Promise<void>;
}
