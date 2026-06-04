-- ABC Progress Tracker — Initial Schema
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing tables if re-running
drop table if exists public.tasks cascade;
drop table if exists public.users cascade;
drop table if exists public.departments cascade;

-- Departments
create table public.departments (
  id           uuid primary key default gen_random_uuid(),
  name         text unique not null,
  created_at   timestamptz default now()
);

-- Users (custom auth — Supabase Auth is NOT used)
create table public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  username      text unique not null,
  password_hash text not null,
  role          text not null check (role in ('manager', 'employee')),
  department_id uuid references public.departments(id) on delete set null,
  created_at    timestamptz default now()
);

-- Tasks
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  status       text not null default 'pending'
                 check (status in ('pending', 'in_progress', 'under_review', 'completed', 'blocked')),
  status_note  text,
  priority     text not null default 'medium'
                 check (priority in ('low', 'medium', 'high')),
  due_date     date,
  assignee_id  uuid references public.users(id) on delete set null,
  created_by   uuid not null references public.users(id) on delete restrict,
  department_id uuid not null references public.departments(id) on delete restrict,
  created_at   timestamptz default now()
);

-- Disable RLS (auth enforced in the application layer)
alter table public.departments disable row level security;
alter table public.users disable row level security;
alter table public.tasks disable row level security;

-- Grant anon role full access (required for the Supabase JS client with anon key)
grant select, insert, update, delete on public.departments to anon;
grant select, insert, update, delete on public.users to anon;
grant select, insert, update, delete on public.tasks to anon;

-- Indexes for common query patterns
create index on public.tasks (department_id);
create index on public.tasks (assignee_id);
create index on public.tasks (status);
create index on public.tasks (created_by);
