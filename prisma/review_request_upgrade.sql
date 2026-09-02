-- Run this in Supabase → SQL Editor, same as orders_upgrade.sql before it.
-- Tracks whether the "how'd you like it?" review-request email has already
-- gone out for an order, so the cron job never sends it twice.
alter table public.orders
  add column if not exists review_requested_at timestamptz;
