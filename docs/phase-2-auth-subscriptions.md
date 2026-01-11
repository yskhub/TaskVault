# Phase 2: Authentication & Subscription System (Mock)

## Purpose
Establish user identity and plan-based access control using Supabase Auth and a mock subscription model.

## Features
- User signup / login with Supabase Auth (email/password).
- Users table (profiles) with `subscription_plan`.
- Free vs Pro plans (mock only, no real billing).
- Feature gating in the frontend based on plan.
- Backend endpoints prepared for mock subscription logic.

## Technical Implementation (Planned)
- Configure Supabase Auth (email/password) in the Supabase dashboard.
- Create `profiles` table in Supabase with at least:
  - `id uuid` (matches `auth.users.id`, primary key).
  - `subscription_plan text` (e.g. `free`, `pro`).
  - Timestamps (`created_at`, `updated_at`).
- Enable RLS on `profiles` and add policies so users can only read/update their own row.
- Frontend:
  - Add Supabase JS client and auth utilities.
  - Implement signup / login UI.
  - Implement a simple account page showing current plan.
  - Guard selected routes/components based on `subscription_plan` (free vs pro).
- Backend (FastAPI):
  - Add a minimal `/subscription` endpoint to return/accept mock plan info.
  - This will be wired to Supabase data in later phases.

### Supabase SQL (Profiles + RLS)

Run the following in the Supabase SQL editor.

**1. Profiles table**

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  subscription_plan text not null default 'free', -- 'free' | 'pro'
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  enable row level security;
```

**2. Basic RLS policies**

```sql
-- Allow each user to select their own profile
create policy "Users can view own profile" on public.profiles
  for select
  using (auth.uid() = id);

-- Allow each user to insert their own profile row
create policy "Users can insert own profile" on public.profiles
  for insert
  with check (auth.uid() = id);

-- Allow each user to update only their own profile
create policy "Users can update own profile" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

**3. Trigger to keep email in sync (optional but recommended)**

```sql
create or replace function public.sync_profile_email()
returns trigger as $$
begin
  update public.profiles
  set email = new.email,
      updated_at = timezone('utc', now())
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_updated on auth.users;

create trigger on_auth_user_updated
  after update on auth.users
  for each row
  execute procedure public.sync_profile_email();
```

This schema gives each authenticated user exactly one `profiles` row with a `subscription_plan` that can be used for mock Free vs Pro gating in the frontend and, later, in backend endpoints.

## Dependencies
- Builds directly on Phase 1 foundation:
  - Next.js app and design system.
  - FastAPI backend and health checks.
  - Supabase project and environment configuration.

## Notes
- All subscription behavior in this phase is **mock only**.
- No billing or payment provider integration is allowed.
- Security remains important: RLS must ensure users only see/update their own subscription data.

## Detailed Walkthrough

For a step-by-step log of what was actually implemented in this phase, issues encountered, and how they were fixed, see:

- [walkthrough/phase-2-walkthrough.md](../walkthrough/phase-2-walkthrough.md)
