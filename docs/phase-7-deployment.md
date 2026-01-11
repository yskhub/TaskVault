# Phase 7: Deployment

This phase focuses on getting TaskVault ready for a real (but still free-tier) deployment: Vercel for the frontend and a hosted FastAPI backend using Supabase as the database.

## 1. Frontend deployment (Vercel)

### Prerequisites
- GitHub repository already created and pushed (done in earlier phases).
- Vercel account (free tier).

### Steps
1. **Connect GitHub repo**
   - Go to https://vercel.com and create/sign in to your account.
   - Click **"New Project" → "Import Git Repository"**.
   - Select the TaskVault GitHub repo.

2. **Configure project settings**
   - Framework preset: **Next.js**.
   - Root directory: `taskvault-frontend`.

3. **Environment variables**
   In the Vercel project settings, add the following environment variables (use the same values as your local `.env.local`):

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_BASE_URL` → URL of your deployed FastAPI backend (e.g. `https://api.taskvault.example.com`).

4. **Deploy**
   - Click **Deploy**.
   - On success, Vercel will give you a production URL like `https://taskvault-frontend.vercel.app`.

## 2. Backend deployment (FastAPI + Supabase)

TaskVault uses FastAPI as an API layer with Supabase as the database/auth provider. For the backend, choose any free-tier Python hosting provider (e.g. Render, Railway, Fly.io) that can run `uvicorn`:

### Example deployment shape

- **Dockerfile** (conceptual): runs `uvicorn backend.main:app --host 0.0.0.0 --port 8000`.
- **Health endpoint**: `/health` verifies Supabase connectivity.

### Environment variables (backend)

On your backend host, configure:

- `SUPABASE_URL` – your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` – service role key (keep this secret, **never** expose in frontend).
- `FRONTEND_ORIGINS` – comma-separated list of allowed frontend origins for CORS, for example:
  - `https://taskvault-frontend.vercel.app, http://localhost:3000`

These map directly to the FastAPI app in `backend/main.py`:

- CORS is configured using `FRONTEND_ORIGINS` (defaults to localhost during development).
- Supabase PostgREST is used for team member storage, and the service role key is used only on the backend.

## 3. Supabase configuration recap

Supabase is already used for:

- Auth (email/password).
- `profiles` table with `subscription_plan`.
- `team_members` table for team storage.

For production:

- Ensure RLS policies are configured appropriately on all tables (see Phase 8).
- Rotate keys via the Supabase dashboard if needed, and update them in Vercel and your backend host.

## 4. Security notes for deployment

- **HTTPS**: both Vercel and typical Python hosts provide HTTPS by default on their domains.
- **CORS**: restricted to known frontend origins via `FRONTEND_ORIGINS`.
- **Secrets**: stored only in environment variables on Vercel, the backend host, and Supabase – never committed to Git.

## 5. What you actually deploy

- Frontend: statically generated Next.js app with routes `/`, `/auth`, `/account`, `/workflows`, `/team`, `/dashboard`.
- Backend: FastAPI app exposing `/health`, `/workflows`, `/team`, `/analytics/overview`.
- Database: Supabase (Auth + `profiles` + `team_members`).

This completes Phase 7 at a documentation and configuration level, ready for you to perform an actual free-tier deployment.
