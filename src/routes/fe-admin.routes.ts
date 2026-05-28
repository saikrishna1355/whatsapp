import { Router } from 'express';
import { jwtAuthMiddleware } from '../middleware/jwt-auth.middleware';
import {
  listUsers,
  getUserTransactions,
  listTransactions,
  getFlow,
  updateFlow,
  listReportLogs,
  downloadReport,
  generateReport,
  getUserSubscription,
  updateUserSubscription,
  chatSimulate,
} from '../controllers/fe-admin.controller';

export const feAdminRoutes = Router();

feAdminRoutes.use(jwtAuthMiddleware);

feAdminRoutes.get('/users', listUsers);
feAdminRoutes.get('/users/:id/transactions', getUserTransactions);
feAdminRoutes.get('/users/:id/subscription', getUserSubscription);
feAdminRoutes.put('/users/:id/subscription', updateUserSubscription);
feAdminRoutes.get('/transactions', listTransactions);
feAdminRoutes.get('/flow', getFlow);
feAdminRoutes.put('/flow', updateFlow);
feAdminRoutes.get('/report-logs', listReportLogs);
feAdminRoutes.get('/report-logs/:id/download', downloadReport);
feAdminRoutes.post('/reports/generate', generateReport);
feAdminRoutes.post('/chat-simulate', chatSimulate);
