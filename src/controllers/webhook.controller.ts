import { Request, Response } from 'express';
import { config } from '../config';
import { extractInboundMessage } from '../services/whatsapp/whatsapp.types';
import { messageRouter } from '../services/message-router/message-router';
import { resetTestReplies, collectTestReplies } from '../services/whatsapp/whatsapp.client';
import { logger } from '../utils/logger';

export async function verifyWebhook(req: Request, res: Response): Promise<void> {
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;
  const challenge = req.query['hub.challenge'] as string;

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    logger.info('Webhook verified');
    res.status(200).send(challenge);
    return;
  }

  res.sendStatus(403);
}

export async function handleWebhook(req: Request, res: Response): Promise<void> {
  try {
    const message = extractInboundMessage(req.body);

    if (!message || (!message.text && !message.mediaPayload)) {
      res.sendStatus(200);
      return;
    }

    if (config.whatsapp.testMode) {
      // In test mode: process synchronously and return replies in response
      resetTestReplies();
      await messageRouter.route(message);
      const replies = collectTestReplies();

      res.status(200).json({
        ok: true,
        testMode: true,
        from: message.from,
        input: message.text,
        replies,
      });
      return;
    }

    // Production: acknowledge immediately, process async
    res.sendStatus(200);
    await messageRouter.route(message);
  } catch (err) {
    logger.error({ err }, 'Webhook handler error');
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
}
