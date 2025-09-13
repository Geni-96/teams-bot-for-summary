import { Router } from 'express';

const router = Router();

/**
 * Simple MCP manifest (served to agents)
 * You can also write these to disk as JSON files under ./mcp/tools/*.json
 */
const manifest = {
  name: "meeting-bot",
  version: "0.1.0",
  tools: [
    {
      name: "join_meeting",
      description: "Queue a request for the bot to join a meeting by link or meetingId",
      input_schema: {
        type: "object",
        oneOf: [
          { properties: { meetingLink: { type: "string", format: "uri" } }, required: ["meetingLink"] },
          { properties: { meetingId: { type: "string", minLength: 3 } }, required: ["meetingId"] }
        ],
        additionalProperties: false
      },
      rest: { method: "POST", path: "/join" }
    },
    {
      name: "get_recording",
      description: "Get a signed URL for the meeting recording (if available)",
      input_schema: {
        type: "object",
        properties: { meetingId: { type: "string" } },
        required: ["meetingId"],
        additionalProperties: false
      },
      rest: { method: "GET", path: "/recording/{meetingId}" }
    },
    {
      name: "get_transcript",
      description: "Get a signed URL for the meeting transcript (.vtt or .json) if available",
      input_schema: {
        type: "object",
        properties: { meetingId: { type: "string" } },
        required: ["meetingId"],
        additionalProperties: false
      },
      rest: { method: "GET", path: "/transcript/{meetingId}" }
    },
    {
      name: "get_summary",
      description: "Get the summarized meeting JSON (highlights, action items, etc.)",
      input_schema: {
        type: "object",
        properties: { meetingId: { type: "string" } },
        required: ["meetingId"],
        additionalProperties: false
      },
      rest: { method: "GET", path: "/summary/{meetingId}" }
    }
  ]
};

router.get('/manifest', (_req, res) => res.json(manifest));

export default router;
