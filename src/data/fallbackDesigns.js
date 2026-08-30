/**
 * Hardcoded design-work entries for the Designs page — same fallback pattern
 * as fallbackProjects.js. Covers live in /public/designs/, multi-piece
 * galleries in /public/designs/<folder>/.
 *
 * Shape (mirrors a future Supabase `designs` table):
 * { id, slug, title, short_description, category, tags, year, client_name,
 *   image_url,                      // card cover (4:5, 900px wide)
 *   images: [{ src, caption }],     // optional — every piece the lightbox
 *                                   // pages through; first entry = cover
 *   kit_url }                       // optional — zip in /public/designs/kits/
 *
 * Ordering: real client work first, then spec/template pieces — honesty
 * reads as seniority, so spec work is always tagged as such.
 */

export const FALLBACK_DESIGNS = [
  {
    id: 'ds-ridgecrest',
    slug: 'ridgecrest-brand-kit',
    title: 'Ridgecrest Junior School — Brand Kit',
    short_description:
      'Complete identity for a real client: guidelines sheet, business cards, letterhead, merit certificate, social pack and enrolment poster — all built from the logo\u2019s own palette.',
    category: 'Branding',
    tags: ['Branding', 'Client work', 'Education'],
    year: '2026',
    client_name: 'Ridgecrest Junior School',
    image_url: '/designs/ridgecrest-poster.jpg',
    images: [
      { src: '/designs/ridgecrest/enrolment-poster.jpg', caption: 'Enrolment poster — 1080\u00d71350 social' },
      { src: '/designs/ridgecrest/brand-guidelines.jpg', caption: 'Brand guidelines — logo use, palette, type, voice' },
      { src: '/designs/ridgecrest/business-card-front.jpg', caption: 'Business card — front' },
      { src: '/designs/ridgecrest/business-card-back.jpg', caption: 'Business card — back' },
      { src: '/designs/ridgecrest/letterhead.jpg', caption: 'A4 letterhead' },
      { src: '/designs/ridgecrest/merit-certificate.jpg', caption: 'Merit certificate — A4 landscape' },
      { src: '/designs/ridgecrest/facebook-cover.jpg', caption: 'Facebook cover' },
      { src: '/designs/ridgecrest/post-announcement.jpg', caption: 'Social post — announcement template' },
      { src: '/designs/ridgecrest/post-event.jpg', caption: 'Social post — event template' },
    ],
  },
  {
    id: 'ds-zim47',
    slug: 'zim47-independence',
    title: 'Zim@47 Independence Day Poster',
    short_description:
      'National-day poster anchored on Great Zimbabwe — flag colours rationed, bird emblem watermark, the 2027 flame route from Gonakudzingwa to Rutenga.',
    category: 'Poster',
    tags: ['Poster', 'National', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/zim47-independence.jpg',
  },
  {
    id: 'ds-newspaper',
    slug: 'the-record-newspaper',
    title: 'The Record — 6-page Newspaper',
    short_description:
      'Full print-ready A4 newspaper system: masthead, section folios, 3-column body, briefs rail, fixtures sidebar — stories grounded in real 2026 Zimbabwe reporting.',
    category: 'Print',
    tags: ['Print', 'Editorial', 'Template'],
    year: '2026',
    client_name: null,
    image_url: '/designs/newspaper-front.jpg',
    count_noun: 'pages',
    images: [
      { src: '/designs/the-record/front-page.jpg', caption: 'Front page — nameplate, lead story, briefs rail' },
      { src: '/designs/the-record/business-page.jpg', caption: 'Business' },
      { src: '/designs/the-record/national-page.jpg', caption: 'National' },
      { src: '/designs/the-record/arts-page.jpg', caption: 'Arts' },
      { src: '/designs/the-record/opinion-page.jpg', caption: 'Opinion' },
      { src: '/designs/the-record/sport-back-page.jpg', caption: 'Sport — back page with fixtures sidebar' },
    ],
  },
  {
    id: 'ds-hollies',
    slug: 'hollies-jameson-thursdays',
    title: 'Hollies — Jameson Thursdays',
    short_description:
      'Nightclub drink-promo flyer: blackened-green ground, gold price story ($15 was $30), keyed dancer silhouette, alcohol-compliance fine print.',
    category: 'Flyer',
    tags: ['Flyer', 'Hospitality', 'Nightlife', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/hollies-jameson.jpg',
  },
  {
    id: 'ds-zitf',
    slug: 'zitf-business-conference',
    title: 'ZITF Business Conference',
    short_description:
      'Corporate event flyer in national identity: flag stripe band, bird watermark at 16%, each flag colour assigned exactly one job.',
    category: 'Flyer',
    tags: ['Flyer', 'Corporate', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/zitf-conference.jpg',
  },
  {
    id: 'ds-meridian',
    slug: 'meridian-investor-summit',
    title: 'Meridian Capital — Investor Summit',
    short_description:
      'Dark executive gala variant of the same corporate skeleton — serif headline, gold corner accents, info grid with hairline rules.',
    category: 'Flyer',
    tags: ['Flyer', 'Corporate', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/meridian-summit.jpg',
  },
  {
    id: 'ds-champions',
    slug: 'champions-restaurant',
    title: 'Champions Restaurant — Promo + Menu',
    short_description:
      '$2 Sadza Special social promo (circular plate cutout, price burst) and a matching A4 menu with Shona dish names and English one-liners.',
    category: 'Flyer',
    tags: ['Flyer', 'Menu', 'Hospitality', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/champions-promo.jpg',
    images: [
      { src: '/designs/champions/sadza-promo.jpg', caption: '$2 Sadza Special — 1080\u00d71350 social promo' },
      { src: '/designs/champions/menu-a4.jpg', caption: 'A4 menu — Shona dish names, English one-liners' },
    ],
  },
  {
    id: 'ds-matchday',
    slug: 'match-day-poster',
    title: 'Derby Day — Match Poster',
    short_description:
      'Football derby poster: ghost display type, graded action photo, condensed sports typography and a gate-ticket CTA.',
    category: 'Poster',
    tags: ['Poster', 'Sport', 'Template'],
    year: '2026',
    client_name: null,
    image_url: '/designs/match-day.jpg',
  },
]

// Filter chips — formats only (an industry like "Hospitality" lives in tags,
// not alongside formats, so the chip row reads as one clean taxonomy).
export const DESIGN_CATEGORIES = ['all', 'Poster', 'Flyer', 'Print', 'Branding']
