# Noby Portfolio

Modern React portfolio with admin panel for editing all content.
Live: https://noby.aizim.co.zw

## Stack
- React 18 + Vite + plain JavaScript
- Tailwind CSS v4
- Framer Motion
- Supabase (Auth + Postgres + Storage)
- Radix UI primitives + custom shadcn-style components
- React Router v6, react-helmet-async, lucide-react, react-hot-toast

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in Supabase URL + anon key
npm run dev
```

Open http://localhost:5173.

## First-time Supabase setup

1. Create a project at supabase.com (free tier).
2. **SQL Editor → New query**, paste `supabase/schema.sql`, **Run**.
3. **Authentication → Users → Add user**: enter your admin email + a strong password.
4. **Project Settings → API**: copy the Project URL and `anon` public key into `.env.local`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_SITE_URL=https://noby.aizim.co.zw
   ```
5. Run the app, visit `/admin/login`, log in. Edit your profile, then add projects, services, skills, testimonials.

## Build for production

```bash
npm run build
```

This produces `dist/` containing static HTML + assets. Includes `.htaccess`, `robots.txt`, `sitemap.xml`.

## Deploy to cPanel (noby.aizim.co.zw)

One-command deploy via SSH:

```bash
npm run deploy
```

Builds locally, then `tar | ssh` streams `dist/` contents into `public_html/noby/`
on the cPanel server. Smoke-tests https://noby.aizim.co.zw afterwards.

### Prerequisites (one-time)
The script uses an SSH host alias `aizim`. Add this to `~/.ssh/config`:

```
Host aizim
  HostName ssh.us.stackcp.com
  Port 22
  User aizim.co.zw
  IdentityFile ~/.ssh/aizim_cpanel
  IdentitiesOnly yes
  StrictHostKeyChecking accept-new
```

…and place the matching private key at `~/.ssh/aizim_cpanel` (chmod 600).
Test once with `ssh aizim "pwd"` — should print `/home/sites/...`.

### Manual deploy (no SSH)
If SSH is unavailable, build with `npm run build` and upload the contents of
`dist/` to `public_html/noby/` via cPanel File Manager — make sure `.htaccess`
is included for SPA routing to work on deep links like `/services` or
`/products/foo`.

## Admin panel

`/admin/login` — once signed in, you can manage:
- **Profile** — name, headline, bio, headshot, resume, socials, contact info
- **Projects** — full CRUD with cover images, tags, tech stack, GitHub/live URLs, featured toggle
- **Services**, **Skills**, **Testimonials** — simple CRUD
- **Inbox** — read/reply/delete contact form messages

## Security notes
- Service role key is **never** used in this app; everything goes through `anon` + RLS policies.
- Don't commit `.env.local` (it's gitignored).
- Rotate the admin password before launch via Supabase dashboard → Auth → Users.

## Project structure

```
src/
├── components/        ui/, layout/, ProtectedRoute.jsx, SEO.jsx
├── context/           AuthContext, ThemeContext
├── lib/               supabase.js, queries.js, utils.js
├── pages/             Home, About, Services, Projects, ProjectDetail, Contact, NotFound
├── admin/             Login, AdminLayout, Dashboard, ProjectsAdmin, etc.
├── App.jsx            routes
├── main.jsx           providers
└── index.css          Tailwind v4 + theme
supabase/schema.sql    run this once in Supabase SQL editor
public/                .htaccess, robots.txt, sitemap.xml
```
