import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, ArrowRight, Globe, Smartphone, Code2, Wrench, Cpu } from 'lucide-react'
import SEO from '@/components/SEO'
import PageHero from '@/components/PageHero'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ProductsBanner from '@/components/ProductsBanner'
import { listServices } from '@/lib/queries'

const icons = { web: Globe, mobile: Smartphone, fullstack: Code2, integration: Wrench, ai: Cpu, default: Layers }


export default function Services() {
  const [services, setServices] = useState(null) // null = loading, [] = loaded empty
  const [error, setError] = useState(null)
  useEffect(() => {
    listServices()
      .then(rows => { setServices(rows); setError(null) })
      .catch(err => {
        console.error('[Services] load failed:', err)
        setError(err.message || String(err))
        setServices([])
      })
  }, [])

  return (
    <>
      <SEO title="Services" path="/services" description="Web, mobile, and payment integration services for direct clients. Starting prices listed." />
      <ProductsBanner />

      <PageHero
        eyebrow="What I offer"
        title="Services & Pricing"
        subtitle="Fixed-quote, milestone-based projects. No hourly rates, no surprises. Prices below are starting points — final quote follows the discovery call."
      />

      <section className="container-x py-16 md:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services === null ? (
            <div className="col-span-full p-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="col-span-full rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
              <div className="text-sm font-semibold text-destructive">Couldn't load services</div>
              <div className="text-xs text-muted-foreground mt-1 break-all">{error}</div>
              <div className="text-xs text-muted-foreground mt-3">
                Open the browser console for full details. Common cause: RLS policy missing —
                run <code>schema.sql</code> again to refresh the public read policies.
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
              <div className="font-semibold text-foreground">No services to show</div>
              <div className="mt-2 text-sm max-w-md mx-auto">
                If you've added services in the admin panel and they appear there
                but not here, your <code>services</code> table is missing its
                public-read RLS policy. Run{' '}
                <code>supabase/diagnostics/rebuild_public_read_policies.sql</code>{' '}
                once in the Supabase SQL Editor — fixes it in 10 seconds.
              </div>
            </div>
          ) : services.map((s, i) => {
            const Icon = icons[s.icon] || icons.default
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="h-full group hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shine">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{s.description}</p>
                    {s.price_from != null && (
                      <div className="mt-5 pt-4 border-t border-border">
                        <div className="text-xs text-muted-foreground">From</div>
                        <div className="text-2xl font-bold gradient-text">
                          ${Number(s.price_from).toLocaleString()}
                          <span className="text-sm font-medium text-muted-foreground ml-1">{s.price_unit || 'USD'}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="alive mt-16 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Don't see what you need?</h2>
          <p className="mt-3 text-muted-foreground">If your project doesn't fit a single service, let's talk. Most engagements are custom.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="glow shine">
              <Link to="/contact">Book a free 20-min call <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/process">How I work</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
