import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const DATA_DIR = process.env.DATA_DIR || './data';

export type JoinCallCommand = {
  meetingId: string;
  meetingLink?: string;
  createdAt: string;
  type: 'JoinCall';
};

export async function enqueueJoinCall(input: { meetingId?: string; meetingLink?: string }): Promise<string> {
  const meetingId = input.meetingId || randomUUID();
  const cmd: JoinCallCommand = {
    type: 'JoinCall',
    meetingId,
    meetingLink: input.meetingLink,
    createdAt: new Date().toISOString(),
  };
  const qfile = path.join(DATA_DIR, 'queue', 'commands.jsonl');
  fs.mkdirSync(path.dirname(qfile), { recursive: true });
  fs.appendFileSync(qfile, JSON.stringify(cmd) + '\n', 'utf8');
  return meetingId;
}
