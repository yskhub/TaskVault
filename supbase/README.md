# Supabase Test Scripts for TaskVault

This folder contains concrete Supabase test scenarios you can run to validate the whole TaskVault project (backend + frontend).

## What you must configure first

1. Supabase project details
   - **Project URL** → use as `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`.
   - **anon public key** → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **service_role key** → use as `SUPABASE_SERVICE_ROLE_KEY` (backend only).

2. Backend env file (backend/.env)

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
FRONTEND_ORIGINS=http://localhost:3000
```

3. Frontend env file (taskvault-frontend/.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Tables in Supabase

Run the schema scripts from this folder (in order):
- `supbase/01_schema.sql` – core tables (profiles, team_members)
- `supbase/03_schema_advanced.sql` – onboarding flag, usage_events, audit_logs, rate_limits

Optional sample data for tests:
- `supbase/02_seed_basic.sql`

Then follow the scenario guides:
- `supbase/test_auth_and_profiles.md`
- `supbase/test_team_limits.md`
- `supbase/test_dashboard_analytics.md`
