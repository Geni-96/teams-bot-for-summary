import { Router } from 'express';
import { z } from 'zod';
import { enqueueJoinCall } from '../services/queue.js';
import { generateSignedUrl, localFilePath } from '../services/storage.js';
import fs from 'node:fs';
import { readSummary } from '../services/summary.js';

const router = Router();

const joinBody = z.object({
  meetingLink: z.string().url().optional(),
  meetingId: z.string().min(3).optional(),
}).refine(d => d.meetingLink || d.meetingId, { message: 'Provide meetingLink or meetingId' });

router.post('/join', async (req, res) => {
  const parsed = joinBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const meetingId = await enqueueJoinCall(parsed.data);
  // In prod: you’d also persist request → status = queued
  return res.json({ meetingId, status: 'queued' });
});

router.get('/recording/:meetingId', (req, res) => {
  const { meetingId } = req.params;
  const exists = fs.existsSync(localFilePath('recording', meetingId));
  if (!exists) return res.status(404).json({ error: 'Recording not found' });

  const url = generateSignedUrl('recording', meetingId);
  return res.json({ meetingId, url, expiresInSec: parseInt(process.env.SIGNED_URL_TTL_SEC || '600', 10) });
});

router.get('/transcript/:meetingId', (req, res) => {
  const { meetingId } = req.params;
  const exists = fs.existsSync(localFilePath('transcript', meetingId));
  if (!exists) return res.status(404).json({ error: 'Transcript not found' });

  const url = generateSignedUrl('transcript', meetingId);
  return res.json({ meetingId, url, formatHint: 'vtt-or-json', expiresInSec: parseInt(process.env.SIGNED_URL_TTL_SEC || '600', 10) });
});

router.get('/summary/:meetingId', (req, res) => {
  const { meetingId } = req.params;
  const summary = readSummary(meetingId);
  if (!summary) return res.status(404).json({ error: 'Summary not found' });
  return res.json({ meetingId, summary });
});

export default router;
