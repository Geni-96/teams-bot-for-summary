# AI-Powered Autonomous Meeting Bot for Microsoft Teams

An Express + TypeScript service that will join Microsoft Teams meetings, capture audio, transcribe with Whisper, generate AI summaries (OpenAI/Gemini), and expose REST + MCP tools for AI workflows.

Status: scaffolded. Core endpoints and media integration are planned but not implemented yet. Use this README to set up the environment and understand the design/roadmap.

## Features
- REST API to control meetings and fetch outputs (planned):
  - POST /join — join by Teams meeting link
  - GET /status/:meetingId — lifecycle and progress
  - GET /recording/:meetingId — signed URL to audio artifact
  - GET /transcript/:meetingId — transcript as JSON/SRT
  - GET /summary/:meetingId — AI-generated insights
- MCP tools for AI agents (planned):
  - join_meeting(link)
  - get_transcript(meeting_id)
  - get_recording(meeting_id)
  - get_summary(meeting_id)
- Local storage for development; cloud storage in production.
- JWT-based API auth (optional in dev).

## Architecture (at a glance)
- API and Orchestration: Node.js, Express, TypeScript
- Auth: JWT (for API); Azure AD app for Teams/Graph (later)
- Media: Teams real-time media bot or ACS interop (later)
- Transcription: Whisper (local or API) (later)
- Summaries: OpenAI/Gemini (later)
- Storage: Local `data/` folder in dev; Azure Blob/S3 in prod (later)

## Repository layout
- `src/`
  - `index.ts` — app bootstrap and routing
  - `routes/` — REST endpoints (scaffolded)
  - `services/` — storage, queue, summaries (stubs)
  - `middleware/` — auth middleware (JWT)
  - `mcp/` — MCP manifest and tool wiring (stub)
  - `utils/` — helpers (e.g., URL signer) (stub)
- `data/` — local dev artifacts
  - `recordings/`
  - `transcripts/`
  - `summaries/`
  - `queue/`
- `.env.example` — environment variable template

## Prerequisites
- Node.js 20+
- npm (project uses npm lockfile)
- macOS/Linux/Windows

For Teams/Graph integration (later):
- Microsoft 365 developer tenant with Teams admin rights
- Azure subscription for App Registration, Storage, Key Vault, etc.

## Quick start (local dev)
1) Copy environment file and create local data folders (done if you already ran these):

```bash
cp .env.example .env
mkdir -p data/recordings data/transcripts data/summaries data/queue
```

2) Install dependencies:

```bash
npm install
```

3) Run in dev mode (TypeScript live reload):

```bash
npm run dev
```

4) Health check:
- GET http://localhost:8080/health → `{ ok: true }`

Note: Many routes are not implemented yet; builds may fail until stubs are completed. See Roadmap.

## Environment variables
Defined in `.env.example`:
- `PORT` — API port (default 8080)
- `JWT_SECRET` — secret for signing/verifying API JWTs
- `AUTH_REQUIRED` — "true" to enforce JWT on endpoints, else optional
- `BASE_URL` — external base URL (used in signed URL generation)
- `DATA_DIR` — base folder for local artifacts (default `./data`)
- `SIGNED_URL_TTL_SEC` — signed link validity window (seconds)

Additional variables for media/AI providers will be added in future phases (Azure, OpenAI/Gemini, Whisper, etc.).

## API overview
Implemented now:
- `GET /health` — basic liveness

Planned (not implemented yet):
- `POST /join` `{ meetingLink, options }`
- `GET /status/:meetingId`
- `GET /recording/:meetingId`
- `GET /transcript/:meetingId`
- `GET /summary/:meetingId`

Signed file delivery (local dev):
- `GET /files/:kind/:meetingId?token=...` → serves signed links for recordings/transcripts. Note: requires storage/signing services to be implemented.

Auth:
- If `AUTH_REQUIRED=true`, send `Authorization: Bearer <token>`. Use JWT signed with `JWT_SECRET`.

## MCP tools (planned)
Expose REST functionality as MCP tools so assistants can call:
- `join_meeting(link)`
- `get_transcript(meeting_id)`
- `get_recording(meeting_id)`
- `get_summary(meeting_id)`

The MCP manifest will be served under `/mcp` once implemented.

## Storage layout (dev)
- `recordings/{meetingId}/{timestamp}.wav` (or `.mp3`)
- `transcripts/{meetingId}/index.json`, `index.srt`
- `summaries/{meetingId}.json`

In production, prefer Azure Blob/S3 with lifecycle policies and private access; the API will mint short-lived signed URLs.

## Security & compliance notes
- Do not store secrets in source control; use `.env` for dev and a secret manager in prod (Azure Key Vault/AWS SSM).
- Enforce JWT on public endpoints (`AUTH_REQUIRED=true`) in shared environments.
- For Teams media/recording, ensure tenant policies and compliance announcements are followed.
- Implement PII redaction and data retention policies before production use.

## Roadmap
- Phase 1: App registration, basic `/join` plumbing and health.
- Phase 2: Media capture pipeline (Teams media bot or ACS interop), `/recording`.
- Phase 3: Transcription (Whisper), `/transcript`.
- Phase 4: AI summaries (OpenAI/Gemini), `/summary`.
- Phase 5: MCP tools, auth hardening, deployment and observability.

## Scripts
- `npm run dev` — start with ts-node-dev
- `npm run build` — type-check and compile to `dist/`
- `npm run start` — run compiled JS from `dist/`

## Troubleshooting
- TypeScript import errors from services/routes: stubs are not yet implemented; fill them or temporarily comment imports in `src/index.ts` for smoke tests.
- 401 Unauthorized: set `AUTH_REQUIRED=false` in `.env` for local testing without JWT.
- Signed URL handler 404: storage/signing services are not implemented yet; see `src/services/storage.ts` and `src/utils/signer.ts`.

## License
ISC (see `package.json`).
