import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { fallbackProjectBySlug } from '@/data/fallbackProjects'

/**
 * The three projects that lead the landing page.
 *
 * A static grid rather than a carousel, deliberately: real product
 * screenshots are landscape and scannable, so a hiring manager sees all
 * three at once with no waiting. The portrait design work keeps the
 * carousel, which also stops the two sections reading as one component
 * rendered twice.
 *
 * Data comes from fallbackProjects (one source of truth for slug, cover,
 * links and tech); only the one-line pitch is curated here.
 */
const FEATURED = [
  { slug: 'manishapay', tagline: 'Payment gateway aggregator — solo-built' },
  { slug: 'manishaai', tagline: 'Multilingual payments AI assistant' },
  { slug: 'ridgecrest', tagline: 'Primary-school information system' },
]

const host = url => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : null)

export default function FeaturedProjects() {
  const projects = FEATURED.map(f => ({ ...f, ...fallbackProjectBySlug(f.slug) })).filter(p => p.title)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <motion.div
          key={p.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className="h-full"
        >
          <Card className="group flex h-full flex-col overflow-hidden transition-colors hover:border-primary/50">
            <Link to={`/projects/${p.slug}`} className="flex flex-1 flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={p.cover_image_url}
                  alt={`${p.title} — product screenshot`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{p.tagline}</div>
                <h3 className="mt-1.5 text-lg font-semibold transition-colors group-hover:text-primary">
                  {p.title.split('—')[0].trim()}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.short_description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(p.tech_stack || []).slice(0, 4).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Case study <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Link>
            {p.live_url && (
              <div className="border-t border-border px-5 py-3">
                <a
                  href={p.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink size={12} /> {host(p.live_url)}
                </a>
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
