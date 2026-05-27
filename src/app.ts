import express from 'express';
import cors from 'cors';
import { webhookRoutes } from './routes/webhook.routes';
import { authRoutes } from './routes/auth.routes';
import { feAdminRoutes } from './routes/fe-admin.routes';
import { config } from './config';
import { errorMiddleware } from './middleware/error.middleware';
import { requestLogger } from './middleware/request-logger.middleware';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'WAU Business Assistant' });
});

app.use('/webhook', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fe', feAdminRoutes);

app.use(errorMiddleware);

export { app };
