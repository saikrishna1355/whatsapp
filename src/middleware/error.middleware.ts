import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error({ err }, 'Unhandled error');

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(500).json({
    error: config.isProduction ? 'Internal server error' : err.message,
  });
}
