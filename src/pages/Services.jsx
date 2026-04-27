import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, ArrowRight } from 'lucide-react'
import SEO from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { listServices } from '@/lib/queries'

export default function Services() {
  const [services, setServices] = useState([])
  useEffect(() => { listServices().then(setServices).catch(() => {}) }, [])

  return (
    <>
      <SEO title="Services" path="/services" description="Web development services for direct clients." />

      <section className="container-x py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="text-sm text-muted-foreground">What I offer</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Services</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            End-to-end web development tailored to your business. From idea to launch and beyond.
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              No services yet. Add some from the admin panel.
            </div>
          ) : services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full">
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

        <div className="mt-16 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Don't see what you need?</h2>
          <p className="mt-3 text-muted-foreground">If your project doesn't fit a single service, let's talk.</p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/contact">Get in touch <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
