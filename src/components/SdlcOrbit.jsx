import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Layers, Code2, CheckCircle2, Rocket, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

// Animated Software Development Life Cycle — a self-contained hero visual.
// Cycles through the stages, lighting each in turn, with a slowly rotating
// accent ring behind. Pure theme colours, so it follows light/dark + burgundy.
const STAGES = [
  { label: 'Plan', icon: Sparkles },
  { label: 'Design', icon: Layers },
  { label: 'Build', icon: Code2 },
  { label: 'Test', icon: CheckCircle2 },
  { label: 'Deploy', icon: Rocket },
  { label: 'Maintain', icon: Wrench },
]

const R = 40 // ring radius (% of box)

export default function SdlcOrbit() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduce) return
    const t = setInterval(() => setActive(a => (a + 1) % STAGES.length), 1700)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem] select-none">
      {/* ambient glow */}
      <div aria-hidden className="absolute inset-[14%] rounded-full bg-primary/15 blur-3xl" />

      {/* slowly rotating accent sweep */}
      <motion.div
        aria-hidden
        className="absolute inset-[6%] rounded-full"
        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--primary) 30%, transparent) 60deg, transparent 130deg)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
      />

      {/* dashed orbit path */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-primary/30">
        <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1.4 2.6" />
        <circle cx="50" cy="50" r={R + 6} fill="none" stroke="currentColor" strokeWidth="0.2" className="text-border" />
      </svg>

      {/* center hub */}
      <div className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-xl glow">
        <span className="text-[11px] font-bold tracking-[0.2em]">SDLC</span>
        <motion.span key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-0.5 text-[12px] font-medium opacity-90">
          {STAGES[active].label}
        </motion.span>
      </div>

      {/* stage nodes */}
      {STAGES.map((s, i) => {
        const a = (i / STAGES.length) * 2 * Math.PI - Math.PI / 2
        const left = 50 + R * Math.cos(a)
        const top = 50 + R * Math.sin(a)
        const on = i === active
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <motion.div
              animate={{ scale: on ? 1.18 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={cn(
                'flex size-12 items-center justify-center rounded-xl border transition-colors duration-300',
                on ? 'border-primary bg-primary text-primary-foreground glow' : 'border-border bg-card text-muted-foreground',
              )}
            >
              <Icon size={19} />
            </motion.div>
            <span className={cn('text-[11px] font-medium transition-colors', on ? 'text-primary' : 'text-muted-foreground')}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
