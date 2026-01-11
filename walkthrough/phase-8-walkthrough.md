# Phase 8 Walkthrough – Security & Best Practices

Phase 8 is mostly about configuration and discipline rather than new UI. This walkthrough helps you verify the key security practices.

## 1. Check env and git hygiene

1. Inspect `.gitignore`:
   - Confirm that `.env`, `.env.*`, `backend/.env`, and `taskvault-frontend/.env.local` are listed.
2. Ensure you have:
   - `backend/.env` present locally but **not** committed.
   - `taskvault-frontend/.env.local` present locally but **not** committed.
3. Open `backend/.env.example` and verify it contains **placeholders**, not real keys.

## 2. Verify CORS and HTTPS

1. Backend CORS:
   - In your backend host, set `FRONTEND_ORIGINS` to your actual frontend URL(s), for example:
     - `https://taskvault-frontend.vercel.app, http://localhost:3000`.
   - Restart the backend.
2. Frontend → Backend calls:
   - From your deployed frontend, exercise `/workflows`, `/team`, and `/dashboard`.
   - From an unrelated origin (e.g. another domain), verify the backend does **not** accept cross-origin requests.
3. Confirm both frontend and backend URLs use `https://` in production.

## 3. Review role and plan behavior

1. Team roles:
   - On `/team`, confirm that only Pro-plan accounts see and can use admin actions (make admin/member, remove).
   - For Free-plan accounts, confirm those actions are hidden or disabled and that the backend still enforces permissions.
2. Plan limits:
   - Try to exceed team size limits for Free and Pro plans and confirm the backend responds with clear errors and the UI surfaces these errors.

## 4. Supabase RLS (outside this repo)

In your Supabase dashboard (recommended, though not enforced by the code here):

1. Enable RLS on `profiles` and `team_members`.
2. Add policies that:
   - Allow each user to access only their own profile row.
   - Allow only authorized users to read/write team members for a given workspace.
3. Test with different users to ensure policies behave as expected.

## 5. Keep committing meaningfully

- Continue using the phase-based commit pattern for any future changes.
- Write commit messages that clearly describe what changed and why.

After these checks, TaskVault has a documented baseline of security and operational best practices suitable for a free-tier, teaching-focused SaaS project.
