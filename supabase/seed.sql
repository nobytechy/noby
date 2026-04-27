-- ============================================================================
-- Noby Portfolio — Seed real content (v2)
-- Run AFTER schema.sql AND migrations/001_v2.sql in Supabase SQL Editor.
-- Destructive: deletes existing rows in seeded tables and replaces them.
-- Cover images are left null — upload them via the admin panel.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- PROFILE  (single row — update in place)
-- Repositioned: leans into the rare combo of African payment-integration
-- experience plus full-stack web/mobile, available worldwide.
-- ----------------------------------------------------------------------------
update public.profile set
  full_name = 'Noby Tebulo',
  headline  = 'Full-Stack Developer · African Payments Specialist',
  tagline   = 'I help businesses launch online with payment systems that actually work — from Ecocash and PayNow to global gateways.',
  bio       = 'I''m a full-stack developer with 7+ years building production systems for businesses in Zimbabwe, across Africa, and worldwide. My speciality is the part most international developers skip: making local payment systems work — Ecocash, PayNow, ZimSwitch, EcoCash, InnBucks, plus international rails (Visa, Mastercard, PayPal).

As Lead Developer at Nhau/Indaba News I built and maintain systems serving 30+ branches nationwide. For the Adoptive and Foster Parents Association of Zimbabwe (AFPAZ) I integrated PayNow so international donors can give in seconds instead of waiting on bank deposits. For Foliage Fuels I built a time-sensitive document portal with automated lifecycle and WhatsApp notifications.

The stack: PHP/Laravel · Python/Django · JavaScript (React, Vue) · Flutter · WordPress · MySQL/PostgreSQL · plus deep API integration experience including AI (DeepSeek), WhatsApp Business, and every major payment gateway in the region.

Beyond code: field experience with Restless Development Zimbabwe doing data-collection and research for public-health programs in Hwedza District — useful when projects need real-world context, not just technical execution.

Available for direct-client projects. Fixed-quote, milestone-based, no surprises.',
  email     = 'nobytechy@gmail.com',
  phone     = '+263 774 603 865',
  location  = 'Harare, Zimbabwe — remote worldwide',
  hire_cta_text = 'Book a free 20-min call',
  socials = jsonb_build_object(
    'github',   'https://github.com/nobytechy',
    'linkedin', 'https://linkedin.com/in/nobytechy',
    'twitter',  '',
    'website',  'https://noby.aizim.co.zw'
  );

-- ----------------------------------------------------------------------------
-- SERVICES — with starting prices (USD). Prices are conservative anchors;
-- update via admin panel after first few inquiries.
-- ----------------------------------------------------------------------------
delete from public.services;
insert into public.services (title, description, icon, price_from, price_unit, sort_order) values
  ('Custom Web Application',
   'Bespoke Laravel or Django apps with auth, dashboards, integrations and clean UX. Built to scale, owned by you, hosted anywhere.',
   'fullstack', 1500, 'USD', 1),
  ('WordPress / WooCommerce Site',
   'Custom themes, plugins, WooCommerce stores. Shipped fast, mobile-perfect, ready for marketing campaigns.',
   'web', 600, 'USD', 2),
  ('Payment Integration',
   'Ecocash, PayNow, ZimSwitch, InnBucks, Stripe, PayPal — wired into your existing or new site. The local payments specialty most devs avoid.',
   'fullstack', 400, 'USD', 3),
  ('API & 3rd-party Integrations',
   'WhatsApp Business API, AI (DeepSeek/OpenAI), CRM, accounting tools — connected and tested end-to-end.',
   'fullstack', 350, 'USD', 4),
  ('Mobile App (Flutter)',
   'Cross-platform mobile apps from one codebase. Android + iOS. Includes backend wiring and store submission.',
   'mobile', 2500, 'USD', 5);

-- ----------------------------------------------------------------------------
-- SKILLS — grouped by category
-- ----------------------------------------------------------------------------
delete from public.skills;
insert into public.skills (name, category, level, sort_order) values
  -- Backend
  ('PHP',         'Backend',   5, 1),
  ('Laravel',     'Backend',   5, 2),
  ('CodeIgniter', 'Backend',   4, 3),
  ('Python',      'Backend',   5, 4),
  ('Django',      'Backend',   4, 5),
  ('Node.js',     'Backend',   4, 6),
  -- Frontend
  ('JavaScript',  'Frontend',  5, 10),
  ('React',       'Frontend',  4, 11),
  ('Vue.js',      'Frontend',  4, 12),
  ('HTML5',       'Frontend',  5, 13),
  ('CSS3',        'Frontend',  5, 14),
  ('Tailwind CSS','Frontend',  5, 15),
  ('Bootstrap',   'Frontend',  5, 16),
  -- Mobile
  ('Flutter',      'Mobile',   4, 20),
  ('React Native', 'Mobile',   4, 21),
  -- Databases
  ('MySQL',       'Databases', 5, 30),
  ('PostgreSQL',  'Databases', 5, 31),
  ('MongoDB',     'Databases', 4, 32),
  ('SQLite',      'Databases', 4, 33),
  -- Integrations & Payments
  ('Ecocash API',     'Payments', 5, 40),
  ('PayNow',          'Payments', 5, 41),
  ('ZimSwitch',       'Payments', 4, 42),
  ('Stripe / PayPal', 'Payments', 4, 43),
  ('WhatsApp Business API', 'Integrations', 4, 50),
  ('DeepSeek / OpenAI API', 'Integrations', 4, 51),
  -- Tools
  ('Git',         'Tools',     5, 60),
  ('Docker',      'Tools',     4, 61),
  ('REST APIs',   'Tools',     5, 62),
  ('GraphQL',     'Tools',     4, 63);

