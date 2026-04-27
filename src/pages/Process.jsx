import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, FileText, Code2, Rocket, LifeBuoy, ArrowRight, CheckCircle2 } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const steps = [
  {
    icon: MessageCircle,
    title: 'Discovery call (free)',
    duration: '20–30 min',
    body: 'We hop on a call. You explain the problem, the audience, and the constraints. I ask the questions you didn\'t know to think about. By the end we both know if there\'s a fit.',
  },
  {
    icon: FileText,
    title: 'Fixed-quote proposal',
    duration: '2–4 days',
    body: 'You get a written proposal: scope, milestones, deliverables, fixed price, timeline, and what\'s not included. No hourly billing, no surprise invoices. You sign and pay 50% to start.',
  },
  {
    icon: Code2,
    title: 'Build, with weekly demos',
    duration: 'Project timeline',
    body: 'I work in tracked milestones. Every week you get a working preview link and a short Loom walkthrough — so there\'s never a "trust me" moment. Feedback rolls into the next milestone.',
  },
  {
    icon: Rocket,
    title: 'Launch & handover',
    duration: '1 week',
    body: 'Final QA, deploy to your hosting, DNS cutover, owner handover. You get the source code, deployment docs, and admin training. Final 50% due on go-live.',
  },
  {
    icon: LifeBuoy,
    title: '30 days free support',
    duration: '30 days post-launch',
    body: 'Bug fixes, small tweaks, training questions — covered free for the first 30 days. After that we either part ways with a clean handover, or move to a small monthly retainer if you want me on call.',
  },
]

const principles = [
  'Fixed quote, milestone-based — no hourly billing surprises',
  'You own the source code, the data, and the hosting account',
  'Weekly preview links — never a "trust me, it\'s coming" moment',
  'Direct line to me — no account managers, no project gatekeepers',
  '30-day free post-launch support included in every project',
]

export default function Process() {
  return (
    <>
      <SEO title="How I work" path="/process" description="My 5-step process for direct-client projects: discovery, fixed quote, weekly demos, launch, 30 days support." />

      <section className="container-x py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="text-sm text-primary font-medium">How I work</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Five steps from idea to live site.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Most direct clients have been burned by a developer once. That's why my process
            is structured, transparent, and milestone-based — so you always know what's
            happening, what's next, and what it costs.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-12 space-y-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="p-6 md:p-8 grid md:grid-cols-[auto_1fr_auto] gap-6 items-start">
                  <div className="flex items-center gap-4 md:flex-col md:items-start">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <s.icon size={22} />
                    </div>
                    <div className="text-3xl font-bold gradient-text leading-none md:mt-2">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1 self-start whitespace-nowrap">
                    {s.duration}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Principles */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-10">
          <h2 className="text-2xl font-bold">Working principles</h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {principles.map(p => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="alive mt-16 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-4xl font-bold">Ready to talk?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            The discovery call is free, no obligation. If we're not a fit I'll tell you and
            point you to someone who is.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="glow shine">
              <Link to="/contact">Book a free 20-min call <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/faq">Read the FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
