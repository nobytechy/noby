-- ============================================================================
-- Migration 007 — Ask Noby AI chat
--
-- Adds a singleton `ai_settings` table that the admin can edit at runtime to:
--   • Pick the LLM provider (groq / anthropic / gemini)
--   • Paste each provider's API key
--   • Override the system prompt template
--   • Master kill-switch (is_enabled)
--
-- The /api/chat Netlify Function reads this table via the SERVICE_ROLE key
-- (bypassing RLS); the public browser never touches the keys.
--
-- Re-runnable. Safe to apply over an older state.
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.ai_settings (
  id              integer primary key default 1 check (id = 1),
  provider        text    not null default 'groq'
                  check (provider in ('groq', 'anthropic', 'gemini', 'deepseek')),
  is_enabled      boolean not null default true,

  -- API keys — stored as plaintext under RLS that denies all non-admin access.
  -- The Netlify Function reads these via SERVICE_ROLE; the public client never
  -- sees them. Encryption-at-rest is not added here because the threat model
  -- (anyone with service-role key already wins) makes it cosmetic.
  groq_api_key       text,
  anthropic_api_key  text,
  gemini_api_key     text,
  deepseek_api_key   text,

  -- Model identifiers per provider — editable so we can swap without redeploy.
  groq_model         text not null default 'llama-3.3-70b-versatile',
  anthropic_model    text not null default 'claude-haiku-4-5',
  gemini_model       text not null default 'gemini-2.0-flash-exp',
  deepseek_model     text not null default 'deepseek-chat',

  -- Behaviour
  -- The system prompt is a template; the function substitutes:
  --   {{profile}}  — bio block from public.profile
  --   {{projects}} — featured projects list
  --   {{skills}}   — skills list
  system_prompt   text not null default
$prompt$You are Noby Tebulo's portfolio assistant on nobie.netlify.app. Visitors are usually recruiters or potential clients — be warm, professional and direct.

About Noby:
{{profile}}

Featured projects:
{{projects}}

Skills:
{{skills}}

Rules:
- Answer questions about Noby's work, skills, projects, and experience.
- Cite the live URL when you reference a project so visitors can click through.
- Politely decline questions unrelated to Noby's professional work.
- If a recruiter wants to connect, share his email: nobytechy@gmail.com or WhatsApp +263 774 603 865.
- Don't fabricate skills, dates, or experience he doesn't have.
- Keep replies under 200 words unless the visitor explicitly asks for detail.$prompt$,

  max_tokens      integer not null default 1024 check (max_tokens between 64 and 8192),
  temperature     numeric(3,2) not null default 0.70 check (temperature between 0 and 2),

  updated_at      timestamptz not null default now()
);

-- Seed the singleton row.
insert into public.ai_settings (id) values (1)
  on conflict (id) do nothing;

-- updated_at trigger (reuse the shared helper from schema.sql)
drop trigger if exists trg_ai_settings_touch on public.ai_settings;
create trigger trg_ai_settings_touch before update on public.ai_settings
  for each row execute function public.set_updated_at();

-- RLS — admin only. No public policies → default deny for anon/auth users.
alter table public.ai_settings enable row level security;

drop policy if exists "admin all ai_settings" on public.ai_settings;
create policy "admin all ai_settings" on public.ai_settings
  for all
  using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');


-- ============================================================================
-- ai_chat_messages — optional per-message audit log so Noby can see what
-- recruiters / visitors ask. Insertions come from the Netlify Function
-- (service-role bypasses RLS); only admin can read.
-- ============================================================================
create table if not exists public.ai_chat_messages (
  id            uuid primary key default gen_random_uuid(),
  session_id    text not null,
  role          text not null check (role in ('user', 'assistant', 'system')),
  content       text not null,
  provider      text,
  model         text,
  tokens_in     integer,
  tokens_out    integer,
  latency_ms    integer,
  ip            text,
  user_agent    text,
  created_at    timestamptz not null default now()
);
create index if not exists ai_chat_messages_session_idx
  on public.ai_chat_messages (session_id, created_at);
create index if not exists ai_chat_messages_created_idx
  on public.ai_chat_messages (created_at desc);

alter table public.ai_chat_messages enable row level security;

drop policy if exists "admin reads ai_chat_messages" on public.ai_chat_messages;
create policy "admin reads ai_chat_messages" on public.ai_chat_messages
  for select using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin deletes ai_chat_messages" on public.ai_chat_messages;
create policy "admin deletes ai_chat_messages" on public.ai_chat_messages
  for delete using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

select 'Ask Noby AI tables installed' as status, now() as at;
