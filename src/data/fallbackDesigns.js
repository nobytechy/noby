/**
 * Design-work entries — cards on /designs and the full case study on
 * /designs/:slug. Same fallback pattern as fallbackProjects.js.
 *
 * Images: covers in /public/designs/ (4:5, 900px), galleries and process
 * assets in /public/designs/<folder>/ (layers as alpha WebP, sources as JPG).
 * The `files` tree is generated from the design kit folders
 * (src/data/designFiles.json) — sizes are the real kit files.
 *
 * Per entry:
 *   card:   id, slug, title, short_description, category, tags, year,
 *           client_name, live_url, image_url, images[{src, caption}]
 *   story:  status, format, concept, palette[{name, hex, job}],
 *           type[{face, role}], build{mode, aspect, steps[{src, label, note}]},
 *           rules[], handover[], credits[]
 *   build.mode: 'stack'    — each step is a transparent layer laid on top of
 *                            the previous ones (the flyer assembles itself)
 *               'sequence' — each step replaces the frame (a process or a
 *                            system rolled across pieces)
 *
 * Ordering: real client work first, then spec/template pieces — spec work is
 * always labelled as such; honesty reads as seniority.
 */
import files from './designFiles.json'

const SPEC = 'Spec work — portfolio sample'
const SOCIAL_4x5 = '1080 \u00d7 1350 px (4:5) \u2014 Instagram / Facebook portrait'

