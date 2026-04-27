import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  // SVG circumference for the progress ring (r=18 => 2πr ≈ 113.1)
  const dashOffset = useTransform(scrollYProgress, [0, 1], [113, 0])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={goTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          aria-label="Back to top"
          className="fixed right-5 md:right-6 bottom-24 md:bottom-28 z-40 group grid place-items-center size-12 rounded-full bg-card border border-border text-foreground hover:border-primary hover:text-primary transition-colors shadow-lg hover:shadow-[0_8px_24px_-6px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
        >
          {/* Scroll-progress ring */}
          <svg className="absolute inset-0" viewBox="0 0 40 40" aria-hidden>
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" fill="none" />
            <motion.circle
              cx="20" cy="20" r="18"
              stroke="var(--primary)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="113"
              style={{ strokeDashoffset: dashOffset, transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </svg>
          <ArrowUp size={18} className="relative z-10 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
