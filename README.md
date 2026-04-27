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

1. In cPanel → **Subdomains** → create `noby` under `aizim.co.zw`. cPanel will create a folder like `public_html/noby/`.
2. Upload the **contents** of your local `dist/` folder (not the folder itself) to `public_html/noby/`. Use cPanel File Manager or FTP.
3. Make sure `.htaccess` made it through. Visit https://noby.aizim.co.zw — done.

### Optional: GitHub Actions auto-deploy via FTP
After the first manual deploy works, add a workflow at `.github/workflows/deploy.yml` that builds and FTP-uploads on every push. You'd add these GitHub secrets:
- `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR` (e.g. `/public_html/noby/`)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`

(Workflow not included by default — ask before enabling so we can confirm credential handling.)

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
