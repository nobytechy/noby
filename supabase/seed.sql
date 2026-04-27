-- ============================================================================
-- Noby Portfolio — Seed real content from existing infinityfree site
-- Run AFTER schema.sql in Supabase SQL Editor.
-- This is destructive: it deletes existing rows in the seeded tables and
-- replaces them. Don't run again if you've already edited content via admin.
-- Cover images are left null — upload them via the admin panel.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- PROFILE  (single row — update in place rather than delete)
-- ----------------------------------------------------------------------------
update public.profile set
  full_name = 'Noby Tebulo',
  headline  = 'Full-Stack Developer',
  tagline   = 'Architecting scalable enterprise solutions — 7+ years building robust applications for thousands of daily users.',
  bio       = '7+ years designing and developing robust applications that handle complex business logic and thousands of daily users. Specialized in performance optimization, security architecture, and delivering exceptional user experiences that drive business results.

As Lead Developer at Nhau/Indaba News, I built and maintain multiple web systems serving 30+ branches nationwide. My expertise spans WordPress CMS development, custom Laravel applications, Django systems, and Flutter mobile apps — plus payment-gateway integrations (Ecocash, PayNow), WhatsApp API, and AI integrations.

Beyond coding I have field experience with Restless Development Zimbabwe, conducting research and data collection for public-health programs in Hwedza District.

Available for direct-client projects worldwide.',
  email     = 'nobytechy@gmail.com',
  phone     = '+263 774 603 865',
  location  = 'Harare, Zimbabwe — remote worldwide',
  hire_cta_text = 'Hire Me',
  socials = jsonb_build_object(
    'github',   'https://github.com/nobytechy',
    'linkedin', 'https://linkedin.com/in/nobytechy',
    'twitter',  '',
    'website',  'https://noby.aizim.co.zw'
  );

-- ----------------------------------------------------------------------------
-- SERVICES
-- ----------------------------------------------------------------------------
delete from public.services;
insert into public.services (title, description, icon, sort_order) values
  ('Backend Development',
   'PHP, Laravel, CodeIgniter, Python/Django, Node.js, REST APIs, MySQL, PostgreSQL. Scalable server-side architecture with clean, maintainable code.',
   'fullstack', 1),
  ('Frontend Development',
   'JavaScript ES6+, React, Vue.js, HTML5, CSS3, Tailwind, Bootstrap. Responsive, interactive user interfaces that convert.',
   'web', 2),
  ('WordPress & CMS',
   'Custom themes, plugins, WooCommerce, Elementor. Building and maintaining content management systems for businesses of every size.',
   'fullstack', 3),
  ('API Integration',
   'Payment gateways (Ecocash, PayNow, ZimSwitch, VISA), WhatsApp API, AI integrations (DeepSeek), third-party services. Connecting systems seamlessly.',
   'fullstack', 4),
  ('Mobile Development',
   'Flutter and React Native cross-platform apps. From idea to App Store / Play Store with a single codebase.',
   'mobile', 5);

-- ----------------------------------------------------------------------------
-- SKILLS
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
  -- Tools
  ('Git',         'Tools',     5, 40),
  ('Docker',      'Tools',     4, 41),
  ('REST APIs',   'Tools',     5, 42),
  ('GraphQL',     'Tools',     4, 43);

-- ----------------------------------------------------------------------------
-- PROJECTS (12 from your existing site)
-- Featured = first 4 (real client work). Others marked non-featured;
-- update URLs / cover images via admin panel as you finalize them.
-- ----------------------------------------------------------------------------
delete from public.projects;
insert into public.projects
  (slug, title, short_description, long_description, tags, tech_stack, github_url, live_url, featured, sort_order)
