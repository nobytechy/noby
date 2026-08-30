import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { FALLBACK_DESIGNS } from '@/data/fallbackDesigns'

/**
 * Poster carousel for the landing page. Design work is portrait artwork
 * meant to be looked at one piece at a time, so it gets the stage; the
 * projects section above uses a static grid of screenshots instead, which
 * keeps the two sections from reading as the same component twice.
 *
 * Centre artwork at full stage height with the previous / next pieces
 * peeking at reduced opacity on md+; single artwork with swipe on mobile.
 * Auto-advances every 5s; pauses on hover.
 */
const ITEMS = FALLBACK_DESIGNS
const PEEK_GAP = 232 // half the active width (208) + 24px gap, at the md+ stage height

export default function DesignsCarousel() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const total = ITEMS.length

  const go = useCallback(delta => setIdx(i => (i + delta + total) % total), [total])
  const goTo = n => setIdx(((n % total) + total) % total)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 5000)
    return () => clearInterval(id)
  }, [paused, go])

  const prev = ITEMS[(idx - 1 + total) % total]
  const next = ITEMS[(idx + 1) % total]
  const active = ITEMS[idx]
  const meta = [active.category, active.client_name ? 'Client work' : active.status].filter(Boolean).join(' · ')

  const onTouchStart = e => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Stage */}
      <div className="relative flex h-[440px] items-center justify-center overflow-hidden md:h-[520px]">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={`Previous: ${prev.title}`}
          className="absolute top-1/2 hidden h-[78%] aspect-[4/5] opacity-40 transition-opacity hover:opacity-70 md:block"
          style={{ left: '50%', transform: `translate(calc(-100% - ${PEEK_GAP}px), -50%)` }}
        >
          <img src={prev.image_url} alt="" className="h-full w-full rounded-xl border border-border object-cover object-top" />
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label={`Next: ${next.title}`}
          className="absolute top-1/2 hidden h-[78%] aspect-[4/5] opacity-40 transition-opacity hover:opacity-70 md:block"
          style={{ left: '50%', transform: `translate(${PEEK_GAP}px, -50%)` }}
        >
          <img src={next.image_url} alt="" className="h-full w-full rounded-xl border border-border object-cover object-top" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 h-full aspect-[4/5]"
          >
            <Link to={`/designs/${active.slug}`} className="group block h-full" aria-label={`${active.title} — how it was made`}>
              <img
                src={active.image_url}
                alt={active.title}
                className="h-full w-full rounded-2xl border border-border object-cover object-top shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption */}
      <div className="mx-auto mt-6 max-w-xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{meta}</div>
            <h3 className="mt-1 text-2xl font-bold">
              <Link to={`/designs/${active.slug}`} className="hover:text-primary transition-colors">{active.title}</Link>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{active.short_description}</p>
            <Link
              to={`/designs/${active.slug}`}
              className="group mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              How it was made <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls + dots */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous design"
          className="grid size-9 place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          {ITEMS.map((d, i) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${d.title}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next design"
          className="grid size-9 place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
