# Phase 7 Walkthrough – Deployment

This walkthrough describes how to deploy TaskVault using a free-tier friendly setup.

> Note: These steps describe *what you do* in Vercel, Supabase, and your backend host. No paid services are required.

## 1. Prepare GitHub and Supabase

1. Push your local TaskVault repo to GitHub (already done in earlier phases).
2. Ensure your Supabase project is set up with:
   - Auth enabled (email/password).
   - `profiles` and `team_members` tables created.

## 2. Deploy the frontend to Vercel

1. Go to https://vercel.com and create/sign in to your account.
2. Click **New Project** and choose your TaskVault GitHub repo.
3. When asked for project settings:
   - Root directory: `taskvault-frontend`.
   - Framework: **Next.js**.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` – from your Supabase project settings.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – the anon key from Supabase.
   - `NEXT_PUBLIC_API_BASE_URL` – this will later be the URL of your deployed backend (you can start with your local URL for initial tests).
5. Click **Deploy**. After the build completes, note the production URL (e.g. `https://taskvault-frontend.vercel.app`).

## 3. Deploy the backend FastAPI app

Use any free-tier Python hosting provider (Render, Railway, Fly.io, etc.). High-level steps:

1. Create a new web service / app.
2. Point it at your GitHub repo (or a Docker image) and configure the start command:
   - `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
3. Set environment variables on the service:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_ORIGINS` – include your Vercel URL and local dev origin, for example:
     - `https://taskvault-frontend.vercel.app, http://localhost:3000`
4. Deploy and wait for the service to become healthy.
5. Visit `/health` on the backend URL to confirm Supabase connectivity.

## 4. Wire frontend to backend

1. In Vercel, update `NEXT_PUBLIC_API_BASE_URL` to point to your deployed backend URL, for example:
   - `https://taskvault-api.onrender.com`
2. Trigger a redeploy in Vercel or use the **Redeploy** button.
3. Once deployed, open your Vercel URL and exercise:
   - `/auth` → sign up/sign in.
   - `/account` → plan toggles.
   - `/workflows`, `/team`, `/dashboard` → ensure they reach the backend correctly.

## 5. Verify HTTPS and basic security

- Confirm both the frontend (Vercel URL) and backend host URLs start with `https://`.
- Check that CORS works only from allowed frontend origins:
  - If you try to call the backend from an unknown origin, it should be blocked by CORS.
- Verify that no secrets (Supabase keys, service role key) are present in your GitHub repo.

After completing these steps, TaskVault is deployed in a realistic, free-tier environment, ready for the security-focused refinements of Phase 8.