values
  ('grocery-ecommerce',
   'Grocery E-commerce Platform',
   'Full-featured online grocery store with Ecocash payment integration and inventory management.',
   E'Built a full-featured online grocery store from scratch. Highlights:\n\n• Integrated Ecocash API for local mobile-money transactions\n• Inventory management system with low-stock alerts\n• Delivery scheduling tied to customer postcode\n• 40% faster checkout flow vs. previous platform',
   ARRAY['ecommerce','web'],
   ARRAY['PHP','WordPress','WooCommerce','Ecocash API'],
   null,
   'https://noby.infinityfree.me/shop',
   true, 1),

  ('ravensus',
   'Ravensus (Pvt) Ltd Company',
   'Professional service website for a local business with mobile-responsive design.',
   E'Delivered a professional web presence within tight budget constraints.\n\n• Customized templates to match brand identity, saving 60–80% of build time vs. fully custom\n• Reduced bounce rate by 25% with improved navigation\n• Responsive design hits 95% mobile compatibility',
   ARRAY['cms','web'],
   ARRAY['HTML','Bootstrap','CSS','JavaScript'],
   null,
   'https://noby.infinityfree.me/ravensus/',
   true, 2),

  ('afpaz',
   'Adoptive and Foster Parents Association of Zimbabwe',
   'Digital transparency platform connecting NGOs with international funding partners.',
   E'Built a transparency and donation platform for AFPAZ.\n\n• Integrated PayNow gateway: ZimSwitch, VISA, EcoCash, InnBucks online donations\n• Secure document portal cut sharing time from hours to minutes\n• Switched donation processing from manual bank deposits to instant online payments\n• Role-based access protects sensitive NGO data and finances',
   ARRAY['api','cms','web'],
   ARRAY['REST API','JavaScript','PHP','MySQL','Bootstrap'],
   null,
   'https://noby.infinityfree.me/afpaz/',
   true, 3),

  ('foliage-fuels',
   'Foliage Fuels — Corporate & Document Portal',
   'Corporate site plus a time-sensitive document portal with automated lifecycle management and reminders.',
   E'Corporate site bundled with an automated document-management portal.\n\n• Time-based access control with automated expiration\n• Custom expiration rules: date, download-count, or time-based\n• Bulk expiration management for large document sets\n• Document encryption for sensitive sponsor data',
   ARRAY['web','cms'],
   ARRAY['PHP','JavaScript','HTML','Bootstrap','CSS','WhatsApp API','REST API'],
   null,
   'https://noby.infinityfree.me/foliage/',
   true, 4),

  ('ai-news-assistant',
   'AI News Assistant',
   'AI-powered content summarization and article generation built on the DeepSeek API.',
   E'Editorial assistant that summarizes long-form news and drafts article skeletons.\n\n• DeepSeek API integration\n• Real-time chat assistance for editors\n• Automated content summarization\n• Engagement uplift on summarized stories',
   ARRAY['api','web','cms'],
   ARRAY['AI Integration','PHP','DeepSeek API','JavaScript'],
   null, null, false, 5),

  ('real-estate-portal',
   'Real Estate Portal',
   'Property listing platform with virtual tours and integrated booking.',
   E'Listings platform for agencies.\n\n• Interactive listings with map search\n• Virtual tour integration\n• Agent management dashboard\n• Booking and scheduling',
   ARRAY['web','api'],
   ARRAY['Laravel','Vue.js','MySQL','Map API'],
   null, null, false, 6),

  ('school-management',
   'School Management System',
   'Comprehensive school administration and student-management system.',
   E'End-to-end school admin platform.\n\n• Student enrollment and records\n• Grade management and reports\n• Parent portal\n• Attendance tracking',
   ARRAY['web','cms'],
   ARRAY['PHP','CodeIgniter','MySQL','Bootstrap'],
   null, null, false, 7),

  ('elearning-platform',
   'E-learning Platform',
   'Online course platform with video streaming, quizzes and certificates.',
   E'Course delivery platform.\n\n• Video lesson streaming\n• Interactive quizzes\n• Per-learner progress tracking\n• Auto-generated certificates',
   ARRAY['web','api'],
   ARRAY['Laravel','React','MySQL','Video Streaming'],
   null, null, false, 8),

  ('inventory-management',
   'Inventory Management',
   'Stock-tracking and inventory-control system with barcode scanning.',
   E'Internal inventory tool.\n\n• Real-time stock updates across locations\n• Barcode scanning\n• Sales reporting\n• Supplier management',
   ARRAY['web','api'],
   ARRAY['Python','Django','PostgreSQL','React'],
   null, null, false, 9),

  ('hotel-booking',
   'Hotel Booking System',
   'Online hotel reservation and booking management.',
   E'Reservation engine for hospitality.\n\n• Real-time room availability calendar\n• Online payment integration\n• Guest management\n• Reviews and ratings',
   ARRAY['web','ecommerce'],
   ARRAY['PHP','Laravel','MySQL','Payment API'],
   null, null, false, 10),

  ('healthcare-appointments',
   'Healthcare Appointment System',
   'Medical appointment scheduling and patient management.',
   E'Clinic and practice management.\n\n• Doctor scheduling\n• Patient records\n• Automated appointment reminders\n• Prescription management',
   ARRAY['web','api'],
   ARRAY['Laravel','Vue.js','MySQL','Calendar API'],
   null, null, false, 11),

  ('food-delivery',
   'Food Delivery App',
   'Multi-restaurant food ordering and delivery platform with live tracking.',
   E'End-to-end ordering platform spanning customer mobile, restaurant dashboard and driver app.\n\n• Real-time order tracking\n• Multi-restaurant onboarding\n• Driver dispatch and management\n• Reviews and ratings',
   ARRAY['mobile','web','api'],
   ARRAY['Flutter','Laravel','MySQL','Map API'],
   null, null, false, 12);

-- ----------------------------------------------------------------------------
-- TESTIMONIALS — left empty intentionally.
-- The "experience" carousel on the old site was self-written; populating it
-- as fake testimonials would mislead clients. Add real ones via admin once
-- you have client quotes.
-- ----------------------------------------------------------------------------

commit;
