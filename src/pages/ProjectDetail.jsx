import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getProjectBySlug } from '@/lib/queries'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null); setProject(null)
    getProjectBySlug(slug).then(setProject).catch(setError)
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
          <ArrowLeft size={16} /> All Projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(project.tags || []).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.short_description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.live_url && (
              <Button asChild>
                <a href={project.live_url} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} /> Live Site
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
        </motion.div>

        {project.cover_image_url && (
          <div className="mt-10 rounded-2xl overflow-hidden border border-border">
            <img src={project.cover_image_url} alt={project.title} className="w-full" />
          </div>
        )}

        <div className="mt-10 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="text-base leading-relaxed whitespace-pre-line text-muted-foreground">
              {project.long_description || project.short_description}
            </div>
          </div>
          <aside>
            <div className="rounded-lg border border-border p-5">
              <div className="text-sm font-semibold mb-3">Tech Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {(project.tech_stack || []).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
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
