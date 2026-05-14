-- ============================================================================
-- Noby Portfolio — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Then: Authentication → Users → Add user
--   email:    aizim1900@gmail.com
--   password: 20301980             (default PIN — change it from the admin UI)
--
-- The admin email is hardcoded in two places:
--   1. RLS policies below (auth.jwt() ->> 'email')
--   2. src/context/AuthContext.jsx (ADMIN_EMAIL)
-- If you change one, change the other.
-- ============================================================================

-- Extensions ---------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- profile (single row holding the site owner's bio/socials)
create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Noby',
  headline text,
  tagline text,
  bio text,
  email text,
  phone text,
  location text,
  headshot_url text,
  resume_url text,
  socials jsonb not null default '{}'::jsonb,
  hire_cta_text text default 'Hire Me',
  updated_at timestamptz not null default now()
);

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text,
  long_description text,
  cover_image_url text,
  screenshots jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  tech_stack text[] not null default '{}',
  github_url text,
  live_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_featured_idx on public.projects (featured, sort_order);
create index if not exists projects_slug_idx on public.projects (slug);

-- services (what you offer to direct clients)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- skills
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  level int check (level between 1 and 5),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  client_company text,
  avatar_url text,
  content text not null,
  rating int check (rating between 1 and 5) default 5,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- contact_messages (inbox from contact form)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_unread_idx on public.contact_messages (is_read, created_at desc);

-- updated_at trigger ------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profile_updated on public.profile;
create trigger trg_profile_updated before update on public.profile
  for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- Strategy: anyone can READ public content. Only the hardcoded admin email
-- (aizim1900@gmail.com — see file header) can write.
-- contact_messages: anyone can INSERT; only admin can read/update/delete.
-- ============================================================================

alter table public.profile          enable row level security;
alter table public.projects         enable row level security;
alter table public.services         enable row level security;
alter table public.skills           enable row level security;
alter table public.testimonials     enable row level security;
alter table public.contact_messages enable row level security;

-- public read policies
drop policy if exists "public read profile"      on public.profile;
create policy "public read profile" on public.profile for select using (true);

drop policy if exists "public read projects"     on public.projects;
create policy "public read projects" on public.projects for select using (true);

drop policy if exists "public read services"     on public.services;
create policy "public read services" on public.services for select using (true);

drop policy if exists "public read skills"       on public.skills;
create policy "public read skills" on public.skills for select using (true);

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (true);

-- admin write policies — scoped to ADMIN_EMAIL only
drop policy if exists "admin write profile"      on public.profile;
create policy "admin write profile" on public.profile
  for all using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com') with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin write projects"     on public.projects;
create policy "admin write projects" on public.projects
  for all using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com') with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin write services"     on public.services;
create policy "admin write services" on public.services
  for all using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com') with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin write skills"       on public.skills;
create policy "admin write skills" on public.skills
  for all using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com') with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials
  for all using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com') with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- contact_messages: anyone can insert, only admin can read/update/delete
drop policy if exists "anyone can submit contact" on public.contact_messages;
create policy "anyone can submit contact" on public.contact_messages
  for insert with check (true);

drop policy if exists "admin reads contact"       on public.contact_messages;
create policy "admin reads contact" on public.contact_messages
  for select using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin updates contact"     on public.contact_messages;
create policy "admin updates contact" on public.contact_messages
  for update using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com') with check (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin deletes contact"     on public.contact_messages;
create policy "admin deletes contact" on public.contact_messages
  for delete using (auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- ============================================================================
-- STORAGE BUCKETS
-- Run this AFTER you've enabled Storage in the Supabase dashboard.
-- ============================================================================

insert into storage.buckets (id, name, public)
  values ('images', 'images', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('documents', 'documents', true)
  on conflict (id) do nothing;

-- Storage policies: public read on both buckets; admin can write.
drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "public read documents" on storage.objects;
create policy "public read documents" on storage.objects
  for select using (bucket_id = 'documents');

drop policy if exists "admin write images" on storage.objects;
create policy "admin write images" on storage.objects
  for all using (bucket_id = 'images' and auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
         with check (bucket_id = 'images' and auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

drop policy if exists "admin write documents" on storage.objects;
create policy "admin write documents" on storage.objects
  for all using (bucket_id = 'documents' and auth.jwt() ->> 'email' = 'aizim1900@gmail.com')
         with check (bucket_id = 'documents' and auth.jwt() ->> 'email' = 'aizim1900@gmail.com');

-- ============================================================================
-- SEED — placeholder profile row so the public site renders before login
-- ============================================================================

insert into public.profile (full_name, headline, tagline, bio, email, location, socials, hire_cta_text)
select
  'Noby',
  'Full-Stack Developer',
  'I build modern web applications that help businesses grow.',
  'Full-stack developer with a passion for clean architecture, fast performance, and pixel-perfect UI. Available for direct-client projects.',
  'nobytechy@gmail.com',
  'Zimbabwe',
  jsonb_build_object(
    'github',   'https://github.com/nobytechy',
    'linkedin', '',
    'twitter',  '',
    'website',  'https://noby.aizim.co.zw'
  ),
  'Hire Me'
where not exists (select 1 from public.profile);
