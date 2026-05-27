import { Request, Response } from 'express';
export declare function verifyWebhook(req: Request, res: Response): Promise<void>;
export declare function handleWebhook(req: Request, res: Response): Promise<void>;
