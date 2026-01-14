-- Advanced schema for TaskVault Supabase features
-- This script adds tables/columns used by:
-- - Onboarding & guided tour flags
-- - Usage analytics events
-- - Audit logging
-- - Basic rate limiting

-- 1) Onboarding flag on profiles
alter table if exists profiles
  add column if not exists has_seen_tour boolean not null default false;

-- 2) Usage analytics events
create table if not exists usage_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_usage_events_event_type_created_at
  on usage_events (event_type, created_at desc);

-- 3) Audit logs for important actions (team changes, workflows, etc.)
create table if not exists audit_logs (
  id bigserial primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_role text,
  action text not null,
  target text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created_at
  on audit_logs (created_at desc);

-- 4) Basic rate limiting windows
create table if not exists rate_limits (
  id bigserial primary key,
  identifier text not null,
  endpoint text not null,
  window_start timestamptz not null,
  request_count integer not null default 0
);

create index if not exists idx_rate_limits_identifier_endpoint_window
  on rate_limits (identifier, endpoint, window_start desc);
