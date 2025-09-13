import fs from 'node:fs';
import path from 'node:path';
import type { Request, Response } from 'express';
import { signDownloadToken, verifyDownloadToken } from '../utils/signer.js';

const DATA_DIR = process.env.DATA_DIR || './data';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

export function localFilePath(kind: 'recording'|'transcript', meetingId: string): string {
  const folder = kind === 'recording' ? 'recordings' : 'transcripts';
  const basename = kind === 'recording' ? `${meetingId}.mp4` : (fs.existsSync(path.join(DATA_DIR, folder, `${meetingId}.json`)) ? `${meetingId}.json` : `${meetingId}.vtt`);
  return path.join(DATA_DIR, folder, basename);
}

export function generateSignedUrl(kind: 'recording'|'transcript', meetingId: string, ttlSec?: number): string {
  const token = signDownloadToken({ kind, meetingId }, ttlSec);
  return `${BASE_URL}/files/${kind}/${encodeURIComponent(meetingId)}?token=${encodeURIComponent(token)}`;
}

// Express handler to serve signed files in dev
export function serveSignedFile(req: Request, res: Response) {
  try {
    const { token } = req.query as { token?: string };
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const payload = verifyDownloadToken(token);
    const { kind, meetingId } = payload;

    // Sanity: path must match route
    if (req.params.kind !== kind || req.params.meetingId !== meetingId) {
      return res.status(400).json({ error: 'Token/route mismatch' });
    }

    const file = localFilePath(kind, meetingId);
    if (!fs.existsSync(file)) return res.status(404).json({ error: 'File not found' });

    res.sendFile(path.resolve(file));
  } catch (e: any) {
    return res.status(401).json({ error: 'Invalid/expired token', details: e?.message });
  }
}
