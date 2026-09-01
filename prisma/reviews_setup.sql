-- Run this once in the Supabase SQL Editor (Supabase dashboard -> SQL Editor
-- -> New query -> paste -> Run). Matches the same shape as your existing
-- `orders` / `reflections` tables (uuid pk, timestamptz created_at).

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null,
  name        text not null,
  email       text not null,
  rating      integer not null check (rating >= 1 and rating <= 5),
  text        text not null,
  is_approved boolean not null default false,
  created_at  timestamptz not null default timezone('utc'::text, now())
);

-- Locks the table down so it's only reachable via your API's service-role
-- key (same pattern as `reflections`) -- no public/anon access to the table
-- directly, moderation is enforced in code via is_approved.
alter table public.reviews enable row level security;

create index if not exists reviews_product_id_idx on public.reviews (product_id, is_approved);
