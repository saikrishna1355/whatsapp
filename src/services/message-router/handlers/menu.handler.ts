import type { MessageHandler } from '../handler.types';
import type { InboundMessage } from '../../whatsapp/whatsapp.types';
import type { UserSession } from '../../session/session.types';
import { whatsappClient } from '../../whatsapp/whatsapp.client';
import { sessionService } from '../../session/session.service';
import { db } from '../../../database/connection';

async function getFlowData() {
  const row = await db('flow').where('key', 'conversation_flow').first();
  if (!row) return null;
  return typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
}

export const menuHandler: MessageHandler = {
  async handle(message: InboundMessage, session: UserSession): Promise<void> {
    const { from, text } = message;
    const normalized = text?.toLowerCase() || '';

    const flow = await getFlowData();
    if (!flow || !flow.conversation?.length) {
      await whatsappClient.sendText(from, 'Service is currently unavailable. Please try again later.');
      return;
    }

    const mainConversation = flow.conversation[0];
    const menuOptions = (mainConversation.answers || [])
      .filter((a: any) => a.active)
      .map((a: any) => ({ id: a.clickId || a.key, title: a.text }));

    const menuBody = `${mainConversation.question}\n\n${mainConversation.dummy || ''}`;

    // Greeting or fresh session → show menu
    if (!text || normalized === 'hi' || normalized === 'hello' || normalized === 'menu') {
      await whatsappClient.sendButtons(from, menuBody, menuOptions);
      return;
    }

    // Route to selected module
    const selectedAnswer = (mainConversation.answers || []).find(
      (a: any) => a.active && (a.clickId === normalized || a.key === normalized || a.text?.toLowerCase().includes(normalized))
    );

    if (selectedAnswer) {
      const moduleId = selectedAnswer.clickId || selectedAnswer.key;
      await sessionService.update(from, { module: moduleId, step: 'await_input' });

      const followUp = selectedAnswer.followUp?.[0];
      if (followUp) {
        const followUpAnswers = followUp.answers || [];
        const hasButtons = followUpAnswers.some((a: any) => a.input === 'button');

        if (hasButtons) {
          const buttons = followUpAnswers
            .filter((a: any) => a.active)
            .map((a: any) => ({ id: a.clickId || a.key, title: a.text }));
          await whatsappClient.sendButtons(from, followUp.question || 'Choose an option:', buttons);
        } else {
          const prompt = followUp.question + (followUp.dummy ? `\n\n${followUp.dummy}` : '');
          await whatsappClient.sendText(from, prompt);
        }
      }
      return;
    }

    // Invalid selection
    await whatsappClient.sendText(from, "I didn't understand that. Let me show you the menu.");
    await whatsappClient.sendButtons(from, menuBody, menuOptions);
  },
};

async function sendMenu(to: string): Promise<void> {
  const flow = await getFlowData();
  if (!flow || !flow.conversation?.length) {
    await whatsappClient.sendText(to, 'Welcome! Service is being set up.');
    return;
  }

  const mainConversation = flow.conversation[0];
  const menuOptions = (mainConversation.answers || [])
    .filter((a: any) => a.active)
    .map((a: any) => ({ id: a.clickId || a.key, title: a.text }));

  const menuBody = `${mainConversation.question}\n\n${mainConversation.dummy || ''}`;
  await whatsappClient.sendButtons(to, menuBody, menuOptions);
}

export { sendMenu };
