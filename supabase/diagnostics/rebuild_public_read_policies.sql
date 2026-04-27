-- ============================================================================
-- Rebuild public-read RLS policies.
-- Safe to run anytime — every statement uses "drop if exists" before create.
-- Run this if /services or /projects is empty on the public site
-- but content exists in admin (which is the symptom of a missing
-- anon-read policy).
-- ============================================================================

-- Make sure RLS is on (no-op if already enabled)
alter table public.profile          enable row level security;
alter table public.services         enable row level security;
alter table public.projects         enable row level security;
alter table public.skills           enable row level security;
alter table public.testimonials     enable row level security;
alter table public.contact_messages enable row level security;

-- Public read policies
drop policy if exists "public read profile"      on public.profile;
create policy "public read profile" on public.profile for select using (true);

drop policy if exists "public read services"     on public.services;
create policy "public read services" on public.services for select using (true);

drop policy if exists "public read projects"     on public.projects;
create policy "public read projects" on public.projects for select using (true);

drop policy if exists "public read skills"       on public.skills;
create policy "public read skills" on public.skills for select using (true);

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (true);

-- pinned_repos may not exist yet (only after migration 002) — guard with do-block
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'pinned_repos') then
    execute 'alter table public.pinned_repos enable row level security';
    execute 'drop policy if exists "public read pinned_repos" on public.pinned_repos';
    execute 'create policy "public read pinned_repos" on public.pinned_repos for select using (true)';
  end if;
end $$;
