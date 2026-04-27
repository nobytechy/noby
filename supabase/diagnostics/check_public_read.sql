-- ============================================================================
-- Diagnostic: why aren't services / projects showing on the public site?
-- Run this in Supabase SQL Editor and look at all 3 result panes.
-- ============================================================================

-- 1) Do the rows exist?
select
  (select count(*) from public.services)         as services_count,
  (select count(*) from public.projects)         as projects_count,
  (select count(*) from public.skills)           as skills_count,
  (select count(*) from public.testimonials)     as testimonials_count;

-- 2) Is RLS enabled on the content tables? (should be true on all)
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('profile','services','projects','skills','testimonials','contact_messages','pinned_repos')
order by tablename;

-- 3) Which policies exist? (you should see "public read X" rows for each)
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('profile','services','projects','skills','testimonials','pinned_repos')
order by tablename, policyname;
