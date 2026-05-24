import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: { userId: string; name?: string; email?: string };
  isGuest?: boolean;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  console.log("=== Incoming Request to", req.path, "===");
  console.log("Headers:", req.headers);
  const authHeader = (req.headers.authorization || req.headers['x-veda-auth']) as string;
  
  if (authHeader && authHeader.startsWith('Guest')) {
    req.isGuest = true;
    next();
    return;
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
