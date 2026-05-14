-- ============================================================================
-- 005_pin_admin.sql
-- Scope all admin write/read-private policies to a single hardcoded admin user.
-- This isolates the portfolio from sibling apps that share the same Supabase
-- project: only sessions whose JWT email matches ADMIN_EMAIL can write.
--
-- Apply once in Supabase SQL Editor.
--
-- One-time setup before/after applying:
--   Authentication → Users → Add user
--     email:    aizim1900@gmail.com
--     password: 20301980        (the default PIN — change it from the admin UI)
--
-- IMPORTANT: if you ever change the admin email, update the constant in
-- src/context/AuthContext.jsx as well — both must agree.
-- ============================================================================

-- profile -----------------------------------------------------------------
drop policy if exists "admin write profile" on public.profile;
create policy "admin write profile" on public.profile
  for all
  using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- projects ----------------------------------------------------------------
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects
  for all
  using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- services ----------------------------------------------------------------
drop policy if exists "admin write services" on public.services;
create policy "admin write services" on public.services
  for all
  using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- skills ------------------------------------------------------------------
drop policy if exists "admin write skills" on public.skills;
create policy "admin write skills" on public.skills
  for all
  using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- testimonials ------------------------------------------------------------
drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials
  for all
  using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- contact_messages: anyone can insert; only admin reads/updates/deletes ---
drop policy if exists "admin reads contact" on public.contact_messages;
create policy "admin reads contact" on public.contact_messages
  for select
  using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin updates contact" on public.contact_messages;
create policy "admin updates contact" on public.contact_messages
  for update
  using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
  with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin deletes contact" on public.contact_messages;
create policy "admin deletes contact" on public.contact_messages
  for delete
  using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- pinned_repos (if present) -----------------------------------------------
do $$
begin
  if exists (select 1 from pg_class where relname = 'pinned_repos' and relnamespace = 'public'::regnamespace) then
    execute $sql$drop policy if exists "admin write pinned_repos" on public.pinned_repos$sql$;
    execute $sql$create policy "admin write pinned_repos" on public.pinned_repos
      for all
      using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
      with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')$sql$;
  end if;
end$$;

-- products (if present) ---------------------------------------------------
do $$
begin
  if exists (select 1 from pg_class where relname = 'products' and relnamespace = 'public'::regnamespace) then
    execute $sql$drop policy if exists "admin write products" on public.products$sql$;
    execute $sql$create policy "admin write products" on public.products
      for all
      using      (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
      with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com')$sql$;
  end if;
end$$;
