/**
 * Hardcoded project fallbacks — shown whenever the Supabase `projects` table
 * is empty (or a slug isn't found in it). Content added later via the admin
 * panel automatically supersedes this list, because pages only reach for
 * fallbacks when the database returns nothing.
 *
 * Shape mirrors the DB rows that Projects.jsx / ProjectDetail.jsx render:
 * { id, slug, title, short_description, long_description, tech_stack,
 *   tags, live_url, github_url, cover_image_url, client_name }
 */

export const FALLBACK_PROJECTS = [
  {
    id: 'fb-manishapay',
    slug: 'manishapay',
    title: 'ManishaPay — Payment Gateway Aggregator',
    short_description:
      'One REST API and no-code payment links across 11 gateways — PayNow, Stripe, PayPal, M-Pesa, Paystack and more. Solo-built platform, SDKs and plugins.',
    long_description:
      'A payment gateway aggregator built end to end: merchants integrate once and accept every method their connected gateways support, through a hosted checkout, a 7KB drop-in widget, or shareable no-code payment links.\n\nUnder the hood: server-side hash signing for PayNow, HMAC-SHA256 signed webhook delivery and verification with replay protection, per-merchant envelope-encrypted credentials (libsodium), Zod-validated configuration, a full payment simulator for instant test mode, and 219 automated tests in production. Published Node and PHP client SDKs plus WordPress/WooCommerce and WHMCS plugins.',
    tech_stack: ['Node.js', 'Express', 'React 19', 'Supabase', 'libsodium', 'Zod', 'HMAC webhooks', 'SDKs'],
    tags: ['Fintech', 'API', 'Platform'],
    live_url: 'https://manishapay.netlify.app',
    github_url: 'https://github.com/nobytechy/manishapay',
    cover_image_url: '/projects/manishapay.jpg',
    client_name: null,
  },
  {
    id: 'fb-manishaai',
    slug: 'manishaai',
    title: 'ManishaAI — Payments AI Assistant',
    short_description:
      'Free multilingual RAG assistant grounded in real gateway docs and 70+ documented pain points. Cites sources, writes integration code, answers in 4 languages.',
    long_description:
      'A retrieval-augmented assistant for payment integrations, grounded in a 138-chunk corpus built from the open Noby Payments Knowledge Base, forum-issue research and platform documentation — so answers cite their sources instead of guessing.\n\nFeatures: conversational follow-up awareness, one-tap code generation (Node/PHP/cURL), gateway comparison tables, a fully client-side webhook signature debugger (secrets never leave the browser), shareable deep-linked questions, and answers in English, Shona, Ndebele and Swahili. Runs cost-bounded with per-visitor and global daily limits, answer caching and scope guarding.',
    tech_stack: ['RAG', 'BM25 retrieval', 'LLM APIs', 'Node.js', 'React 19', 'Web Crypto'],
    tags: ['AI', 'Fintech'],
    live_url: 'https://manishapay.netlify.app/ai',
    github_url: null,
    cover_image_url: '/projects/manishaai.jpg',
    client_name: null,
  },
  {
    id: 'fb-smartsnap',
    slug: 'smartsnap',
    title: 'SmartSnap — AI CCTV Alerting Platform',
    short_description:
      'Cross-vertical security platform turning real-time camera detections into actionable alerts with WhatsApp notifications.',
    long_description:
      'A computer-vision alerting platform for security operations: real-time camera detections (YOLO/Frigate over MQTT) become structured, actionable alerts with WhatsApp notifications to the right people.\n\nI built the alerting dashboards and the FastAPI services behind them — detection ingestion, alert rules, notification fan-out and operational reporting — containerised with Docker and backed by Supabase.',
    tech_stack: ['React', 'Vite', 'Tailwind', 'FastAPI', 'Python', 'Docker', 'Supabase', 'YOLO/Frigate', 'MQTT'],
    tags: ['AI', 'Platform'],
    live_url: 'https://smartsnap.netlify.app',
    github_url: null,
    cover_image_url: '/projects/smartsnap.jpg',
    client_name: null,
  },
  {
    id: 'fb-ridgecrest',
    slug: 'ridgecrest',
    title: 'Ridgecrest — Multi-tenant School Management (PWA)',
    short_description:
      'Public school website plus an ERP for administrators, teachers and parents — school-per-subdomain multi-tenancy with row-level security.',
    long_description:
      'A complete school information system: enrolment, attendance, term marks, fee invoices and parent statements, with role-scoped views for admin, headmaster, teachers and bursar.\n\nArchitected as a multi-tenant platform — one deployment serves many schools via subdomain routing, isolated with Supabase row-level security — and installable as a PWA for low-bandwidth environments.',
    tech_stack: ['React', 'Vite', 'Tailwind', 'Supabase RLS', 'Multi-tenant', 'PWA'],
    tags: ['ERP', 'PWA', 'Education'],
    live_url: 'https://ridgecrest.netlify.app',
    github_url: null,
    cover_image_url: '/projects/ridgecrest.jpg',
    client_name: null,
  },
  {
    id: 'fb-dzimba',
    slug: 'dzimba',
    title: 'Dzimba — Real Estate Management Platform (PWA)',
    short_description:
      'Complete real-estate ecosystem: public marketing site plus an internal ERP for listings, leases, tenants, inspections and ledger accounting.',
    long_description:
      'A full real-estate operations platform: property listings, leases, tenant records, inspections, maintenance tracking and ledger accounting in one app. Staff sign in with a PIN, tenants get their own portal, and rent is collected through PayNow via ManishaPay, my own payment platform.\n\nDesigned to turn property-management workflows into intuitive dashboards that non-technical staff use daily.',
    tech_stack: ['React', 'Supabase', 'Tailwind', 'PayNow', 'ManishaPay', 'PWA'],
    tags: ['ERP', 'PWA', 'Fintech'],
    live_url: 'https://dzimba.netlify.app',
    github_url: null,
    cover_image_url: '/projects/dzimba.jpg',
    client_name: null,
  },
  {
    id: 'fb-famba',
    slug: 'famba-fleet',
    title: 'Famba Fleet — Fleet & Logistics Platform',
    short_description:
      'Mobile-first fleet platform: real-time tracking dashboards, dispatch interfaces and automated reporting, engineered for low-end smartphones.',
    long_description:
      'A fleet and logistics platform built from scratch: live vehicle tracking on Leaflet maps, dispatch interfaces for coordinators, and automated operational reporting.\n\nEngineered mobile-first to run smoothly on the low-end Android smartphones that real drivers and dispatchers actually carry.',
    tech_stack: ['React', 'TypeScript', 'Vite', 'Supabase', 'Leaflet'],
    tags: ['Platform', 'Mobile', 'Logistics'],
    live_url: 'https://fambah.netlify.app',
    github_url: null,
    cover_image_url: '/projects/famba-fleet.jpg',
    client_name: null,
  },
  {
    id: 'fb-churchzim',
    slug: 'churchzim',
    title: 'ChurchZim — Church Management & Engagement',
    short_description:
      'Sermons, events, prayer wall, tithes, expenses and member directory — with PayNow-powered giving built in.',
    long_description:
      'A church management and member-engagement platform: sermons, events, a prayer wall, tithes and expense tracking, member directory and pastoral notes.\n\nMembers sign in by phone number; administrators use a PIN-only console. Giving is powered by PayNow, and the whole app installs as a PWA.',
    tech_stack: ['React', 'Vite', 'Tailwind', 'Supabase', 'PayNow', 'PWA'],
    tags: ['ERP', 'PWA', 'Community'],
    live_url: 'https://kereke.netlify.app',
    github_url: null,
    cover_image_url: '/projects/churchzim.jpg',
    client_name: null,
  },
  {
    id: 'fb-cagtours',
    slug: 'cag-travellers',
    title: 'CAG Travellers Coaches — Coach Booking Website (PWA)',
    short_description:
      'Public-facing travel website pairing clean marketing pages with a functional online booking and reservations flow.',
    long_description:
      'A coach-travel booking website (concept/proposal build): responsive marketing pages presenting routes and services, paired with a working online booking and reservations UI.\n\nDemonstrates the full public-website-plus-booking pattern that transport operators need, installable as a PWA.',
    tech_stack: ['React', 'Tailwind', 'Booking flow', 'PWA'],
    tags: ['Concept', 'PWA', 'Booking'],
    live_url: 'https://cagtours.netlify.app',
    github_url: null,
    cover_image_url: '/projects/cag-travellers.jpg',
    client_name: null,
  },
  {
    id: 'fb-zimfdms',
    slug: 'zimfdms',
    title: 'zimFDMS — ZIMRA Fiscalisation Integration (PWA)',
    short_description:
      "Compliance-focused interface integrating with Zimbabwe's tax fiscalisation system — strict regulatory requirements, usable workflow.",
    long_description:
      "An integration layer and interface for Zimbabwe's ZIMRA fiscalisation (FDMS) requirements: fiscal receipt workflows, device and invoice compliance, and clear operator-facing screens.\n\nThe engineering challenge: balancing strict, unforgiving regulatory requirements with a workflow that ordinary retail staff can actually follow.",
    tech_stack: ['React', 'REST integration', 'Compliance', 'PWA'],
    tags: ['Fintech', 'Compliance', 'PWA'],
    live_url: 'https://zimrafdms.netlify.app',
    github_url: 'https://github.com/nobytechy/zimraFDMS',
    cover_image_url: '/projects/zimfdms.jpg',
    client_name: null,
  },
  {
    id: 'fb-vytt',
    slug: 'vytt',
    title: 'VYTT — Restaurant & Butchery',
    short_description:
      '"Great food. Great service. Always fresh." Concept site for a restaurant, braai area and conference centre — bookings, menu and bilingual UI.',
    long_description:
      'A concept/pitch build for VYTT, a restaurant, butchery and conference venue at Gutu Junction: table bookings, menu showcase, conference-room hire and gallery, wrapped in a bold hospitality design.\n\nBuilt around their own standard — "Great food. Great service. Always fresh." — with a bilingual interface, WhatsApp contact and delivery ordering baked in.',
    tech_stack: ['React', 'Tailwind', 'Bookings', 'i18n', 'PWA'],
    tags: ['Concept', 'Hospitality'],
    live_url: 'https://vytt.netlify.app',
    github_url: null,
    cover_image_url: '/projects/vytt.jpg',
    client_name: null,
  },
  {
    id: 'fb-hibred',
    slug: 'hibred-chicks',
    title: 'Hi-Bred Chicks — Poultry Brand & Ordering',
    short_description:
      'Concept site for a day-old-chicks supplier: breed showcase with live pricing, ordering flow, and a design built to grow into a farm-management ERP.',
    long_description:
      'A concept/pitch build for Hi-Bred Chicks, a poultry producer expanding across SADC: breed cards with live pricing (broilers and layers), an order-now flow, services and WhatsApp contact — presented in a warm agricultural brand language.\n\nDeliberately architected to scale into a complete farm-management ERP as the next phase: hatchery batches, vaccinations, orders and deliveries.',
    tech_stack: ['React', 'Tailwind', 'Ordering flow', 'PWA'],
    tags: ['Concept', 'Agritech'],
    live_url: 'https://hibred.netlify.app',
    github_url: null,
    cover_image_url: '/projects/hibred-chicks.jpg',
    client_name: null,
  },
  {
    id: 'fb-butchery',
    slug: 'butchery-management',
    title: 'Manisha Butchery — Multi-shop Inventory & Finance',
    short_description:
      'Multi-shop inventory and financial management, live in 3 shops — cut stock discrepancies by ~90% and manual reporting time by 75%.',
    long_description:
      'A multi-shop inventory and financial management system for a butchery chain: stock movement, wastage tracking, sales reconciliation and daily financial reporting across branches.\n\nLive in 3 shops with measured results: stock discrepancies down ~90% and manual reporting time down 75% — the kind of software that pays for itself in the first quarter.',
    tech_stack: ['React', 'Supabase', 'Inventory', 'Reporting'],
    tags: ['ERP', 'Retail'],
    live_url: null,
    github_url: 'https://github.com/nobytechy/Manisha_Butchery_Inventory_Financial_Management_System',
    cover_image_url: null,
    client_name: 'Manisha Butchery',
  },
]

export const fallbackProjectBySlug = (slug) =>
  FALLBACK_PROJECTS.find((p) => p.slug === slug) || null
