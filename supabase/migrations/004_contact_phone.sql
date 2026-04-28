-- ============================================================================
-- Migration 004 — make contact email optional, add mandatory phone
-- Phone is required at the application layer (form validation). DB stays
-- lenient so existing rows aren't broken and the table can be backfilled.
-- ============================================================================

alter table public.contact_messages
  alter column email drop not null;

alter table public.contact_messages
  add column if not exists phone text;
