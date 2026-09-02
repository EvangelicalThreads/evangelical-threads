-- Adds the columns the new /admin/orders page needs. All new columns are
-- either nullable or default to a safe value, so this is purely additive —
-- it doesn't touch any existing rows or existing columns, and nothing else
-- on the site depends on these yet.
alter table public.orders
  add column if not exists email text,
  add column if not exists amount_total integer,
  add column if not exists items jsonb,
  add column if not exists shipped boolean not null default false,
  add column if not exists tracking_number text,
  add column if not exists carrier text,
  add column if not exists shipped_at timestamptz;
