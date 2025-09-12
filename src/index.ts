import 'dotenv/config';
import express from 'express';
import meetingsRouter from './routes/meetings.js';
import { authOptional } from './middleware/auth.js';
import { serveSignedFile } from './services/storage.js';
import manifestRouter from './mcp/manifest.js';

const app = express();
app.use(express.json());

// Basic health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Auth (optional in dev). You can also move auth inside the router if you prefer endpoint-level control.
app.use(authOptional);

// Meetings API
app.use('/', meetingsRouter);

// Signed file delivery for local dev (recordings/transcripts)
// Example signed URL format: /files/recording/<meetingId>?token=...
app.get('/files/:kind/:meetingId', serveSignedFile);

// MCP manifest
app.use('/mcp', manifestRouter);

const port = parseInt(process.env.PORT || '8080', 10);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
