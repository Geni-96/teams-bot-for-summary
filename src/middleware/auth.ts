import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const AUTH_REQUIRED = (process.env.AUTH_REQUIRED || 'true').toLowerCase() === 'true';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).auth = payload;
    next();
  } catch (e: any) {
    return res.status(401).json({ error: 'Invalid token', details: e?.message });
  }
}

export function authOptional(req: Request, res: Response, next: NextFunction) {
  if (!AUTH_REQUIRED) return next();
  return authRequired(req, res, next);
}
