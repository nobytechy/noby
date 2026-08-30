import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, ArrowRight, Wrench, CheckCircle2 } from 'lucide-react'

const SESSION_KEY = 'noby:products-banner-dismissed'
const MIN_DWELL_MS = 15000   // never interrupt someone still reading the hero
const SCROLL_TRIGGER = 0.65  // ...and only once they've read past the work sections

const bullets = [
  'Full source code, yours forever',
  'One-time payment via WhatsApp',
  'Deploy in days, not months',
]

/**
 * Ready-made-systems offer.
 *
 * Triggered by engagement, not a timer: it waits until the visitor has both
 * spent a minimum dwell time on the page and scrolled past the work sections.
 * A hiring manager reading the hero is never interrupted; someone who has
 * scrolled the whole page is far likelier to actually be shopping. Dismissal
 * is remembered for the session.
 */
export default function ProductsBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY) === '1') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const readyAt = Date.now() + MIN_DWELL_MS
    let done = false

    const onScroll = () => {
      if (done || Date.now() < readyAt) return
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 1
      if (progress < SCROLL_TRIGGER) return
      done = true
      window.removeEventListener('scroll', onScroll)
      setOpen(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // private mode / storage disabled — the banner just reappears next visit
    }
    setOpen(false)
  }, [])

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, dismiss])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-labelledby="products-banner-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="alive relative w-full max-w-xl rounded-2xl border border-primary/30 bg-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 size-8 rounded-full grid place-items-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="p-7 md:p-9">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Package size={22} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">New</div>
                  <div className="text-xs text-muted-foreground">Ready-made systems</div>
                </div>
              </div>

              <h2 id="products-banner-title" className="mt-5 text-2xl md:text-3xl font-bold leading-tight">
                Skip the build —{' '}
                <span className="gradient-text">buy a ready-made system</span>
              </h2>
              <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
                HR, hospital, school, hotel, e-commerce and more. Tested,
                production-grade systems you can deploy in days. Don't see what you
                need? I'll build it custom.
              </p>

              <ul className="mt-5 space-y-2">
                {bullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/products"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold glow shine flex-1"
                >
                  Browse products <ArrowRight size={14} />
                </Link>
                <Link
                  to="/contact"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary flex-1"
                >
                  <Wrench size={14} /> Request a custom build
                </Link>
              </div>

              <button
                onClick={dismiss}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                No thanks, just looking
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
