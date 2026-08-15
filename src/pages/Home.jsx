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
import ClientLogos from '@/components/ClientLogos'
import ProductsBanner from '@/components/ProductsBanner'
import FeaturedProjectsCarousel from '@/components/FeaturedProjectsCarousel'
import SdlcOrbit from '@/components/SdlcOrbit'
import { getProfile, listProjects, listServices, listTestimonials, listProducts } from '@/lib/queries'

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
  const [testimonials, setTestimonials] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      listProjects({ featuredOnly: true }).catch(() => []),
      listServices().catch(() => []),
      listTestimonials().catch(() => []),
      listProducts({ featuredOnly: true }).catch(() => []),
    ]).then(([p, fp, sv, tt, fpd]) => {
      setProfile(p); setFeatured(fp.slice(0, 3)); setServices(sv); setTestimonials(tt.slice(0, 3))
      setFeaturedProducts(fpd.slice(0, 3))
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
      <ProductsBanner />

      {/* Hero */}
      <section className="relative">
        <AnimatedBlobs />
        <div className="container-x py-20 md:py-28 grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-2xl">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-pulse">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                Available for new projects
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[1.08]">
              I build{' '}
              <RotatingWords
                className="whitespace-nowrap"
                words={['websites', 'web apps', 'mobile apps', 'payment platforms', 'AI assistants']}
              />{' '}
              that <span className="gradient-text">actually work</span> in Africa.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {profile?.tagline ||
                "I'm a full-stack developer specialising in African payment systems — Ecocash, PayNow, ZimSwitch and more — plus everything else needed to ship a modern site or app. 7+ years, fixed-quote projects, direct line to me."}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="glow shine">
                <Link to="/contact">{profile?.hire_cta_text || 'Book a free 20-min call'} <ArrowRight size={18} /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/projects">See my work</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {['Fixed quote, no hourly billing', 'You own the code & data', '30 days free post-launch support'].map(item => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" /> {item}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                ['7+ yrs', 'production software'],
                ['11', 'gateways on ManishaPay'],
                ['219', 'automated tests live'],
                ['90%', 'stock-loss cut for a client'],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-border bg-card/60 px-4 py-3">
                  <div className="text-xl font-bold text-primary">{v}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground leading-snug">{l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <SdlcOrbit />
          </motion.div>
        </div>
      </section>

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

      {/* Client logos / trust strip */}
      <ClientLogos />

      {/* Services */}
      {services.length > 0 && (
        <section className="container-x py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">What I do</div>
              <h2 className="text-3xl md:text-5xl font-bold mt-1">Services I offer</h2>
            </div>
            <Link to="/services" className="text-sm text-muted-foreground hover:text-primary hidden md:inline-flex items-center gap-1 group">
              All services <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 3).map((s, i) => {
              const Icon = serviceIcons[s.icon] || serviceIcons.default
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
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
          </div>
        </section>
      )}

      {/* Featured projects */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Selected work</div>
            <h2 className="text-3xl md:text-5xl font-bold mt-1">Featured projects</h2>
            <p className="mt-2 text-muted-foreground max-w-xl">Three production apps shipped recently — each tackling a real-world Zimbabwean workflow end-to-end.</p>
          </div>
          <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary hidden md:inline-flex items-center gap-1 group">
            All projects <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <FeaturedProjectsCarousel />
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="container-x py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Ready to ship</div>
              <h2 className="text-3xl md:text-5xl font-bold mt-1">Pre-built systems for sale</h2>
              <p className="mt-2 text-muted-foreground max-w-xl">Skip the build. Buy a tested system, deploy in days, own the source forever.</p>
            </div>
            <Link to="/products" className="text-sm text-muted-foreground hover:text-primary hidden md:inline-flex items-center gap-1 group">
              All products <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/products/${p.slug}`} className="group block h-full">
                  <Card className="overflow-hidden h-full hover:border-primary/60 hover:-translate-y-1.5 transition-all duration-300 shine">
                    <div className="aspect-video bg-muted overflow-hidden relative">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-transparent">
                          <Code2 size={36} />
                        </div>
                      )}
                      {p.category && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-background/90 text-foreground border border-border">{p.category}</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <div className="text-xl font-bold gradient-text">
                          ${Number(p.price ?? 0).toLocaleString()}
                          <span className="text-xs font-medium text-muted-foreground ml-1">{p.currency || 'USD'}</span>
                        </div>
                        <span className="text-sm text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          View <ArrowRight size={14} />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-x py-20">
          <div className="text-center mb-12">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Client words</div>
            <h2 className="text-3xl md:text-5xl font-bold mt-1">What clients say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
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
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-x py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="alive relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background p-10 md:p-16 text-center"
        >
          <div aria-hidden className="absolute inset-0 -z-10 grid-bg opacity-50" />
          <Rocket className="mx-auto size-12 text-primary" />
          <h2 className="text-3xl md:text-5xl font-bold mt-4">Have a project in mind?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            I take on a limited number of direct-client projects each quarter.
            The first call is free — and if we're not a fit, I'll point you to someone who is.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="glow shine">
              <Link to="/contact">Book a free 20-min call <ArrowRight size={18} /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/process">How I work</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  )
}
