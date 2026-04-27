import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import SEO from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listProjects } from '@/lib/queries'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => { listProjects().then(setProjects).catch(() => {}) }, [])

  const tags = useMemo(() => {
    const set = new Set()
    projects.forEach(p => (p.tags || []).forEach(t => set.add(t)))
    return ['all', ...Array.from(set)]
  }, [projects])

  const visible = filter === 'all' ? projects : projects.filter(p => (p.tags || []).includes(filter))

  return (
    <>
      <SEO title="Projects" path="/projects" description="Selected web development projects by Noby." />

      <section className="container-x py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="text-sm text-muted-foreground">Portfolio</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Projects</h1>
          <p className="mt-4 text-lg text-muted-foreground">A selection of work I've shipped.</p>
        </motion.div>

        {tags.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                  (filter === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary')
                }
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              No projects match this filter.
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
