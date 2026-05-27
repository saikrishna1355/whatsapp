import { Router } from 'express';
import { login, verifyToken } from '../controllers/auth.controller';

export const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.get('/verify', verifyToken);
