import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean);
}
export declare function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void;
