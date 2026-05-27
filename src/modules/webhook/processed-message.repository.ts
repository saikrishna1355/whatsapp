import { db } from '../../database/connection';

export const processedMessageRepository = {
  async markIfNew(messageId: string, phoneNumber: string): Promise<boolean> {
    try {
      await db('processed_messages').insert({
        message_id: messageId,
        phone_number: phoneNumber,
      });
      return true;
    } catch (err: any) {
      // MySQL duplicate key error
      if (err?.code === 'ER_DUP_ENTRY') return false;
      throw err;
    }
  },
};

