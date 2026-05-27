import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { startInactivityReminderWorker } from './services/session/inactivity-reminder.service';

app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, 'WAU Backend started');
  startInactivityReminderWorker();
});