-- ----------------------------------------------------------------------------
-- PROJECTS — only the 4 real client projects. Placeholder/example.com
-- entries removed to protect credibility. Add new projects via admin panel
-- once they're real and live.
-- ----------------------------------------------------------------------------
delete from public.projects;
insert into public.projects
  (slug, title, short_description, long_description, tags, tech_stack,
   github_url, live_url, client_name, year_completed, featured, sort_order)
values
  ('grocery-ecommerce',
   'Grocery E-commerce Platform',
   'Full-featured online grocery store with Ecocash mobile-money checkout and inventory management.',
   E'**Problem.** A local grocery business needed to move online — but the existing global e-commerce platforms didn''t support Ecocash, the dominant mobile-money rail in Zimbabwe. Customers were dropping off at checkout because they couldn''t pay.\n\n**What I built.** Custom WooCommerce store with a bespoke Ecocash integration, full inventory management, low-stock alerts, and postcode-based delivery scheduling.\n\n**Result.** 40% faster checkout flow vs. the platform''s previous solution. Customers complete payment in their existing Ecocash app — no card needed, no abandoned carts.',
   ARRAY['ecommerce','web'],
   ARRAY['PHP','WordPress','WooCommerce','Ecocash API','MySQL'],
   null,
   'https://noby.infinityfree.me/shop',
   'Local grocery (Harare)',
   2024, true, 1),

  ('ravensus',
   'Ravensus (Pvt) Ltd — Corporate Site',
   'Professional service website for a local services business with mobile-first design.',
   E'**Problem.** Ravensus needed a credible online presence on a tight budget and timeline — without sacrificing brand quality.\n\n**What I built.** Custom mobile-first site, brand-aligned templates, optimized navigation and lead capture. Hosted on cPanel for client self-management.\n\n**Result.** 25% reduction in bounce rate vs. the prior placeholder site. 95% mobile-compatibility score. Delivered in budget, in time, with templates that saved 60–80% of build time vs. fully custom — without looking templated.',
   ARRAY['cms','web'],
   ARRAY['HTML','Bootstrap','CSS','JavaScript'],
   null,
   'https://noby.infinityfree.me/ravensus/',
   'Ravensus (Pvt) Ltd',
   2024, true, 2),

  ('afpaz',
   'AFPAZ — Donations & Document Portal',
   'Digital transparency platform letting international funders donate online and access NGO documents securely.',
   E'**Problem.** The Adoptive and Foster Parents Association of Zimbabwe (AFPAZ) was losing donor momentum because international donations required manual bank deposits — slow, opaque, and frustrating for funders. NGO documents were being shared by email, unsecurely.\n\n**What I built.** Full PayNow gateway integration (ZimSwitch, VISA, Mastercard, EcoCash, InnBucks), a secure role-based document portal, and a transparency dashboard for funding partners.\n\n**Result.** Donation processing dropped from days (manual deposits) to seconds (instant online). Document sharing dropped from hours to minutes. Sensitive financial and beneficiary data now sits behind role-based access. International funders can give from any country, in any payment method they prefer.',
   ARRAY['api','cms','web'],
   ARRAY['PHP','REST API','JavaScript','MySQL','Bootstrap','PayNow'],
   null,
   'https://noby.infinityfree.me/afpaz/',
   'Adoptive & Foster Parents Association of Zimbabwe',
   2024, true, 3),

  ('foliage-fuels',
   'Foliage Fuels — Document Portal & Corporate Site',
   'Corporate site bundled with a time-sensitive document portal featuring automated lifecycle management and WhatsApp reminders.',
   E'**Problem.** Foliage Fuels deals with documents that expire on dates, after N downloads, or after fixed periods — and they needed sponsors to be notified automatically without manual follow-up.\n\n**What I built.** Custom document portal with three expiration modes (date, download-count, time-based), bulk lifecycle management for batches, server-side encryption for sensitive sponsor files, and WhatsApp Business API reminders for upcoming expirations.\n\n**Result.** Manual follow-up on document expiration eliminated. Sponsors receive WhatsApp reminders 7 / 3 / 1 days before expiry. Documents that should be inaccessible after their window genuinely become inaccessible — no leaks via stale links.',
   ARRAY['web','cms','api'],
   ARRAY['PHP','JavaScript','HTML','Bootstrap','WhatsApp API','REST API'],
   null,
   'https://noby.infinityfree.me/foliage/',
   'Foliage Fuels',
   2024, true, 4);

-- ----------------------------------------------------------------------------
-- TESTIMONIALS — left empty intentionally.
-- Email AFPAZ, Foliage, Ravensus contacts and ask for 2-sentence quotes.
-- One real quote outweighs ten fake ones.
-- ----------------------------------------------------------------------------

commit;
