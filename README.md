# Noby Tebulo — Portfolio

Personal portfolio of **Noby Tebulo** — full-stack & fintech developer, builder of
[ManishaPay](https://manishapay.netlify.app) (11-gateway payment platform) and
[ManishaAI](https://manishapay.netlify.app/ai) (multilingual payments assistant).

**Live: https://nobie.netlify.app**

A modern React SPA with a Supabase-backed admin panel — every section (profile,
projects, services, skills, testimonials, inbox) is editable from `/admin` with
sensible hardcoded fallbacks, so the site looks complete even before content is
loaded.

## Highlights

- **Featured work** — curated carousel leading with ManishaPay & ManishaAI,
  plus client platforms (school MIS, real-estate, church management)
- **Admin panel** — full CRUD for all content behind Supabase Auth + RLS
- **Brief Assistant** — AI-assisted project brief capture on the contact flow
- **PWA** — installable, offline-capable, update prompts
- **SEO** — per-page meta via `react-helmet-async`, OG/Twitter cards, JSON-LD,
  sitemap, canonical domain `nobie.netlify.app`
- **Analytics** — lightweight first-party page tracking to Supabase

## Stack

- React 19 + Vite (plain JavaScript)
- Tailwind CSS v4 · Framer Motion · Radix UI primitives (shadcn-style components)
- Supabase — Auth, Postgres (RLS), Storage
- React Router v6 · react-hook-form · react-hot-toast · lucide-react
- vite-plugin-pwa (Workbox)

## Local development

```bash
npm install --legacy-peer-deps   # (vite-plugin-pwa peer range vs Vite 8)
cp .env.example .env.local       # fill in Supabase URL + anon key
npm run dev
```

Open http://localhost:5173.

## First-time Supabase setup

1. Create a project at supabase.com (free tier).
2. **SQL Editor → New query**, paste `supabase/schema.sql`, **Run**.
3. **Authentication → Users → Add user**: your admin email + a strong password.
4. **Project Settings → API**: copy the Project URL and `anon` key into `.env.local`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_SITE_URL=https://nobie.netlify.app
   ```
5. Run the app, visit `/admin/login`, sign in, and load your content.

## Build & deploy

```bash
npm run build   # → dist/ (static assets + sw.js, robots.txt, sitemap.xml)
```

**Primary deploy — Netlify:** connected to this repo; every push to `main`
auto-builds and deploys to https://nobie.netlify.app (`netlify.toml` holds the
build settings + SPA redirects).

**Alternate deploy — cPanel:** `npm run deploy` streams `dist/` over SSH to a
cPanel host (see `scripts/`; requires an SSH host alias — kept for when the
site moves to a custom domain on cPanel hosting). Without SSH, upload `dist/`
via File Manager and keep `.htaccess` for SPA deep links.

## Admin panel

`/admin/login` — manage:

- **Profile** — name, headline, bio, headshot, resume, socials, contact info
- **Projects** — full CRUD: cover images, tags, tech stack, GitHub/live URLs, featured toggle
- **Services · Skills · Testimonials** — simple CRUD
- **Inbox** — read/reply/delete contact-form messages

## Security notes

- The service-role key is **never** used in this app — everything goes through
  the `anon` key + RLS policies.
- `.env.local` is gitignored; never commit it.
- Rotate the admin password before launch (Supabase → Auth → Users).

## Project structure

```
src/
├── components/        ui/, layout/, SEO.jsx, FeaturedProjectsCarousel.jsx, …
├── context/           AuthContext, ThemeContext
├── lib/               supabase.js, queries.js, utils.js
├── pages/             Home, About, Services, Projects, Products, Contact, …
├── admin/             Login, AdminLayout, Dashboard, ProjectsAdmin, …
├── App.jsx            routes
├── main.jsx           providers
└── index.css          Tailwind v4 + theme
supabase/schema.sql    run once in the Supabase SQL editor
netlify/               serverless functions
public/                .htaccess, robots.txt, sitemap.xml, PWA assets
public/designs/        design covers (900px JPG) + per-project layers/sources
```

## Designs (graphic-design case studies)

`/designs` and `/designs/:slug` are static — no database. To add a piece:

1. Web-size the cover to `public/designs/<slug>.jpg` (4:5, 900px wide, ~q85).
   Extra pieces, layers (alpha WebP, 720×900) and sources go in `public/designs/<folder>/`.
2. Add an entry to `src/data/fallbackDesigns.js` — card fields plus the case study
   (`concept`, `palette`, `type`, `build.steps`, `rules`, `credits`). `build.mode` is
   `stack` when the steps are transparent layers, `sequence` when each step replaces the frame.
3. Optionally add its file tree to `src/data/designFiles.json` (name, size in bytes, kind, preview).

---

**Contact:** nobytechy@gmail.com · [wa.me/263774603865](https://wa.me/263774603865) ·
[GitHub](https://github.com/nobytechy) · Built and maintained by Noby Tebulo.
