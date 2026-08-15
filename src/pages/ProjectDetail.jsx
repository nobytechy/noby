import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Building2 } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { GithubIcon } from '@/components/BrandIcons'
import { getProjectBySlug } from '@/lib/queries'
import { fallbackProjectBySlug } from '@/data/fallbackProjects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null); setProject(null)
    getProjectBySlug(slug)
      .then((row) => {
        if (row) return setProject(row)
        const fb = fallbackProjectBySlug(slug)
        fb ? setProject(fb) : setError(new Error('not found'))
      })
      .catch(() => {
        const fb = fallbackProjectBySlug(slug)
        fb ? setProject(fb) : setError(new Error('not found'))
      })
  }, [slug])

  if (error) {
    return (
      <section className="container-x py-24 text-center">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <p className="mt-2 text-muted-foreground">The project you're looking for doesn't exist.</p>
        <Button asChild className="mt-6"><Link to="/projects">Back to Projects</Link></Button>
      </section>
    )
  }
  if (!project) {
    return (
      <section className="container-x py-24 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </section>
    )
  }

  return (
    <>
      <SEO
        title={project.title}
        path={`/projects/${project.slug}`}
        description={project.short_description}
        image={project.cover_image_url}
      />

      <article className="container-x py-12 md:py-20">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> All projects
        </Link>

        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(project.tags || []).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{project.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.short_description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {project.client_name && (
              <span className="inline-flex items-center gap-2"><Building2 size={14} /> {project.client_name}</span>
            )}
            {project.year_completed && (
              <span className="inline-flex items-center gap-2"><Calendar size={14} /> {project.year_completed}</span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.live_url && (
              <Button asChild className="glow">
                <a href={project.live_url} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} /> Visit live site
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button asChild variant="outline">
                <a href={project.github_url} target="_blank" rel="noreferrer">
                  <GithubIcon size={16} /> Source
                </a>
              </Button>
            )}
          </div>
        </motion.header>

        {project.cover_image_url && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-10 rounded-2xl overflow-hidden border border-border"
          >
            <img src={project.cover_image_url} alt={project.title} className="w-full" />
          </motion.div>
        )}

        <div className="mt-12 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Case study</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <CaseStudyBody markdown={project.long_description || project.short_description} />
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="text-sm font-semibold mb-3">Tech stack</div>
              <div className="flex flex-wrap gap-1.5">
                {(project.tech_stack || []).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            </div>
            <div className="rounded-xl border border-primary/30 p-5 bg-gradient-to-br from-primary/10 via-card to-card">
              <div className="text-sm font-semibold">Need something similar?</div>
              <p className="mt-1 text-sm text-muted-foreground">Most projects start with a free 20-min discovery call.</p>
              <Button asChild className="mt-4 w-full glow">
                <Link to="/contact">Book a call <ArrowRight size={14} /></Link>
              </Button>
            </div>
          </aside>
        </div>

        {Array.isArray(project.screenshots) && project.screenshots.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {project.screenshots.map((src, i) => (
              <img key={i} src={src} alt="" className="rounded-lg border border-border" />
            ))}
          </div>
        )}
      </article>
    </>
  )
}

/**
 * Render a small subset of markdown for case study bodies:
 * - **bold**
 * - blank line = paragraph break
 * - lines starting with "•" or "-" = list items
 */
function CaseStudyBody({ markdown }) {
  const text = markdown || ''
  // Split paragraphs by blank lines
  const blocks = text.split(/\n\s*\n/)
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(Boolean)
        const isList = lines.every(l => /^\s*[•\-]/.test(l))
        if (isList) {
          return (
            <ul key={i} className="my-3 space-y-1.5">
              {lines.map((l, j) => (
                <li key={j} className="text-base leading-relaxed">
                  <Inline text={l.replace(/^\s*[•\-]\s*/, '')} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-base leading-relaxed my-3">
            <Inline text={lines.join(' ')} />
          </p>
        )
      })}
    </>
  )
}

function Inline({ text }) {
  // Replace **bold** with <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="text-foreground font-semibold">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  )
}
