export type TicketType = 'feedback' | 'complaint' | 'suggestion' | 'other';
export interface CreateSupportTicketInput {
    phoneNumber: string;
    ticketType: TicketType;
    description: string;
    externalMessageId?: string;
}
export declare const supportTicketRepository: {
    create(input: CreateSupportTicketInput): Promise<{
        id: number;
    }>;
};
