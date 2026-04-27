-- ============================================================================
-- Migration 003 — products table
-- Pre-built systems sold one-time via WhatsApp checkout.
-- Run AFTER 002_pinned_repos.sql in Supabase SQL Editor.
-- ============================================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,                                -- e.g. "HR", "Hospital", "Education", "Hospitality"
  short_description text,
  long_description text,
  cover_image_url text,
  screenshots jsonb not null default '[]'::jsonb,   -- array of image URLs
  features jsonb not null default '[]'::jsonb,      -- array of bullet strings
  tech_stack text[] not null default '{}',
  price numeric not null default 0,
  currency text not null default 'USD',
  is_published boolean not null default true,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_sort_idx on public.products (is_published, sort_order);
create index if not exists products_category_idx       on public.products (category);
create index if not exists products_slug_idx           on public.products (slug);

-- Trigger: bump updated_at on update
drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "public read products list" on public.products;
create policy "public read products list" on public.products
  for select using (is_published = true);

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
