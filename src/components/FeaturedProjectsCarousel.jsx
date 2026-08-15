import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

/**
 * Curated 3-card carousel for the landing page.
 *
 * Layout — desktop: large centre card with the prev / next cards peeking
 * at reduced scale + opacity on either side. Mobile: single card with
 * pager dots and arrows. Auto-advances every 6s; pauses on hover.
 */
const PROJECTS = [
  {
    slug: 'manishapay',
    title: 'ManishaPay',
    tagline: 'Payment gateway aggregator — solo-built',
    description:
      'One REST API and no-code payment links across 11 gateways — PayNow, Stripe, PayPal, M-Pesa, Paystack and more. Hosted checkout, drop-in widget, signed webhooks, SDKs, WordPress & WHMCS plugins. 219 automated tests in production.',
    tech: ['Node.js', 'React 19', 'Supabase', '11 gateways', 'HMAC webhooks', 'SDKs'],
    liveUrl: 'https://manishapay.netlify.app',
    accent: 'from-emerald-500/30 via-teal-400/10 to-transparent',
    badge: 'from-emerald-600 to-green-700',
    initials: 'MP',
  },
  {
    slug: 'manishaai',
    title: 'ManishaAI',
    tagline: 'Multilingual payments AI assistant',
    description:
      'A free RAG-powered assistant grounded in real gateway documentation and 70+ documented pain points. Cites sources, writes integration code on tap, includes a client-side webhook debugger — and answers in English, Shona, Ndebele and Swahili.',
    tech: ['RAG', 'BM25', 'LLM', 'React 19', 'Node.js', '4 languages'],
    liveUrl: 'https://manishapay.netlify.app/ai',
    accent: 'from-teal-500/30 via-emerald-400/10 to-transparent',
    badge: 'from-teal-600 to-emerald-700',
    initials: 'AI',
  },
  {
    slug: 'ridgecrest',
    title: 'Ridgecrest Junior School',
    tagline: 'Primary-school information system',
    description:
      'End-to-end management for a Zimbabwean primary school — enrolment, attendance, term marks, fee invoices and parent statements, all behind a memorable PIN. Admin, headmaster, teacher and bursar each see only what they should.',
    tech: ['React 19', 'Vite', 'Tailwind v4', 'Supabase', 'RLS'],
    liveUrl: 'https://ridgecrest.netlify.app',
    accent: 'from-emerald-500/30 via-emerald-400/10 to-transparent',
    badge: 'from-emerald-600 to-teal-600',
    initials: 'RC',
  },
  {
    slug: 'zimproperties',
    title: 'Zim Properties',
    tagline: 'Real-estate management platform',
    description:
      'Listings, leases, tenants, inspections, maintenance and ledger accounting in one app. Staff sign in with a PIN, tenants get their own portal, and rent is collected through PayNow via ManishaPay, my own payment platform.',
    tech: ['React 19', 'Vite', 'Tailwind v4', 'Supabase', 'PayNow', 'ManishaPay'],
    liveUrl: 'https://dzimba.netlify.app',
    accent: 'from-slate-500/30 via-slate-400/10 to-transparent',
    badge: 'from-slate-700 to-zinc-700',
    initials: 'ZP',
  },
  {
    slug: 'churchzim',
    title: 'ChurchZim',
    tagline: 'Church management & engagement',
    description:
      'Sermons, events, prayer wall, tithes, expenses, member directory and pastoral notes — with PayNow-powered giving built in. Members sign in by phone; admins use a PIN-only console.',
    tech: ['React 19', 'Vite', 'Tailwind v4', 'Supabase', 'PayNow', 'PWA'],
    liveUrl: 'https://churchzim.netlify.app',
    accent: 'from-sky-500/30 via-indigo-400/10 to-transparent',
    badge: 'from-sky-600 to-indigo-600',
    initials: 'CZ',
  },
]

function ProjectVisual({ p }) {
  return (
    <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gradient-to-br ${p.accent} border border-border`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-green-400/70" />
        <span className="ml-3 truncate rounded-md bg-background/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground backdrop-blur">
          {p.liveUrl.replace(/^https?:\/\//, '')}
        </span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`grid size-20 place-items-center rounded-2xl bg-gradient-to-br ${p.badge} text-white text-2xl font-bold shadow-2xl`}>
          {p.initials}
        </div>
        <div className="mt-3 text-center px-6">
          <div className="text-base md:text-lg font-semibold">{p.title}</div>
          <div className="text-xs text-muted-foreground">{p.tagline}</div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProjectsCarousel() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = PROJECTS.length

  const go = useCallback((delta) => setIdx((i) => (i + delta + total) % total), [total])
  const goTo = (n) => setIdx(((n % total) + total) % total)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 6000)
    return () => clearInterval(id)
  }, [paused, go])

  const prev = PROJECTS[(idx - 1 + total) % total]
  const next = PROJECTS[(idx + 1) % total]
  const active = PROJECTS[idx]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Desktop: 3-card peek layout */}
      <div className="relative hidden md:flex h-[460px] items-center justify-center">
        {/* Peek cards */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="absolute left-0 top-1/2 z-10 hidden lg:flex h-[380px] w-[26%] -translate-y-1/2 origin-right items-stretch rounded-2xl opacity-40 hover:opacity-70 transition-opacity"
        >
          <div className="pointer-events-none w-full rounded-2xl border border-border bg-card/60 p-4 backdrop-blur scale-90">
            <ProjectVisual p={prev} />
            <div className="mt-3 text-left">
              <div className="text-sm font-semibold truncate">{prev.title}</div>
              <div className="text-xs text-muted-foreground truncate">{prev.tagline}</div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="absolute right-0 top-1/2 z-10 hidden lg:flex h-[380px] w-[26%] -translate-y-1/2 origin-left items-stretch rounded-2xl opacity-40 hover:opacity-70 transition-opacity"
        >
          <div className="pointer-events-none w-full rounded-2xl border border-border bg-card/60 p-4 backdrop-blur scale-90">
            <ProjectVisual p={next} />
            <div className="mt-3 text-left">
              <div className="text-sm font-semibold truncate">{next.title}</div>
              <div className="text-xs text-muted-foreground truncate">{next.tagline}</div>
            </div>
          </div>
        </button>

        {/* Active card */}
        <div className="relative z-20 w-full lg:w-[58%] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-border bg-card/90 p-5 shadow-2xl backdrop-blur"
            >
              <ProjectVisual p={active} />
              <div className="px-1 pt-5">
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Globe size={13} /> <span>{active.tagline}</span>
                </div>
                <h3 className="mt-1 text-2xl font-bold">{active.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{active.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {active.tech.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:shadow-lg transition-shadow"
                  >
                    Visit live <ExternalLink size={14} />
                  </a>
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 group"
                  >
                    Read more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: single card */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-lg"
          >
            <ProjectVisual p={active} />
            <div className="pt-4">
              <h3 className="text-xl font-bold">{active.title}</h3>
              <p className="text-xs text-primary">{active.tagline}</p>
              <p className="mt-2 text-sm text-muted-foreground">{active.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {active.tech.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
              <a
                href={active.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Visit live <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls + dots */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="grid size-9 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          {PROJECTS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.title}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="grid size-9 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
