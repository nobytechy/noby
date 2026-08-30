import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, ExternalLink, ChevronDown } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import SEO from '@/components/SEO'
import PageHero from '@/components/PageHero'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listProjects } from '@/lib/queries'
import { FALLBACK_PROJECTS } from '@/data/fallbackProjects'

const TAGS_BEFORE_MORE = 7 // 'all' + 6 tags — one comfortable row on a phone

export default function Projects() {
  const [dbProjects, setDbProjects] = useState(null) // null = still loading
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    listProjects()
      .then(rows => setDbProjects(rows ?? []))
      .catch(() => setDbProjects([]))
  }, [])

  /**
   * The hardcoded catalogue is the portfolio; the database is additive.
   *
   * The built-in projects always show, in their curated order, so the page
   * is never empty and never depends on Supabase being reachable. Anything
   * posted through the admin panel is appended below them. A DB row sharing
   * a slug with a built-in project is treated as an edit of it — it takes
   * that project's place rather than appearing twice.
   */
  const projects = useMemo(() => {
    const rows = dbProjects || []
    const edits = new Map(rows.map(r => [r.slug, r]))
    const builtInSlugs = new Set(FALLBACK_PROJECTS.map(p => p.slug))
    const builtIn = FALLBACK_PROJECTS.map(p => edits.get(p.slug) || p)
    const added = rows.filter(r => !builtInSlugs.has(r.slug))
    return [...builtIn, ...added]
  }, [dbProjects])

  // Ranked by how many projects carry the tag (then alphabetically), so the
  // filters that actually narrow the grid sit in the visible row.
  const tags = useMemo(() => {
    const counts = new Map()
    projects.forEach(p => (p.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)))
    const ranked = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t)
    return ['all', ...ranked]
  }, [projects])

  // A chip can outlive its tag once DB rows land — fall back to 'all' rather
  // than showing an empty grid for a filter that no longer exists.
  const active = tags.includes(filter) ? filter : 'all'
  const visible = active === 'all' ? projects : projects.filter(p => (p.tags || []).includes(active))

  // Eighteen chips is a wall, so only the top few show until asked. The
  // selected tag is always in the row, even when it ranks below the cut.
  const [showAllTags, setShowAllTags] = useState(false)
  const shownTags = useMemo(() => {
    if (showAllTags) return tags
    const head = tags.slice(0, TAGS_BEFORE_MORE)
    return head.includes(active) ? head : [...head, active]
  }, [tags, showAllTags, active])
  const hiddenCount = tags.length - shownTags.length

  return (
    <>
      <SEO title="Projects" path="/projects" description="Selected web development projects by Noby." />

      <PageHero
        eyebrow="Portfolio"
        title="Projects"
        subtitle="A selection of work I've shipped — production apps solving real Zimbabwean workflows end to end."
      />

      <section className="container-x py-16 md:py-24">
        {tags.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {shownTags.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                  (active === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary')
                }
                aria-pressed={active === t}
              >
                {t}
              </button>
            ))}

            {(hiddenCount > 0 || showAllTags) && (
              <button
                type="button"
                onClick={() => setShowAllTags(v => !v)}
                aria-expanded={showAllTags}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {showAllTags ? 'Fewer filters' : `${hiddenCount} more`}
                <ChevronDown size={13} className={'transition-transform ' + (showAllTags ? 'rotate-180' : '')} />
              </button>
            )}
          </div>
        )}

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              {active === 'all' ? 'No projects to show yet.' : `No projects tagged “${active}”.`}
            </div>
          ) : visible.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
            >
              <Link to={`/projects/${p.slug}`} className="group block">
                <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
                  <div className="aspect-video bg-muted overflow-hidden">
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Code2 size={32} /></div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.github_url && <GithubIcon size={16} className="text-muted-foreground" />}
                        {p.live_url && <ExternalLink size={16} className="text-muted-foreground" />}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(p.tech_stack || []).slice(0, 4).map(t => (
                        <Badge key={t} variant="secondary">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
