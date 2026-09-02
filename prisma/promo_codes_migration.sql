-- Run this in Supabase → SQL Editor, same as the previous migrations.

create table if not exists public.promo_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  type        text not null,
  value       double precision not null default 0,
  active      boolean not null default true,
  max_uses    integer,
  uses_count  integer not null default 0,
  expires_at  timestamptz,
  created_at  timestamptz not null default timezone('utc'::text, now())
);

alter table public.orders
  add column if not exists promo_code text;
