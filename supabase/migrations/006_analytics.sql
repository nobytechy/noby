-- ============================================================================
-- 006_analytics.sql
-- Lightweight first-party analytics. Anyone can INSERT a page view (anonymous
-- visitors do this on every public page navigation). Only the hardcoded admin
-- email can SELECT or DELETE — same isolation pattern as the rest of the app.
--
-- No PII collected: no IP addresses, no email, no name. Session ID is a
-- random UUID generated client-side and stored in sessionStorage (clears
-- when the tab closes).
-- ============================================================================

create table if not exists public.page_views (
  id           bigserial    primary key,
  created_at   timestamptz  not null default now(),
  path         text         not null,
  referrer     text,
  session_id   text         not null,
  user_agent   text,
  language     text,
  screen_width int,
  device_type  text,
  is_bot       boolean      not null default false
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx       on public.page_views (path);
create index if not exists page_views_session_id_idx on public.page_views (session_id);

alter table public.page_views enable row level security;

drop policy if exists "anyone can insert page view" on public.page_views;
create policy "anyone can insert page view" on public.page_views
  for insert with check (true);

drop policy if exists "admin reads page views" on public.page_views;
create policy "admin reads page views" on public.page_views
  for select using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin deletes page views" on public.page_views;
create policy "admin deletes page views" on public.page_views
  for delete using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');
