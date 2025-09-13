import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = process.env.DATA_DIR || './data';

export function readSummary(meetingId: string): any | null {
  const file = path.join(DATA_DIR, 'summaries', `${meetingId}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
