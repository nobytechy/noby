import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Palette, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '@/components/SEO'
import PageHero from '@/components/PageHero'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FALLBACK_DESIGNS, DESIGN_CATEGORIES } from '@/data/fallbackDesigns'

// Every piece the lightbox can page through. Cover-only designs get a
// one-item gallery so the viewer code has a single shape to deal with.
const piecesOf = d => (d.images?.length ? d.images : [{ src: d.image_url, caption: null }])

const lightboxButton =
  'inline-flex items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/80 transition-colors'

export default function Designs() {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null) // design open in the lightbox
  const [index, setIndex] = useState(0) // which of its pieces is showing
  const triggerRef = useRef(null) // card that opened the lightbox — focus returns here on close

  const visible = useMemo(
    () => (filter === 'all' ? FALLBACK_DESIGNS : FALLBACK_DESIGNS.filter(d => d.category === filter)),
    [filter]
  )

  const open = (d, e) => {
    triggerRef.current = e.currentTarget
    setActive(d)
    setIndex(0)
  }
  const close = useCallback(() => {
    setActive(null)
    triggerRef.current?.focus()
  }, [])

  const pieces = useMemo(() => (active ? piecesOf(active) : []), [active])
  const piece = pieces[index] || pieces[0]
  const step = useCallback(
    dir => setIndex(i => (pieces.length ? (i + dir + pieces.length) % pieces.length : 0)),
    [pieces.length]
  )

  // Keyboard: Esc closes, arrows page. Lock page scroll while open.
  useEffect(() => {
    if (!active) return
    const onKey = e => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [active, close, step])

  // Warm the cache for the neighbouring pieces so paging feels instant.
  useEffect(() => {
    if (pieces.length < 2) return
    ;[index + 1, index - 1].forEach(n => {
      const img = new Image()
      img.src = pieces[(n + pieces.length) % pieces.length].src
    })
  }, [pieces, index])

  return (
    <>
      <SEO
        title="Designs"
        path="/designs"
        description="Graphic design work by Noby — posters, flyers, brand kits, print editorial and social campaigns, from concept to print-ready artwork."
      />

      <PageHero
        eyebrow="Graphic design"
        title="Designs"
        subtitle="Posters, flyers, brand identities and print editorial — client work alongside clearly labelled spec and template pieces, each taken from concept to print-ready artwork."
      />

      <section className="container-x py-16 md:py-24">
        <div className="mt-2 flex flex-wrap gap-2">
          {DESIGN_CATEGORIES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              aria-pressed={filter === t}
              className={
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                (filter === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary')
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visible.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              No designs match this filter.
            </div>
          ) : visible.map((d, i) => {
            const count = piecesOf(d).length
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05 }}
                className="h-full"
              >
                <button
                  type="button"
                  onClick={e => open(d, e)}
                  aria-haspopup="dialog"
                  className="group block h-full w-full text-left"
                >
                  <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
                    <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                      {d.image_url ? (
                        <img
                          src={d.image_url}
                          alt={d.title}
                          loading={i < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Palette size={32} /></div>
                      )}
                      {count > 1 && (
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-background/90 text-foreground border border-border">
                            {count} {d.count_noun || 'pieces'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{d.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{d.short_description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(d.tags || []).slice(0, 3).map(t => (
                          <Badge key={t} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Lightbox — one tap shows the full artwork; multi-piece projects page through every piece */}
      <AnimatePresence>
        {active && piece && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card"
              onClick={e => e.stopPropagation()}
            >
              {/* Artwork sits on a fixed dark matte in both themes, the way it would on a wall */}
              <div className="relative flex min-h-[40vh] items-center justify-center bg-[#121010]">
                <img
                  key={piece.src}
                  src={piece.src}
                  alt={piece.caption ? `${active.title} — ${piece.caption}` : active.title}
                  className="block max-h-[62vh] w-auto max-w-full object-contain"
                />

                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  autoFocus
                  className={`absolute top-3 right-3 size-9 ${lightboxButton}`}
                >
                  <X size={18} />
                </button>

                {pieces.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous piece"
                      className={`absolute left-2 top-1/2 -translate-y-1/2 size-10 ${lightboxButton}`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next piece"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 size-10 ${lightboxButton}`}
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div
                      aria-live="polite"
                      className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium tracking-wider text-white/90 tabular-nums"
                    >
                      {index + 1} / {pieces.length}
                    </div>
                  </>
                )}
              </div>

              <div className="overflow-y-auto p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight">{active.title}</h3>
                    {piece.caption && <p className="mt-1 text-sm font-medium">{piece.caption}</p>}
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{active.short_description}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {[active.category, active.year, active.client_name && `Client: ${active.client_name}`].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {active.kit_url && (
                    <a
                      href={active.kit_url}
                      download
                      className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity glow shrink-0"
                    >
                      <Download size={14} /> Kit
                    </a>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(active.tags || []).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
