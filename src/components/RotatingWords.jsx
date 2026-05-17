import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function RotatingWords({ words, interval = 5000, className = '' }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % words.length), interval)
    return () => clearInterval(t)
  }, [words.length, interval])
  return (
    <span className={`relative inline-block align-baseline ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="inline-block gradient-text"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
