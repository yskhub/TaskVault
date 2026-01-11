-- Schema for TaskVault Supabase tests

-- Profiles table used by the frontend /account page
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  subscription_plan text not null default 'free'
);

-- Team members table used by backend team endpoints and dashboard
create table if not exists team_members (
  id bigserial primary key,
  email text not null unique,
  role text not null default 'member'
);
