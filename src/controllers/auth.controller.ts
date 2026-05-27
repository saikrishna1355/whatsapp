import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'wau-jwt-secret-2025';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ code: 400, message: 'Username and password required' });
    return;
  }

  const admin = await db('admins').where('username', username).first();
  if (!admin) {
    res.status(401).json({ code: 401, message: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    res.status(401).json({ code: 401, message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    code: 200,
    data: {
      response: {
        token,
        username: admin.username,
        userId: admin.id,
      },
    },
  });
}

export async function verifyToken(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ code: 401, message: 'No token provided' });
    return;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET);
    res.json({ code: 200, data: { response: true } });
  } catch {
    res.status(401).json({ code: 401, message: 'Invalid token' });
  }
}
