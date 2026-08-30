import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Walks through how a design was made.
 *
 *   mode 'stack'    — every step is a transparent layer laid over the previous
 *                     ones, so the artwork assembles in the frame.
 *   mode 'sequence' — every step replaces the frame (source → final, or a
 *                     system rolled across pieces).
 *
 * Plays itself once when scrolled into view, then hands control to the user.
 */
export default function DesignBuild({ build, title }) {
  const steps = useMemo(() => build?.steps || [], [build])
  const last = steps.length - 1
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState(reduced ? last : 0)
  const [touched, setTouched] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  const jump = useCallback(
    n => {
      setTouched(true)
      setCurrent(Math.max(0, Math.min(last, n)))
    },
    [last]
  )

  // Auto-play once: advance a step roughly every second until the final one.
  useEffect(() => {
    if (!inView || touched || reduced) return
    const id = setInterval(() => {
      setCurrent(c => {
        if (c >= last) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 1100)
    return () => clearInterval(id)
  }, [inView, touched, reduced, last])

  // Sequence mode: warm the next image so the crossfade has something to fade to.
  useEffect(() => {
    if (build?.mode !== 'sequence' || current >= last) return
    const img = new Image()
    img.src = steps[current + 1].src
  }, [build?.mode, current, last, steps])

  if (!steps.length) return null
  const stack = build.mode === 'stack'
  const step = steps[current]

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-5">
      {/* The frame */}
      <div className="lg:col-span-3">
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-border bg-[#121010]"
          style={{ aspectRatio: build.aspect || '4/5' }}
        >
          {stack ? (
            steps.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={i === current ? `${title} — ${s.label}` : ''}
                aria-hidden={i > current}
                className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
                style={{ opacity: i <= current ? 1 : 0 }}
              />
            ))
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={step.src}
                src={step.src}
                alt={`${title} — ${step.label}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </AnimatePresence>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => jump(current - 1)}
            disabled={current === 0}
            aria-label="Previous step"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-inherit"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="min-w-0 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary tabular-nums" aria-live="polite">
              Step {current + 1} of {steps.length}
            </div>
            <div className="truncate text-sm font-medium">{step.label}</div>
          </div>
          <button
            type="button"
            onClick={() => jump(current + 1)}
            disabled={current === last}
            aria-label="Next step"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-inherit"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* The steps */}
      <ol className="lg:col-span-2 space-y-1">
        {steps.map((s, i) => {
          const active = i === current
          const done = i < current
          return (
            <li key={s.src}>
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={active ? 'step' : undefined}
                className={
                  'flex w-full gap-3 rounded-lg border-l-2 px-3 py-2.5 text-left transition-colors ' +
                  (active
                    ? 'border-primary bg-primary/5'
                    : done
                      ? 'border-border/60 hover:bg-secondary/60'
                      : 'border-transparent hover:bg-secondary/60')
                }
              >
                <span
                  className={
                    'mt-0.5 font-mono text-xs tabular-nums ' + (active ? 'text-primary' : 'text-muted-foreground/70')
                  }
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className={'block text-sm font-semibold ' + (active || done ? '' : 'text-muted-foreground')}>{s.label}</span>
                  <span className={'mt-0.5 block text-sm leading-relaxed ' + (active ? 'text-foreground/80' : 'text-muted-foreground')}>{s.note}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
