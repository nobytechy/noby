import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Rocket, Layers, Sparkles } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { getProfile, listProjects, listServices, listTestimonials } from '@/lib/queries'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [featured, setFeatured] = useState([])
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      listProjects({ featuredOnly: true }).catch(() => []),
      listServices().catch(() => []),
      listTestimonials().catch(() => []),
    ]).then(([p, fp, sv, tt]) => {
      setProfile(p); setFeatured(fp.slice(0, 3)); setServices(sv); setTestimonials(tt.slice(0, 3))
    })
  }, [])

  const personJsonLd = profile ? {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name,
    jobTitle: profile.headline,
    description: profile.tagline,
    email: profile.email,
    url: import.meta.env.VITE_SITE_URL,
    sameAs: Object.values(profile.socials || {}).filter(Boolean),
  } : null

  return (
    <>
      <SEO path="/" jsonLd={personJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.7_0.22_264/0.3),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.7_0.22_320/0.3),transparent_60%)]" />
        </div>
        <div className="container-x py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-6">
              <Sparkles size={12} className="mr-1.5" /> Available for new projects
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Hi, I'm <span className="gradient-text">{profile?.full_name || 'Noby'}</span>.
              <br />
              {profile?.headline || 'Full-Stack Developer.'}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              {profile?.tagline || 'I build modern, fast web applications that help businesses grow online.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">{profile?.hire_cta_text || 'Hire Me'} <ArrowRight size={18} /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/projects">View Projects</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services teaser */}
      {services.length > 0 && (
        <section className="container-x py-20 border-t border-border">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-sm text-muted-foreground">What I do</div>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">Services</h2>
            </div>
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground hidden md:inline-flex items-center gap-1">
              All services <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 6).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Layers size={18} />
                    </div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured projects */}
      <section className="container-x py-20 border-t border-border">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-sm text-muted-foreground">Selected work</div>
            <h2 className="text-3xl md:text-4xl font-bold mt-1">Featured Projects</h2>
          </div>
          <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground hidden md:inline-flex items-center gap-1">
            All projects <ArrowRight size={14} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No featured projects yet. Add some from the admin panel.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
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
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
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
        )}
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-x py-20 border-t border-border">
          <div className="text-center mb-12">
            <div className="text-sm text-muted-foreground">Client words</div>
            <h2 className="text-3xl md:text-4xl font-bold mt-1">What clients say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.id} className="p-6">
                <p className="text-sm">"{t.content}"</p>
                <div className="mt-4 flex items-center gap-3">
                  {t.avatar_url && <img src={t.avatar_url} alt="" className="size-9 rounded-full object-cover" />}
                  <div>
                    <div className="text-sm font-semibold">{t.client_name}</div>
                    <div className="text-xs text-muted-foreground">{t.client_role}{t.client_company ? `, ${t.client_company}` : ''}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-x py-20 border-t border-border">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-10 md:p-16 text-center">
          <Rocket className="mx-auto size-10 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mt-4">Have a project in mind?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            I take on a limited number of direct-client projects each quarter. Tell me about yours.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/contact">Start a Project <ArrowRight size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
