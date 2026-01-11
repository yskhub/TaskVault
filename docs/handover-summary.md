# TaskVault – Phase 1–8 Handover Summary

## Project Overview
- **Stack:** Next.js App Router (TypeScript) + Tailwind, FastAPI, Supabase (Auth + Postgres).
- **Goal:** Free-tier, secure-by-design workflow & team management SaaS built in 8 phases.
- **Key routes:** `/auth`, `/account`, `/workflows`, `/team`, `/dashboard`.

## Phases & Tags
- `phase-1` – Foundation: FastAPI backend, Next.js frontend, Supabase health wiring.
- `phase-2` – Auth & profiles: Supabase Auth, `profiles.subscription_plan`, `/auth`, `/account`.
- `phase-3` – Workflows: in-memory `workflows` API + `/workflows` UI.
- `phase-4` – Team: team endpoints + `/team` UI.
- `phase-4-supabase` – Team persistence moved to Supabase `team_members` table.
- `phase-5` – Dashboard: `/analytics/overview` + `/dashboard` charts.
- `phase-6` – Optional features: mock plan upgrade/downgrade, usage limit alerts, enhanced dashboard.
- `phase-7` – Deployment: docs + CORS via `FRONTEND_ORIGINS`.
- `phase-8` – Security: env/example hardening, security & RLS guidance.

## How to Run Locally
- **Backend**
  - Create `backend/.env` from `backend/.env.example`.
  - From repo root: `python -m uvicorn backend.main:app --reload`.
- **Frontend**
  - Create `taskvault-frontend/.env.local` with:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
  - From `taskvault-frontend`: `npm run dev`.

## Quick Feature Checklist
- Auth & Account
  - `/auth`: email/password sign-up/sign-in via Supabase.
  - `/account`: shows email + plan; mock upgrade/downgrade Free/Pro updates `profiles.subscription_plan`.
- Workflows
  - `/workflows`: create workflows with steps; list reflects in-memory backend.
- Team
  - `/team`: list/add members from Supabase `team_members`.
  - Limits: Free 2 members, Pro 10; UI banners when near/at limit; backend enforces caps and role-based actions.
- Dashboard
  - `/dashboard`: metrics (workflow counts, step breakdown, team counts, completion rate) + Chart.js charts.
  - "Refresh analytics" re-fetches `/analytics/overview`.

## Deployment Shape (Free Tier)
- **Frontend (Vercel):**
  - Root: `taskvault-frontend`.
  - Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL` → backend URL.
- **Backend (Python host like Render/Railway):**
  - Command: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`.
  - Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_ORIGINS`.
- **Supabase:**
  - Auth enabled; `profiles` + `team_members` tables created.

## Security & Best Practices
- Real secrets live only in env vars; `.env` files are git-ignored.
- `backend/.env.example` uses placeholders (no sensitive data) and documents `FRONTEND_ORIGINS`.
- CORS restricted to known frontend origins in production via `FRONTEND_ORIGINS`.
- Roles/plans used consistently in backend and frontend (admin vs member, free vs pro).
- Supabase RLS recommended on `profiles` and `team_members` (documented in Phase 8) for real deployments.

## Documentation & Git
- Phase specs: `Development_Phases/phaseN_*.md`.
- Implementation docs: `docs/phase-N-*.md` for N=1–8.
- Walkthroughs: `walkthrough/phase-N-walkthrough.md` for N=1–8.
- Git usage and phase commit/tag commands: `git-operations/phase-commits.md`.

The repo on `main` with tags `phase-1` through `phase-8` represents a complete, validated implementation of all phases.