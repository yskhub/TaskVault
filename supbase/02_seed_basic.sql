-- Basic seed data for TaskVault tests.
-- Run this after 01_schema.sql, or insert via the Supabase UI.

-- 1) Example team members
insert into team_members (email, role) values
  ('owner@example.com', 'admin')
  on conflict (email) do nothing;

insert into team_members (email, role) values
  ('teammate1@example.com', 'member'),
  ('teammate2@example.com', 'member')
  on conflict (email) do nothing;

-- 2) Example profile rows (if you want to pre-create instead of via UI)
-- Replace UUIDs with real auth.users IDs once you have users.
-- insert into profiles (id, email, subscription_plan)
-- values
--   ('00000000-0000-0000-0000-000000000001', 'owner@example.com', 'pro');
