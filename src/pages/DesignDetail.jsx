import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, ExternalLink, Calendar, Building2, BadgeCheck, Ruler, Maximize2,
  FolderOpen, FileText, Image as ImageIcon, Layers, Camera,
} from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import DesignBuild from '@/components/DesignBuild'
import DesignLightbox from '@/components/DesignLightbox'
import { FALLBACK_DESIGNS, fallbackDesignBySlug } from '@/data/fallbackDesigns'

const fmtSize = b => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

const FILE_KINDS = {
  final: { icon: ImageIcon, label: 'Final' },
  layer: { icon: Layers, label: 'Layer' },
  source: { icon: Camera, label: 'Source' },
  doc: { icon: FileText, label: 'Notes' },
}

export default function DesignDetail() {
  const { slug } = useParams()
  const design = fallbackDesignBySlug(slug)
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0 })

  // The router keeps the previous scroll position; a case study should open at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  const pieces = useMemo(
    () => (design?.images?.length ? design.images : design ? [{ src: design.image_url, caption: null }] : []),
    [design]
  )
  const openPieces = i => setLightbox({ open: true, items: pieces, index: i })
  const openFile = f => setLightbox({ open: true, items: [{ src: f.preview, caption: f.name }], index: 0 })
  const closeLightbox = () => setLightbox(s => ({ ...s, open: false }))

  if (!design) {
    return (
      <section className="container-x py-24 text-center">
        <h1 className="text-3xl font-bold">Design not found</h1>
        <p className="mt-2 text-muted-foreground">The design you're looking for doesn't exist.</p>
        <Button asChild className="mt-6"><Link to="/designs">Back to Designs</Link></Button>
      </section>
    )
  }

  const idx = FALLBACK_DESIGNS.findIndex(d => d.slug === design.slug)
  const prev = FALLBACK_DESIGNS[(idx - 1 + FALLBACK_DESIGNS.length) % FALLBACK_DESIGNS.length]
  const next = FALLBACK_DESIGNS[(idx + 1) % FALLBACK_DESIGNS.length]
  const stack = design.build?.mode === 'stack'

  return (
    <>
      <SEO
        title={design.title}
        path={`/designs/${design.slug}`}
        description={design.short_description}
        image={design.image_url}
      />

      <article className="container-x py-12 md:py-20">
        <Link to="/designs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> All designs
        </Link>

        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(design.tags || []).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{design.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{design.short_description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {design.client_name && <span className="inline-flex items-center gap-2"><Building2 size={14} /> {design.client_name}</span>}
            {design.year && <span className="inline-flex items-center gap-2"><Calendar size={14} /> {design.year}</span>}
            {design.status && <span className="inline-flex items-center gap-2"><BadgeCheck size={14} /> {design.status}</span>}
            {design.format && <span className="inline-flex items-center gap-2"><Ruler size={14} /> {design.format}</span>}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => openPieces(0)} className="glow">
              <Maximize2 size={16} /> View artwork
            </Button>
            {design.live_url && (
              <Button asChild variant="outline">
                <a href={design.live_url} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} /> Visit live site
                </a>
              </Button>
            )}
          </div>
        </motion.header>

        {/* The artwork — one piece large, or every piece of a set */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-[#121010] p-3 sm:p-5"
        >
          {pieces.length === 1 ? (
            <button type="button" onClick={() => openPieces(0)} className="group mx-auto block" aria-label="View artwork full size">
              <img src={pieces[0].src} alt={design.title} className="mx-auto block max-h-[80vh] w-auto max-w-full transition-transform duration-500 group-hover:scale-[1.01]" />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pieces.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => openPieces(i)}
                  className="group flex flex-col gap-2 text-left"
                  aria-label={`View ${p.caption || design.title} full size`}
                >
                  <span className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg bg-black/40">
                    <img
                      src={p.src}
                      alt={p.caption || design.title}
                      loading={i < 6 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                  {p.caption && <span className="px-0.5 text-xs leading-snug text-white/70 group-hover:text-white/95">{p.caption}</span>}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* How it was built */}
        {design.build?.steps?.length > 0 && (
          <section id="how-it-was-built" className="mt-16 scroll-mt-24">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">The journey</div>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold">How it was built</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {stack
                ? 'These are the actual layers from the working file, in order. Step through them and watch the artwork assemble.'
                : 'Step through the process from the starting material to the finished piece.'}
            </p>
            <div className="mt-8">
              <DesignBuild build={design.build} title={design.title} />
            </div>
          </section>
        )}

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2 space-y-10">
            {design.concept && (
              <section>
                <h2 className="text-2xl font-bold">The thinking</h2>
                <p className="mt-3 text-base leading-relaxed text-foreground/85">{design.concept}</p>
              </section>
            )}

            {design.rules?.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold">Rules that shaped it</h3>
                <ul className="mt-3 space-y-2">
                  {design.rules.map(r => (
                    <li key={r} className="flex gap-3 text-base leading-relaxed">
                      <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {design.handover?.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold">Before it ships</h3>
                <p className="mt-1 text-sm text-muted-foreground">What the client confirms before this goes to print or paid promotion.</p>
                <ul className="mt-3 space-y-2">
                  {design.handover.map(h => (
                    <li key={h} className="flex gap-3 text-base leading-relaxed">
                      <BadgeCheck size={16} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {design.credits?.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold">Credits &amp; licences</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {design.credits.map(c => <li key={c}>{c}</li>)}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            {design.palette?.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 text-sm font-semibold">Palette</div>
                <ul className="space-y-2.5">
                  {design.palette.map(c => (
                    <li key={c.hex + c.name} className="flex items-center gap-3">
                      <span className="size-9 shrink-0 rounded-md border border-border/60 shadow-inner" style={{ backgroundColor: c.hex }} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="text-sm font-medium">{c.name}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">{c.hex}</span>
                        </span>
                        <span className="block text-xs text-muted-foreground">{c.job}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {design.type?.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 text-sm font-semibold">Type</div>
                <ul className="space-y-2.5">
                  {design.type.map(t => (
                    <li key={t.face}>
                      <div className="text-sm font-medium">{t.face}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {design.files?.files?.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <FolderOpen size={15} className="text-primary" />
                  <span className="truncate font-mono text-xs">{design.files.folder}/</span>
                  <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{design.files.files.length} files</span>
                </div>
                <ul className="py-1">
                  {design.files.files.map((f, i, arr) => {
                    const kind = FILE_KINDS[f.kind] || FILE_KINDS.source
                    const Icon = kind.icon
                    const isLast = i === arr.length - 1
                    const row = (
                      <>
                        <span className="w-4 shrink-0 select-none font-mono text-xs text-muted-foreground/50" aria-hidden="true">{isLast ? '└' : '├'}</span>
                        <Icon size={14} className={'shrink-0 ' + (f.kind === 'final' ? 'text-primary' : 'text-muted-foreground')} aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-mono text-xs">{f.name}</span>
                          {f.note && <span className="block truncate text-[11px] text-muted-foreground">{f.note}</span>}
                        </span>
                        <span className="hidden shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground/70 sm:block">{kind.label}</span>
                        <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">{fmtSize(f.size)}</span>
                      </>
                    )
                    const cls = 'flex w-full items-center gap-2 px-4 py-1.5 text-left'
                    if (f.preview) {
                      return (
                        <li key={f.name}>
                          <button type="button" onClick={() => openFile(f)} className={cls + ' hover:bg-secondary/70 transition-colors'} title={`Preview ${f.name}`}>{row}</button>
                        </li>
                      )
                    }
                    if (f.kind === 'doc') {
                      return (
                        <li key={f.name}>
                          <a href="#how-it-was-built" className={cls + ' hover:bg-secondary/70 transition-colors'} title="Read the notes above">{row}</a>
                        </li>
                      )
                    }
                    return <li key={f.name} className={cls + ' opacity-70'}>{row}</li>
                  })}
                </ul>
                <div className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                  The working kit as delivered — finals, layers, sources and notes. Tap a file to preview it.
                </div>
              </div>
            )}

            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5">
              <div className="text-sm font-semibold">Need something similar?</div>
              <p className="mt-1 text-sm text-muted-foreground">Most projects start with a free 20-min discovery call.</p>
              <Button asChild className="glow mt-4 w-full">
                <Link to="/contact">Book a call <ArrowRight size={14} /></Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* Prev / next */}
        <nav className="mt-16 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between" aria-label="Other designs">
          <Link to={`/designs/${prev.slug}`} className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span><span className="text-xs uppercase tracking-wider">Previous</span><span className="block font-medium text-foreground group-hover:text-primary">{prev.title}</span></span>
          </Link>
          <Link to={`/designs/${next.slug}`} className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary sm:text-right">
            <span><span className="text-xs uppercase tracking-wider">Next</span><span className="block font-medium text-foreground group-hover:text-primary">{next.title}</span></span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </nav>
      </article>

      <DesignLightbox
        open={lightbox.open}
        items={lightbox.items}
        index={lightbox.index}
        title={design.title}
        onIndex={i => setLightbox(s => ({ ...s, index: i }))}
        onClose={closeLightbox}
      />
    </>
  )
}
