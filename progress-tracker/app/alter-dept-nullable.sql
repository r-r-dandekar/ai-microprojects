-- Run this if you already applied migration.sql and need to patch the schema.
-- Makes department_id nullable on users so managers can sign up without a department.

alter table public.users
  alter column department_id drop not null;

alter table public.users
  drop constraint if exists users_department_id_fkey,
  add constraint users_department_id_fkey
    foreign key (department_id)
    references public.departments(id)
    on delete set null;
