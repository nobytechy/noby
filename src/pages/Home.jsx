import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Rocket, Layers, CheckCircle2, Globe, Wrench, Smartphone } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import RotatingWords from '@/components/RotatingWords'
import AnimatedBlobs from '@/components/AnimatedBlobs'
import Marquee from '@/components/Marquee'
import { getProfile, listProjects, listServices, listSkills, listTestimonials } from '@/lib/queries'

const stats = [
  { value: '7+', label: 'Years experience' },
  { value: '12+', label: 'Projects shipped' },
  { value: '30+', label: 'Branches served' },
  { value: '24h', label: 'Response time' },
]

const serviceIcons = { web: Globe, mobile: Smartphone, fullstack: Layers, default: Code2 }

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 26 } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [featured, setFeatured] = useState([])
  const [services, setServices] = useState([])
  const [skills, setSkills] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      listProjects({ featuredOnly: true }).catch(() => []),
      listServices().catch(() => []),
      listSkills().catch(() => []),
      listTestimonials().catch(() => []),
    ]).then(([p, fp, sv, sk, tt]) => {
      setProfile(p); setFeatured(fp.slice(0, 3)); setServices(sv); setSkills(sk); setTestimonials(tt.slice(0, 3))
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

  const techList = skills.length
    ? skills.slice(0, 14).map(s => s.name)
    : ['PHP', 'Laravel', 'Python', 'Django', 'JavaScript', 'React', 'Vue.js', 'Flutter', 'Node.js', 'MySQL', 'PostgreSQL', 'Tailwind CSS']

  return (
    <>
      <SEO path="/" jsonLd={personJsonLd} />

      {/* Hero */}
      <section className="relative">
        <AnimatedBlobs />
        <div className="container-x py-24 md:py-36">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-pulse">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                Available for new projects
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Hi, I'm <span className="gradient-text">{profile?.full_name || 'Noby'}</span>.
              <br />
              <span className="text-foreground">I build </span>
              <RotatingWords
                words={['Laravel platforms.', 'Django systems.', 'Flutter apps.', 'API integrations.', 'modern websites.']}
              />
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {profile?.tagline || 'Full-stack developer building modern, fast web applications that help businesses grow online.'}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="glow shine">
                <Link to="/contact">{profile?.hire_cta_text || 'Hire Me'} <ArrowRight size={18} /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/projects">View Projects</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {['Direct clients welcome', 'Worldwide remote', 'Fixed quote, no surprises'].map(item => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" /> {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tech marquee */}
      <Marquee items={techList} />

      {/* Stats */}
      <section className="container-x py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-card p-6 md:p-8 text-center"
            >
              <div className="text-3xl md:text-5xl font-bold gradient-text">{s.value}</div>
              <div className="mt-1 text-xs md:text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="container-x py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-sm text-primary font-medium">What I do</div>
              <h2 className="text-3xl md:text-5xl font-bold mt-1">Services I offer</h2>
            </div>
            <Link to="/services" className="text-sm text-muted-foreground hover:text-primary hidden md:inline-flex items-center gap-1 group">
              All services <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 6).map((s) => {
              const Icon = serviceIcons[s.icon] || serviceIcons.default
              return (
                <motion.div key={s.id} variants={fadeUp}>
                  <Card className="h-full group hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shine">
                    <CardContent className="p-6">
                      <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      )}

      {/* Featured projects */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-sm text-primary font-medium">Selected work</div>
            <h2 className="text-3xl md:text-5xl font-bold mt-1">Featured projects</h2>
          </div>
          <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary hidden md:inline-flex items-center gap-1 group">
            All projects <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No featured projects yet. Add some from the admin panel.
          </div>
        ) : (
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <Link to={`/projects/${p.slug}`} className="group block h-full">
                  <Card className="overflow-hidden h-full hover:border-primary/60 hover:-translate-y-1.5 transition-all duration-300 shine">
                    <div className="aspect-video bg-muted overflow-hidden relative">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-transparent">
                          <Code2 size={40} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-sm font-medium inline-flex items-center gap-1">
                          View case <ArrowRight size={14} />
                        </span>
                      </div>
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
          </motion.div>
        )}
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-x py-20">
          <div className="text-center mb-12">
            <div className="text-sm text-primary font-medium">Client words</div>
            <h2 className="text-3xl md:text-5xl font-bold mt-1">What clients say</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <motion.div key={t.id} variants={fadeUp}>
                <Card className="p-6 h-full hover:border-primary/40 transition-colors">
                  <div className="text-3xl gradient-text leading-none">"</div>
                  <p className="text-sm leading-relaxed">{t.content}</p>
                  <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt="" className="size-10 rounded-full object-cover" />
                    ) : (
                      <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {t.client_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold">{t.client_name}</div>
                      <div className="text-xs text-muted-foreground">{t.client_role}{t.client_company ? `, ${t.client_company}` : ''}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* CTA */}
      <section className="container-x py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background p-10 md:p-16 text-center"
        >
          <div aria-hidden className="absolute inset-0 -z-10 grid-bg opacity-50" />
          <Rocket className="mx-auto size-12 text-primary" />
          <h2 className="text-3xl md:text-5xl font-bold mt-4">Have a project in mind?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            I take on a limited number of direct-client projects each quarter. Tell me about yours.
          </p>
          <Button asChild size="lg" className="mt-8 glow shine">
            <Link to="/contact">Start a project <ArrowRight size={18} /></Link>
          </Button>
        </motion.div>
      </section>
    </>
  )
}
