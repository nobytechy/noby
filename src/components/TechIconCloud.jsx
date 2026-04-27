import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Curated to match Noby's actual stack. simple-icons slugs.
const ALL_ICONS = [
  { slug: 'php',          name: 'PHP',        color: '777BB4' },
  { slug: 'laravel',      name: 'Laravel',    color: 'FF2D20' },
  { slug: 'python',       name: 'Python',     color: '3776AB' },
  { slug: 'django',       name: 'Django',     color: '092E20' },
  { slug: 'javascript',   name: 'JavaScript', color: 'F7DF1E' },
  { slug: 'typescript',   name: 'TypeScript', color: '3178C6' },
  { slug: 'react',        name: 'React',      color: '61DAFB' },
  { slug: 'vuedotjs',     name: 'Vue.js',     color: '4FC08D' },
  { slug: 'nodedotjs',    name: 'Node.js',    color: '5FA04E' },
  { slug: 'flutter',      name: 'Flutter',    color: '02569B' },
  { slug: 'tailwindcss',  name: 'Tailwind',   color: '06B6D4' },
  { slug: 'bootstrap',    name: 'Bootstrap',  color: '7952B3' },
  { slug: 'wordpress',    name: 'WordPress',  color: '21759B' },
  { slug: 'mysql',        name: 'MySQL',      color: '4479A1' },
  { slug: 'postgresql',   name: 'PostgreSQL', color: '4169E1' },
  { slug: 'mongodb',      name: 'MongoDB',    color: '47A248' },
  { slug: 'redis',        name: 'Redis',      color: 'DC382D' },
  { slug: 'docker',       name: 'Docker',     color: '2496ED' },
  { slug: 'git',          name: 'Git',        color: 'F05032' },
  { slug: 'github',       name: 'GitHub',     color: '181717' },
  { slug: 'graphql',      name: 'GraphQL',    color: 'E10098' },
  { slug: 'whatsapp',     name: 'WhatsApp',   color: '25D366' },
  { slug: 'stripe',       name: 'Stripe',     color: '008CDD' },
  { slug: 'supabase',     name: 'Supabase',   color: '3ECF8E' },
  { slug: 'figma',        name: 'Figma',      color: 'F24E1E' },
  { slug: 'vite',         name: 'Vite',       color: '646CFF' },
]

const FADE_INTERVAL_MS = 2400  // how often we cycle the focused icon

export default function TechIconCloud({ count = 18 }) {
  const visible = ALL_ICONS.slice(0, count)
  const [focusIdx, setFocusIdx] = useState(0)

  // Cycle a "focus" icon — that one gets temporarily emphasized (subtle pulse + glow)
  useEffect(() => {
    const t = setInterval(() => {
      setFocusIdx(i => (i + 1 + Math.floor(Math.random() * 3)) % visible.length)
    }, FADE_INTERVAL_MS)
    return () => clearInterval(t)
  }, [visible.length])

  return (
    <section className="container-x py-20 relative">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-sm text-primary font-medium">The toolkit</div>
        <h2 className="text-3xl md:text-5xl font-bold mt-2">Built with what works</h2>
        <p className="mt-3 text-muted-foreground">
          Production-grade languages, frameworks, and integrations I've shipped to real users.
          Hover any icon to see the name.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
        {visible.map((icon, i) => (
          <TechIcon key={icon.slug} icon={icon} index={i} focused={focusIdx === i} />
        ))}
      </div>
    </section>
  )
}

function TechIcon({ icon, index, focused }) {
  const [hover, setHover] = useState(false)
  // Each icon gets its own breathing rhythm, varied so they don't all pulse in sync
  const breath = 6 + (index % 5) * 0.6
  const delay = (index * 0.07) % 2

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 220, damping: 18 }}
      className="relative aspect-square"
    >
      <motion.div
        className="relative h-full w-full rounded-2xl border border-border bg-card grid place-items-center cursor-default overflow-hidden"
        animate={{
          opacity: focused ? 1 : [0.65, 1, 0.65],
          scale:   focused ? 1.05 : 1,
          borderColor: focused ? 'var(--primary)' : 'var(--border)',
        }}
        transition={{
          opacity:  { duration: breath, delay, repeat: Infinity, ease: 'easeInOut' },
          scale:    { type: 'spring', stiffness: 220, damping: 18 },
          borderColor: { duration: 0.3 },
        }}
      >
        {/* glow when focused */}
        {focused && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: '0 0 24px -4px color-mix(in oklab, var(--primary) 60%, transparent), inset 0 0 24px -8px color-mix(in oklab, var(--primary) 40%, transparent)',
            }}
          />
        )}

        <img
          src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`}
          alt={icon.name}
          loading="lazy"
          width={32}
          height={32}
          className="h-8 w-8 md:h-9 md:w-9 transition-transform duration-300 group-hover:scale-110"
          style={{ filter: focused ? 'drop-shadow(0 0 12px rgba(0,255,170,0.4))' : 'none' }}
        />
      </motion.div>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground text-background px-2.5 py-1 text-xs font-medium shadow-lg z-10 pointer-events-none"
          >
            {icon.name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
