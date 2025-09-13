import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const TTL = parseInt(process.env.SIGNED_URL_TTL_SEC || '600', 10);

export function signDownloadToken(payload: { kind: 'recording'|'transcript'; meetingId: string }, ttlSec = TTL): string {
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: ttlSec });
}

export function verifyDownloadToken(token: string): { kind: 'recording'|'transcript'; meetingId: string; iat: number; exp: number } {
  return jwt.verify(token, JWT_SECRET) as any;
}
