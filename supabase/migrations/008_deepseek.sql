-- ============================================================================
-- Migration 008 — Add DeepSeek as a 4th provider for Ask Noby
--
-- DeepSeek is OpenAI-compatible (api.deepseek.com/v1) and very cheap —
-- deepseek-chat ≈ $0.27/M input / $1.10/M output. Reasonable fallback or
-- demo provider alongside Groq / Anthropic / Gemini.
--
-- Idempotent: safe to re-run.
-- ============================================================================

alter table public.ai_settings
  add column if not exists deepseek_api_key text;

alter table public.ai_settings
  add column if not exists deepseek_model text not null default 'deepseek-chat';

-- Replace the provider CHECK to include 'deepseek'.
-- Postgres doesn't have ALTER CHECK in-place; drop + add.
do $$
declare
  con_name text;
begin
  select conname into con_name
  from pg_constraint
  where conrelid = 'public.ai_settings'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%provider%';
  if con_name is not null then
    execute format('alter table public.ai_settings drop constraint %I', con_name);
  end if;
end $$;

alter table public.ai_settings
  add constraint ai_settings_provider_check
  check (provider in ('groq', 'anthropic', 'gemini', 'deepseek'));

select 'DeepSeek provider added' as status, now() as at;
