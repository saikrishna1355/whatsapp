import { Router } from 'express';
import { verifyWebhook, handleWebhook } from '../controllers/webhook.controller';

export const webhookRoutes = Router();

webhookRoutes.get('/', verifyWebhook);
webhookRoutes.post('/', handleWebhook);
