import { db } from '../../database/connection';
import { logger } from '../../utils/logger';
import { whatsappClient } from '../whatsapp/whatsapp.client';
import { sessionService } from './session.service';

const INACTIVITY_MINUTES = 3;
const CHECK_INTERVAL_MS = 60 * 1000;
const INACTIVE_TEXT = 'Inactive detected. Please send hi to start again.';

let timer: NodeJS.Timeout | null = null;

interface StaleSessionRow {
  phone_number: string;
  module: string;
  step: string;
  updated_at: Date;
}

async function processStaleSessions(): Promise<void> {
  const cutoff = new Date(Date.now() - INACTIVITY_MINUTES * 60 * 1000);

  const rows: StaleSessionRow[] = await db('sessions')
    .join('users', 'users.id', 'sessions.user_id')
    .select(
      'users.phone_number as phone_number',
      'sessions.module as module',
      'sessions.step as step',
      'sessions.updated_at as updated_at',
    )
    .where('sessions.updated_at', '<', cutoff)
    .where((q) => q.whereNot('sessions.module', 'menu').orWhereNot('sessions.step', 'main'))
    .limit(100);

  for (const row of rows) {
    try {
      await whatsappClient.sendText(row.phone_number, INACTIVE_TEXT);
      await sessionService.reset(row.phone_number);
      logger.info({ phone: row.phone_number, module: row.module, step: row.step }, 'Inactive session reminded and reset');
    } catch (err) {
      logger.error({ err, phone: row.phone_number }, 'Failed to send inactivity reminder');
    }
  }
}

export function startInactivityReminderWorker(): void {
  if (timer) return;

  timer = setInterval(() => {
    processStaleSessions().catch((err) => {
      logger.error({ err }, 'Inactivity reminder worker tick failed');
    });
  }, CHECK_INTERVAL_MS);

  logger.info({ inactivityMinutes: INACTIVITY_MINUTES, checkIntervalMs: CHECK_INTERVAL_MS }, 'Inactivity reminder worker started');
}

