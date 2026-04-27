-- ============================================================================
-- Migration 002 — pinned_repos table
-- Admin-curated list of GitHub repos to feature on the public site.
-- Run AFTER 001_v2.sql.
-- ============================================================================

create table if not exists public.pinned_repos (
  id uuid primary key default gen_random_uuid(),
  repo_full_name text not null,                 -- e.g. "nobytechy/noby"
  description_override text,                    -- optional, replaces GitHub's own
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (repo_full_name)
);

create index if not exists pinned_repos_sort_idx on public.pinned_repos (sort_order, created_at);

alter table public.pinned_repos enable row level security;

drop policy if exists "public read pinned_repos" on public.pinned_repos;
create policy "public read pinned_repos" on public.pinned_repos for select using (true);

drop policy if exists "admin write pinned_repos" on public.pinned_repos;
create policy "admin write pinned_repos" on public.pinned_repos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