export const FALLBACK_DESIGNS = [
  {
    id: 'ds-ridgecrest',
    slug: 'ridgecrest-brand-kit',
    title: 'Ridgecrest Junior School \u2014 Brand Kit',
    short_description:
      'Complete identity for a real client: guidelines sheet, business cards, letterhead, merit certificate, social pack and enrolment poster \u2014 all built from the logo\u2019s own palette.',
    category: 'Branding',
    tags: ['Branding', 'Client work', 'Education'],
    year: '2026',
    client_name: 'Ridgecrest Junior School',
    live_url: 'https://ridgecrest.netlify.app',
    image_url: '/designs/ridgecrest-poster.jpg',
    images: [
      { src: '/designs/ridgecrest/enrolment-poster.jpg', caption: 'Enrolment poster \u2014 1080\u00d71350 social' },
      { src: '/designs/ridgecrest/brand-guidelines.jpg', caption: 'Brand guidelines \u2014 logo use, palette, type, voice' },
      { src: '/designs/ridgecrest/business-card-front.jpg', caption: 'Business card \u2014 front' },
      { src: '/designs/ridgecrest/business-card-back.jpg', caption: 'Business card \u2014 back' },
      { src: '/designs/ridgecrest/letterhead.jpg', caption: 'A4 letterhead' },
      { src: '/designs/ridgecrest/merit-certificate.jpg', caption: 'Merit certificate \u2014 A4 landscape' },
      { src: '/designs/ridgecrest/facebook-cover.jpg', caption: 'Facebook cover' },
      { src: '/designs/ridgecrest/post-announcement.jpg', caption: 'Social post \u2014 announcement template' },
      { src: '/designs/ridgecrest/post-event.jpg', caption: 'Social post \u2014 event template' },
    ],
    status: 'Client work',
    format: 'Print at 2\u00d7 resolution (cards 89\u00d751 mm, A4 letterhead, A4 landscape certificate) + social pack',
    concept:
      'The client supplied a logo and nothing else. The kit starts with the rulebook \u2014 clear space, palette jobs, type, voice \u2014 then rolls one system across every touchpoint a school actually uses: cards, letterhead, a certificate teachers hand out, a social pack, and the enrolment poster that launched the website. Every colour comes from the logo; nothing was invented.',
    palette: [
      { name: 'Ridgecrest Teal', hex: '#1f7f8a', job: 'primary, buttons, links' },
      { name: 'Sunrise Gold', hex: '#efb440', job: 'highlights, the sun' },
      { name: 'Playground Red', hex: '#d33b2f', job: 'alerts, energy, labels' },
      { name: 'Crest Green', hex: '#2e7d4f', job: 'the swoosh, growth notes' },
      { name: 'Slate Ink', hex: '#26333a', job: 'headlines, body' },
      { name: 'Warm Cream', hex: '#FBF6EC', job: 'backgrounds, paper' },
    ],
    type: [
      { face: 'Baloo 2 \u2014 800 / 700', role: 'headlines only' },
      { face: 'Sora', role: 'body, captions, contacts \u2014 never a third font' },
    ],
    build: {
      mode: 'sequence',
      aspect: '4/5',
      steps: [
        { src: '/designs/ridgecrest/brand-guidelines.jpg', label: 'Guidelines first', note: 'The rulebook: logo clear space (minimum 28 px / 12 mm), each colour with one job, the two typefaces, and the voice \u2014 warm, plain, confident, no exclamation marks.' },
        { src: '/designs/ridgecrest/business-card-front.jpg', label: 'Business card \u2014 front', note: '89 \u00d7 51 mm. Tri-colour stripe on one edge, teal name, red label. The admissions officer is a placeholder until the client confirms the name.' },
        { src: '/designs/ridgecrest/business-card-back.jpg', label: 'Business card \u2014 back', note: 'Teal ground, the logo in a circle (from the logo\u2019s sun), the motto.' },
        { src: '/designs/ridgecrest/letterhead.jpg', label: 'Letterhead', note: 'A4. Same stripe, same contacts block \u2014 the body area is left clean for the school\u2019s own letters.' },
        { src: '/designs/ridgecrest/merit-certificate.jpg', label: 'Merit certificate', note: 'A4 landscape with a fine double rule. One accent colour dominant per piece \u2014 here, red for the title.' },
        { src: '/designs/ridgecrest/facebook-cover.jpg', label: 'Facebook cover', note: 'Text held in the centre band because the edges crop on mobile.' },
        { src: '/designs/ridgecrest/post-announcement.jpg', label: 'Post template \u2014 announcement', note: 'Cream skin for everyday notices. Dates are placeholders the client fills in.' },
        { src: '/designs/ridgecrest/post-event.jpg', label: 'Post template \u2014 event', note: 'Slate skin for events \u2014 the same layout inverted so the feed doesn\u2019t look like one long notice.' },
        { src: '/designs/ridgecrest/enrolment-poster.jpg', label: 'Enrolment poster', note: '1080 \u00d7 1350. Enrolment plus the website launch \u2014 the first piece the public saw.' },
      ],
    },
    rules: [
      'Cream or slate ground, tri-colour stripe on one edge, Baloo headline with Sora support \u2014 the reuse recipe for any new Ridgecrest piece.',
      'One accent colour dominant per piece; the other colours keep their assigned jobs.',
      'Circles as background shapes come from the logo\u2019s sun \u2014 the signature device.',
      'Motto and contacts on everything: \u201cWhere every child counts.\u201d',
    ],
    handover: [
      'Real admissions officer name (card shows a placeholder)',
      'Open Day and term-opening dates for the post templates',
      'Swap ridgecrest.netlify.app for the real domain once registered',
    ],
    credits: ['Logo \u2014 supplied by the client', 'Fonts \u2014 Google Fonts, free for commercial use'],
    files: files['ridgecrest-brand-kit'],
  },
  {
    id: 'ds-zim47',
    slug: 'zim47-independence',
    title: 'Zim@47 Independence Day Poster',
    short_description:
      'National-day poster anchored on Great Zimbabwe \u2014 flag colours rationed, bird emblem watermark, the 2027 flame route from Gonakudzingwa to Rutenga.',
    category: 'Poster',
    tags: ['Poster', 'National', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/zim47-independence.jpg',
    status: SPEC,
    format: SOCIAL_4x5,
    concept:
      'Masvingo hosts the 47th Independence (18 April 2027, Rutenga Growth Point), which means the celebration returns to the monument the country is named for. So the Great Zimbabwe tower is the poster. Flag colours are rationed to a stripe band and one watermark; specific facts \u2014 the flame route, the trilingual line \u2014 replace generic slogans.',
    palette: [
      { name: 'Night green', hex: '#0c110d', job: 'ground' },
      { name: 'Tower moss', hex: '#4e6152', job: 'multiply grade on the photo' },
      { name: 'Gold', hex: '#d9a947', job: 'ZIM@47, rules, accents' },
      { name: 'Flag red', hex: '#d40000', job: 'stripe band only' },
    ],
    type: [
      { face: 'Anton \u2014 210 px', role: '\u201cZIM@47\u201d \u2014 the @-year convention' },
      { face: 'Sora', role: 'kicker, dates, the flame route strip' },
    ],
    build: {
      mode: 'sequence',
      aspect: '4/5',
      steps: [
        { src: '/designs/zim47/sources/gz-tower-graded.jpg', label: 'Grade the tower', note: 'Fanny Schertzer\u2019s CC BY 3.0 photo of the conical tower: desaturate 65% \u2192 #4e6152 multiply \u2192 gold soft-light from top-left \u2192 deepen 28%. The photo now belongs to the palette.' },
        { src: '/designs/zim47/sources/zim-bird-star.webp', label: 'Extract the emblem', note: 'The bird and star lifted from the public-domain flag \u2014 used as a 14% watermark, not a logo.' },
        { src: '/designs/zim47/sources/flame-emblem.webp', label: 'Draw the flame', note: 'The first version used a press photo of the Independence Flame. A photo I can\u2019t licence can\u2019t ship, so the medallion was redrawn from scratch in the poster\u2019s own gold \u2014 flat, iconographic, and mine to use.' },
        { src: '/designs/zim47-independence.jpg', label: 'Type and facts', note: 'Mirrored 12 px flag stripe band at the top, ZIM@47 in Anton, Uhuru \u2022 Inkululeko \u2022 Rusununguko, and the bordered strip with the real 2027 flame route.' },
      ],
    },
    rules: [
      'Ration national colours: each colour gets one job or the poster turns into bunting.',
      'Specific facts beat generic slogans \u2014 Gonakudzingwa \u2192 Jenya \u2192 Rutenga is the story.',
      'Trilingual by default: Shona, Ndebele, English.',
      'If an image can\u2019t be licensed for the client\u2019s actual use, it doesn\u2019t go in the artwork \u2014 redraw it.',
    ],
    credits: [
      'Great Zimbabwe tower \u2014 Fanny Schertzer, CC BY 3.0 (graded)',
      'Bird emblem \u2014 extracted from the public-domain flag',
      'Flame emblem \u2014 original artwork drawn for this poster',
      'Fonts \u2014 Google Fonts, free for commercial use',
    ],
    files: files['zim47-independence'],
  },
  {
    id: 'ds-newspaper',
    slug: 'the-record-newspaper',
    title: 'The Record \u2014 6-page Newspaper',
    short_description:
      'Full print-ready A4 newspaper system: masthead, section folios, 3-column body, briefs rail, fixtures sidebar \u2014 stories grounded in real 2026 Zimbabwe reporting.',
    category: 'Print',
    tags: ['Print', 'Editorial', 'Template'],
    year: '2026',
    client_name: null,
    image_url: '/designs/newspaper-front.jpg',
    count_noun: 'pages',
    images: [
      { src: '/designs/the-record/front-page.jpg', caption: 'Front page \u2014 nameplate, lead story, briefs rail' },
      { src: '/designs/the-record/business-page.jpg', caption: 'Business' },
      { src: '/designs/the-record/national-page.jpg', caption: 'National' },
      { src: '/designs/the-record/arts-page.jpg', caption: 'Arts' },
      { src: '/designs/the-record/opinion-page.jpg', caption: 'Opinion' },
      { src: '/designs/the-record/sport-back-page.jpg', caption: 'Sport \u2014 back page with fixtures sidebar' },
    ],
    status: 'Template \u2014 portfolio sample',
    format: 'A4, six pages, print-ready (2\u00d7 resolution)',
    concept:
      'A newspaper is a grid system wearing a story. The masthead block belongs to the front page only; every inside page repeats one skeleton \u2014 folio bar, a single lead story, photo row with captioned credit, three-column body, and a quote box or dark sidebar to break the columns. Stories are drawn from real 2026 Zimbabwe reporting and the pages are labelled as a portfolio sample.',
    palette: [
      { name: 'Press red', hex: '#8F1F1F', job: 'the one accent (navy, green, rust presets exist)' },
      { name: 'Ink', hex: '#141414', job: 'type, rules' },
      { name: 'Newsprint', hex: '#fbfaf6', job: 'the page' },
      { name: 'Gold', hex: '#E8B54B', job: 'dark boxes only' },
    ],
    type: [
      { face: 'Playfair Display 900 \u2014 64 px', role: 'nameplate only' },
      { face: 'Source Serif 4', role: 'headlines 34\u201340 px, body 13.5 px / 1.55 leading' },
      { face: 'Archivo', role: 'folios, bylines, captions, labels \u2014 tracked' },
    ],
    build: {
      mode: 'sequence',
      aspect: '210/297',
      steps: [
        { src: '/designs/the-record/front-page.jpg', label: 'Front page', note: 'Masthead block: dateline strip, nameplate between 3 px double rules, section nav under a hairline. One lead story, right rail of briefs that point inside (\u201cFull story p.4\u201d).' },
        { src: '/designs/the-record/business-page.jpg', label: 'Business', note: 'The inside-page skeleton: folio bar with the section banner, headline \u2192 byline \u2192 photo row \u2192 captioned credit \u2192 three columns.' },
        { src: '/designs/the-record/national-page.jpg', label: 'National', note: 'Same skeleton, a quote box breaking the columns mid-page.' },
        { src: '/designs/the-record/arts-page.jpg', label: 'Arts', note: 'Lighter lead, more photo \u2014 the grid flexes without changing.' },
        { src: '/designs/the-record/opinion-page.jpg', label: 'Opinion', note: 'Type-led page: no photo row, the columns carry it.' },
        { src: '/designs/the-record/sport-back-page.jpg', label: 'Sport \u2014 back page', note: 'Back page is sport by convention; a dark fixtures-and-results sidebar earns it.' },
      ],
    },
    rules: [
      'One strong story beats four weak ones \u2014 every page has a single lead.',
      'Short paragraphs (2\u20133 sentences) so columns break cleanly.',
      'Caption every photo (who, where, when) and credit every photographer.',
      'The front page answers: what happened, who says so, why it matters.',
      'Reskin for a client in three moves: rename and set one accent colour, swap the five photos, replace story text page by page.',
    ],
    credits: [
      'Banana farmers \u2014 USAID in Africa, public domain',
      'Mobile money kiosk \u2014 Bukulu Steven, CC BY-SA 4.0',
      'Maize field \u2014 Sichelesile, CC BY-SA 4.0',
      'Dancer silhouette \u2014 D. Sharon Pruitt, CC BY 2.0',
      'Cricket \u2014 Mohammed Tawsif Salam, CC BY-SA 3.0',
      'Fonts \u2014 Google Fonts, free for commercial use',
    ],
    files: files['the-record-newspaper'],
  },
  {
    id: 'ds-hollies',
    slug: 'hollies-jameson-thursdays',
    title: 'Hollies \u2014 Jameson Thursdays',
    short_description:
      'Nightclub drink-promo flyer: blackened-green ground, gold price story ($15 was $30), keyed dancer silhouette, alcohol-compliance fine print.',
    category: 'Flyer',
    tags: ['Flyer', 'Hospitality', 'Nightlife', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/hollies-jameson.jpg',
    status: SPEC,
    format: SOCIAL_4x5,
    concept:
      'One master hospitality layout \u2014 hero photo in the top 58%, a scrim that fades into a solid panel, a bottom-anchored content stack \u2014 with three skins: nightclub, restaurant, catering. Jameson Thursdays is the nightclub skin, built for Hollies in Harare. The five layers below are the actual Photoshop stack; drop them in order and the flyer rebuilds.',
    palette: [
      { name: 'Blackened green', hex: '#0a0f0c', job: 'ground' },
      { name: 'Gold', hex: '#D9A441', job: 'the price, accents, the glow' },
      { name: 'Cream', hex: '#F4F1E6', job: 'text' },
    ],
    type: [
      { face: 'Unbounded 800', role: 'title 92 px, the $15 at 84 px' },
      { face: 'Sora 400 / 600 / 700', role: 'brand, kicker, details, compliance line' },
    ],
    build: {
      mode: 'stack',
      aspect: '4/5',
      steps: [
        { src: '/designs/hollies/layers/01-background.webp', label: 'Background', note: 'Blackened-green ground \u2014 the skin\u2019s base colour, nothing else.' },
        { src: '/designs/hollies/layers/02-hero-photo.webp', label: 'Hero photo', note: 'Licensed whiskey photo in the master layout\u2019s hero zone \u2014 the top 58% of the canvas.' },
        { src: '/designs/hollies/layers/03-scrim.webp', label: 'Scrim', note: 'Dark gradient: strong at the top for the header, clear in the middle, fading into a solid panel from ~62% down. This is what makes any photo work.' },
        { src: '/designs/hollies/layers/04-dancer-silhouette.webp', label: 'Dancer silhouette', note: 'Keyed from a sunset photo, re-inked near-black, bottom edge faded, gold radial glow behind at 28%.' },
        { src: '/designs/hollies/layers/05-text-stack.webp', label: 'Text stack', note: 'Bottom-anchored, 64 px margins: brand \u2192 kicker \u2192 title \u2192 price story \u2192 date rule \u2192 details \u2192 compliance \u2192 credit.' },
      ],
    },
    rules: [
      'Strike the old price and make the new price the second-biggest thing on the page \u2014 people anchor on the number.',
      'State the unit: \u201c/ bottle, all night\u201d.',
      'Every alcohol flyer carries \u201c18+ only \u2022 drink responsibly \u2022 while stocks last\u201d.',
      'Brand names are fine for a venue special; brand logos need distributor sign-off (they often sponsor).',
      'No identifiable faces without a model release \u2014 silhouettes are safe.',
    ],
    credits: [
      'Whiskey photo \u2014 Personal Creations, CC BY 2.0 (credited on the flyer)',
      'Dancer photo \u2014 D. Sharon Pruitt, CC BY 2.0 (transformed to silhouette)',
      'Fonts \u2014 Google Fonts, free for commercial use',
    ],
    files: files['hollies-jameson-thursdays'],
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
    status: SPEC,
    format: SOCIAL_4x5,
    concept:
      'One left-aligned editorial skeleton for corporate events \u2014 brand bar, kicker with an accent dash, title, subtitle, hero band, three-cell info grid on hairline rules, full-width CTA bar \u2014 with three skins: corporate navy, executive dark, innovation green. This is the national-identity treatment for a ZITF side event: the flag as a sliver, never a backdrop.',
    palette: [
      { name: 'Charcoal green', hex: '#111411', job: 'ground (gradient to #0c0e0c)' },
      { name: 'Gold', hex: '#C4903B', job: 'labels, accents' },
      { name: 'Flag red', hex: '#D40000', job: 'one kicker dash' },
      { name: 'Flag green', hex: '#0F5A28', job: 'the CTA bar only' },
      { name: 'Cream', hex: '#f2efe8', job: 'text' },
    ],
    type: [
      { face: 'Archivo 800 \u2014 74 px, \u22122 tracking', role: 'title' },
      { face: 'Archivo \u2014 20\u201324 px, +4\u20138 tracking', role: 'labels, info grid' },
    ],
    build: {
      mode: 'stack',
      aspect: '4/5',
      steps: [
        { src: '/designs/zitf/layers/01-background.webp', label: 'Background', note: 'Charcoal gradient, the flag as a 4 \u00d7 10 px stripe band at the very top, and the bird emblem at 16% opacity.' },
        { src: '/designs/zitf/layers/02-hero-photo.webp', label: 'Hero band', note: 'Full-width image band with a gold corner accent. On a live job this is real venue photography.' },
        { src: '/designs/zitf/layers/03-text-upper.webp', label: 'Upper type', note: 'Brand bar, red-dash kicker, the 74 px title, subtitle \u2014 all on the 72 px left margin. Asymmetry reads \u201cbusiness\u201d.' },
        { src: '/designs/zitf/layers/04-text-footer.webp', label: 'Info grid + CTA', note: 'Date / venue / admission on hairline rules, then the green CTA bar: ask on the left, contact on the right.' },
      ],
    },
    rules: [
      'Ration national colours: each colour gets one job or it looks like bunting.',
      'The info grid\u2019s third cell flexes per event: admission, dress code or registration.',
      'Other companies\u2019 branding (banners, LED walls) never goes on a flyer without sign-off.',
      'Placeholder contacts stay visibly fake (yourevent.co.zw) until a client supplies real ones.',
    ],
    credits: [
      'Zimbabwe flag emblem \u2014 public domain',
      'Hero image \u2014 AI render supplied by the designer; replaced with venue photography on live jobs',
      'Fonts \u2014 Google Fonts, free for commercial use',
    ],
    files: files['zitf-business-conference'],
  },
  {
    id: 'ds-meridian',
    slug: 'meridian-investor-summit',
    title: 'Meridian Capital \u2014 Investor Summit',
    short_description:
      'Dark executive gala variant of the same corporate skeleton \u2014 serif headline, gold corner accents, info grid with hairline rules.',
    category: 'Flyer',
    tags: ['Flyer', 'Corporate', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/meridian-summit.jpg',
    status: SPEC,
    format: SOCIAL_4x5,
    concept:
      'The proof that the corporate skeleton holds: the ZITF layout re-skinned executive-dark for an investor gala. Same margins, same order of elements, same info grid \u2014 only the skin changes: a serif headline, maroon RSVP bar, gold corner accents.',
    palette: [
      { name: 'Charcoal', hex: '#15161a', job: 'ground' },
      { name: 'Maroon', hex: '#7a1f2b', job: 'the RSVP bar' },
      { name: 'Cream', hex: '#f2efe8', job: 'text' },
    ],
    type: [
      { face: 'Source Serif 4', role: 'headline \u2014 the executive-dark skin\u2019s voice' },
      { face: 'Archivo', role: 'labels, info grid' },
    ],
    build: {
      mode: 'sequence',
      aspect: '4/5',
      steps: [
        { src: '/designs/zitf-conference.jpg', label: 'The skeleton', note: 'The corporate layout in its ZITF national skin: brand bar, kicker, title, hero band, info grid, CTA bar.' },
        { src: '/designs/meridian-summit.jpg', label: 'Re-skinned', note: 'Executive dark: Source Serif headline, gold corners on the hero band, maroon RSVP bar. Nothing moved \u2014 the grid did the work.' },
      ],
    },
    rules: [
      'Left-aligned editorial grid with 72 px margins \u2014 asymmetry reads \u201cbusiness\u201d.',
      'Order never changes: brand \u2192 kicker \u2192 title \u2192 subtitle \u2192 hero band \u2192 info grid \u2192 CTA bar.',
      'Spec work is labelled \u201cPORTFOLIO SAMPLE\u201d in the credit line.',
    ],
    credits: [
      'Hero image \u2014 AI render supplied by the designer; replaced with venue photography on live jobs',
      'Fonts \u2014 Google Fonts, free for commercial use',
    ],
    files: files['meridian-investor-summit'],
  },
  {
    id: 'ds-champions',
    slug: 'champions-restaurant',
    title: 'Champions Restaurant \u2014 Promo + Menu',
    short_description:
      '$2 Sadza Special social promo (circular plate cutout, price burst) and a matching A4 menu with Shona dish names and English one-liners.',
    category: 'Flyer',
    tags: ['Flyer', 'Menu', 'Hospitality', 'Spec work'],
    year: '2026',
    client_name: null,
    image_url: '/designs/champions-promo.jpg',
    images: [
      { src: '/designs/champions/sadza-promo.jpg', caption: '$2 Sadza Special \u2014 1080\u00d71350 social promo' },
      { src: '/designs/champions/menu-a4.jpg', caption: 'A4 menu \u2014 Shona dish names, English one-liners' },
    ],
    status: 'Proposal sample',
    format: 'Social promo 1080 \u00d7 1350 px + A4 menu (2\u00d7 resolution, print-ready)',
    concept:
      'A two-piece proposal for a local restaurant at Queensway Shops: a $2 Sadza Special promo for social and a full A4 menu that cross-sells it. Appetite colours straight off the plate, the food cut into a circle so it floats on dark, and the price sitting right next to it \u2014 price near food converts.',
    palette: [
      { name: 'Charcoal brown', hex: '#17110c', job: 'ground \u2014 food glows on dark' },
      { name: 'Paprika red', hex: '#C8401F', job: 'energy, the promo ribbon' },
      { name: 'Maize gold', hex: '#F2A93B', job: 'prices, accents' },
      { name: 'Cream', hex: '#FCF3E3', job: 'text' },
    ],
    type: [
      { face: 'Anton', role: 'display and every price \u2014 always in gold' },
      { face: 'Sora', role: 'body, dish descriptions' },
    ],
    build: {
      mode: 'sequence',
      aspect: '4/5',
      steps: [
        { src: '/designs/champions/sources/source-plate-original.jpg', label: 'Source plate', note: 'A licensed plate photo (Chen Hualin, CC BY-SA 3.0) with a busy table around it.' },
        { src: '/designs/champions/sources/source-sadza-plate-cutout.webp', label: 'Circular cutout', note: 'Cut into a circle \u2014 kills the messy background so the food floats on the dark ground.' },
        { src: '/designs/champions/sources/source-coke-bottle.webp', label: 'The free drink', note: 'Coke bottle PNG (Hariadi, CC BY-SA 3.0) for the offer sticker.' },
        { src: '/designs/champions/sadza-promo.jpg', label: 'Promo poster', note: 'Price in a rotated red burst next to the food, the offer as its own tilted gold sticker, fine print capping the deal.' },
        { src: '/designs/champions/menu-a4.jpg', label: 'A4 menu', note: 'Shona dish names with one-line English descriptions, right-aligned Anton prices with no dotted leaders, the promo ribbon under the header so menu and poster cross-sell.' },
      ],
    },
    rules: [
      'Price near food converts \u2014 the burst sits beside the plate, not in a corner.',
      'Cap the offer in the fine print: \u201cone 300 ml per plate\u201d, \u201cwhile stocks last\u201d.',
      'An anchor price at the top of the delicacies (Gango $6, \u201cfeeds two\u201d) makes the rest feel affordable.',
      'Locals order in Shona; newcomers still understand \u2014 so both languages, every line.',
    ],
    handover: [
      'Every price and the real phone number confirmed by the client',
      'Promo maths confirmed ($2 plate + free 300 ml Coke)',
      'Coca-Cola naming is ordinary trade use \u2014 check bottler co-op rules before paid boosting',
    ],
    credits: [
      'Plate photo \u2014 Chen Hualin, CC BY-SA 3.0',
      'Coke bottle \u2014 Hariadi, CC BY-SA 3.0',
      'Fonts \u2014 Google Fonts, free for commercial use',
    ],
    files: files['champions-restaurant'],
  },
  {
    id: 'ds-matchday',
    slug: 'match-day-poster',
    title: 'Derby Day \u2014 Match Poster',
    short_description:
      'Football derby poster: ghost display type, graded action photo, condensed sports typography and a gate-ticket CTA.',
    category: 'Poster',
    tags: ['Poster', 'Sport', 'Template'],
    year: '2026',
    client_name: null,
    image_url: '/designs/match-day.jpg',
    status: 'Template \u2014 portfolio sample',
    format: SOCIAL_4x5,
    concept:
      'A derby poster built as a layered Photoshop kit: six aligned layers that assemble into the final, with the ungraded source photo included so the navy grade can be rebuilt by hand. One accent colour, a bottom-anchored stack, and a squint test \u2014 DERBY DAY must read first.',
    palette: [
      { name: 'Navy', hex: '#1a1a2e', job: 'background gradient (to #16213e)' },
      { name: 'Gold', hex: '#FFD700', job: 'the one accent: team line, divider, ticket button' },
      { name: 'White', hex: '#ffffff', job: 'headline, date' },
      { name: 'Silver', hex: '#cccccc', job: 'venue line' },
    ],
    type: [
      { face: 'Anton', role: 'DERBY DAY at 168 px, the ghost \u201cDERBY\u201d at 300 px' },
      { face: 'Barlow Condensed 500 / 600 / 700', role: 'labels, date, venue, CTA \u2014 tracked wide' },
    ],
    build: {
      mode: 'stack',
      aspect: '4/5',
      steps: [
        { src: '/designs/match-day/layers/01-background.webp', label: 'Background', note: 'Linear gradient at ~160\u00b0, #1a1a2e to #16213e.' },
        { src: '/designs/match-day/layers/02-player-photo-graded.webp', label: 'Graded photo', note: 'The action shot desaturated ~55%, a #565b82 multiply fill, then a 30% #16213e overlay \u2014 the photo joins the palette.' },
        { src: '/designs/match-day/layers/03-scrim.webp', label: 'Scrim', note: 'Black-to-transparent: top 30% at 55% opacity, bottom 22% climbing to ~95% \u2014 legibility for everything that follows.' },
        { src: '/designs/match-day/layers/04-ghost-type.webp', label: 'Ghost type', note: '\u201cDERBY\u201d in Anton at 300 px, stroke only, white at 8% \u2014 texture, not a headline.' },
        { src: '/designs/match-day/layers/05-top-labels.webp', label: 'Top labels', note: 'MATCHWEEK 07 left, PREMIER LEAGUE right in gold \u2014 Barlow Condensed Bold, tracking +500, inside the 64 px safe zone.' },
        { src: '/designs/match-day/layers/06-main-text.webp', label: 'Main stack', note: 'DERBY DAY at 168 px, the team line in gold, a faded divider, date, venue, and the gold gate-ticket button \u2014 bottom-anchored, 28 px gaps.' },
      ],
    },
    rules: [
      '64 px minimum margin on all sides \u2014 the safe zone.',
      'Main stack bottom-anchored, 72 px from the bottom, centred.',
      'Hierarchy: headline about 3\u00d7 the team line. Squint \u2014 DERBY DAY must read first.',
      'Works on Facebook feed (4:5 is the max portrait ratio) and Instagram portrait.',
      'Layers stay in sync with the final \u2014 a kit that rebuilds to an older version is a kit that ships the wrong date.',
    ],
    credits: [
      'Photo \u2014 Dominic Nelson, Wikimedia Commons, CC BY-SA 4.0',
      'Fonts \u2014 Google Fonts, free for commercial use',
    ],
    files: files['match-day-poster'],
  },
]

// Filter chips — formats only (an industry like "Hospitality" lives in tags,
// not alongside formats, so the chip row reads as one clean taxonomy).
export const DESIGN_CATEGORIES = ['all', 'Poster', 'Flyer', 'Print', 'Branding']

export const fallbackDesignBySlug = slug => FALLBACK_DESIGNS.find(d => d.slug === slug) || null
