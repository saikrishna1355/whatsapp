import { db } from '../../database/connection';
import { userRepository } from '../user/user.repository';

export type TicketType = 'feedback' | 'complaint' | 'suggestion' | 'other';

export interface CreateSupportTicketInput {
  phoneNumber: string;
  ticketType: TicketType;
  description: string;
  externalMessageId?: string;
}

export const supportTicketRepository = {
  async create(input: CreateSupportTicketInput): Promise<{ id: number }> {
    const userId = await userRepository.ensureExists(input.phoneNumber);
    const [id] = await db('support_tickets').insert({
      user_id: userId,
      phone_number: input.phoneNumber,
      ticket_type: input.ticketType,
      description: input.description,
      external_message_id: input.externalMessageId || null,
      status: 'open',
      source: 'whatsapp_flow',
    });
    return { id };
  },
};

