import { useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const btn =
  'inline-flex items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/80 transition-colors'

/**
 * Full-artwork viewer. `items` is a list of { src, caption }; `index` is the
 * one showing. Renders nothing when `open` is false. Esc closes, arrows page,
 * page scroll is locked while open.
 */
export default function DesignLightbox({ open, items, index, title, onIndex, onClose }) {
  const count = items?.length || 0
  const item = count ? items[Math.min(index, count - 1)] : null

  const step = useCallback(
    dir => count > 1 && onIndex((index + dir + count) % count),
    [count, index, onIndex]
  )

  useEffect(() => {
    if (!open) return
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose, step])

  // Warm the cache for the neighbouring pieces so paging feels instant.
  useEffect(() => {
    if (!open || count < 2) return
    ;[index + 1, index - 1].forEach(n => {
      const img = new Image()
      img.src = items[(n + count) % count].src
    })
  }, [open, items, index, count])

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-card"
            onClick={e => e.stopPropagation()}
          >
            {/* Artwork on a fixed dark matte in both themes, the way it would hang on a wall */}
            <div className="relative flex min-h-[40vh] items-center justify-center bg-[#121010]">
              <img
                key={item.src}
                src={item.src}
                alt={item.caption ? `${title} — ${item.caption}` : title}
                className="block max-h-[78vh] w-auto max-w-full object-contain"
              />
              <button type="button" onClick={onClose} aria-label="Close" autoFocus className={`absolute top-3 right-3 size-9 ${btn}`}>
                <X size={18} />
              </button>
              {count > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous" className={`absolute left-2 top-1/2 -translate-y-1/2 size-10 ${btn}`}>
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next" className={`absolute right-2 top-1/2 -translate-y-1/2 size-10 ${btn}`}>
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{title}</div>
                {item.caption && <div className="truncate text-xs text-muted-foreground">{item.caption}</div>}
              </div>
              {count > 1 && (
                <div aria-live="polite" className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {index + 1} / {count}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
