-- ============================================================================
-- Migration 001 — v2 schema additions
-- Run in Supabase SQL Editor AFTER schema.sql.
-- Idempotent: re-running is safe.
-- ============================================================================

-- Services: starting price -----------------------------------------------------
alter table public.services
  add column if not exists price_from numeric,
  add column if not exists price_unit text default 'USD';

-- Contact messages: structured intake -----------------------------------------
alter table public.contact_messages
  add column if not exists project_type text,
  add column if not exists budget_range text,
  add column if not exists timeline text;

-- Projects: per-project metric + client name surfaced on detail page ---------
alter table public.projects
  add column if not exists client_name text,
  add column if not exists year_completed int;
