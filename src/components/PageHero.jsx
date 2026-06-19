import { motion } from 'framer-motion'

// Shared page intro — eyebrow + big uppercase Syne heading + subtitle, on a
// subtle grid background. Gives every front page the same premium, spacious top.
export default function PageHero({ eyebrow, title, subtitle, children, align = 'left' }) {
  const centered = align === 'center'
  return (
    <section className="relative border-b border-border">
      <div aria-hidden className="absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className={`container-x py-20 md:py-28 ${centered ? 'text-center' : ''}`}>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary"
          >
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[1.04] ${centered ? 'mx-auto max-w-4xl' : 'max-w-4xl'}`}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mt-5 text-base md:text-lg text-muted-foreground leading-relaxed ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
