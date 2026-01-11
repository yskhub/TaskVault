# Phase 8: Security & Best Practices

Phase 8 focuses on documenting and tightening security-related practices around TaskVault, while still staying within a free-tier-friendly setup.

## 1. Environment variables & secrets

- All secrets (Supabase keys, service role key, API URLs) are provided via environment variables only.
- Example configuration is documented in:
  - `backend/.env.example` – now uses **placeholder** values for `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  - `taskvault-frontend/.env.local.example` – documents `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_API_BASE_URL`.
- `.gitignore` ensures local `.env` files are not committed:
  - `.env`, `.env.*`, `backend/.env`, `taskvault-frontend/.env.local` are ignored.

## 2. HTTPS and CORS

- HTTPS is provided by the hosting platforms (e.g. Vercel for frontend, Render/Railway/Fly.io for backend).
- The FastAPI backend in `backend/main.py` now:
  - Reads `FRONTEND_ORIGINS` from the environment (comma-separated list of allowed origins).
  - Falls back to localhost origins in development.
  - Uses these values in the CORS middleware, reducing the risk of cross-origin abuse in production.

## 3. Role-based access patterns

While TaskVault does not implement full multi-tenant RBAC, it uses role and plan concepts consistently:

- **Team roles**:
  - `admin` vs `member` are enforced at the API level for team operations:
    - Only `admin`-role calls can change roles or remove members (via `actor_role=admin`).
- **Plans**:
  - `free` vs `pro` plans are stored in the Supabase `profiles` table.
  - Backend enforces team-size limits based on plan (Free: 2, Pro: 10).
  - Frontend gates certain actions (e.g. role changes, removals) to Pro plan accounts.

> In a production system, these roles and plans would be derived from authenticated user claims or JWTs, not query parameters. Phase 8 documents this and keeps the prototype simple.

## 4. Input validation and error handling

- FastAPI models (Pydantic) validate request payloads for:
  - Workflows and steps (`title`, `assigned_to`, `status`).
  - Team member operations (`email`, `role`, `plan`).
- Team endpoints perform additional checks:
  - Duplicate email detection on add.
  - Plan-based limit checks with clear error messages and appropriate HTTP status codes.
- Supabase/PostgREST interactions:
  - Errors and connectivity problems are wrapped in structured `HTTPException` responses.

## 5. Supabase RLS (Row Level Security)

RLS is a Supabase-side feature, not implemented in this repo, but Phase 8 documents how you would use it:

- Enable RLS on tables such as `profiles` and `team_members`.
- Create policies that:
  - Allow users to read/write only their own profile rows.
  - Restrict `team_members` access based on workspace ownership or membership.
- Since this project uses the service role key from the backend for simplicity, RLS policies are not strictly enforced by the code, but should be configured in any real deployment.

## 6. Git & documentation hygiene

- Phase-wise commits and tags (`phase-1` through `phase-7`) provide a clear history of changes.
- Each phase has:
  - A design/spec under `Development_Phases/`.
  - An implementation doc under `docs/`.
  - A walkthrough under `walkthrough/`.
- Phase 8 adds this security-focused documentation to clarify how to operate TaskVault safely.
