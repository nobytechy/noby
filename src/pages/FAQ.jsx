import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'How much does a typical project cost?',
    a: 'Most projects fall between $500 and $15,000 depending on scope. A WordPress site starts around $600. Custom web applications start around $1,500. Mobile apps start around $2,500. Every quote is fixed — you know the price before signing, and it doesn\'t change unless scope changes.',
  },
  {
    q: 'Do you bill hourly?',
    a: 'No. Hourly billing penalizes both of us — you for getting an experienced developer, me for working efficiently. Every project is fixed-quote with milestone payments. You pay 50% to start and 50% on go-live.',
  },
  {
    q: 'How long does a project take?',
    a: 'Landing sites and small WordPress projects: 1–2 weeks. Custom web applications: 4–10 weeks depending on scope. Mobile apps: 6–12 weeks. The proposal you receive after the discovery call has a milestone-by-milestone timeline.',
  },
  {
    q: 'Who owns the code and the data?',
    a: 'You do. From day one. Source code is hosted in a Git repo you control, hosting accounts are in your name, and the data is yours. If we ever stop working together, nothing is locked behind me.',
  },
  {
    q: 'Can you work with my existing developer or team?',
    a: 'Yes. I regularly slot into existing teams as a contractor. I\'ll match your Git workflow, code style, project management tools, and ticketing system. References available on request.',
  },
  {
    q: 'What about local payment integrations (Ecocash, PayNow, etc.)?',
    a: 'This is one of my specialties. I\'ve shipped Ecocash, PayNow, ZimSwitch, EcoCash and InnBucks integrations into production. If your customers are in Zimbabwe or Southern Africa and you need them to actually be able to pay, I can wire that into any modern stack.',
  },
  {
    q: 'Do you provide hosting?',
    a: 'No — and that\'s deliberate. Hosting in your name keeps you in control. I\'ll recommend a host that fits the project (cPanel, Hetzner, Railway, Vercel, AWS, etc.), help you set it up, and deploy the project there. No vendor lock-in to me.',
  },
  {
    q: 'What if something breaks after launch?',
    a: 'You get 30 days of free post-launch support included with every project — bug fixes, small tweaks, training questions. After 30 days you can either go your own way or move to a small monthly retainer if you want me on call.',
  },
  {
    q: 'Where are you based and do you work internationally?',
    a: 'I\'m in Harare, Zimbabwe and work with clients worldwide — over half my work is for clients outside Zimbabwe. Calls happen on Zoom or Google Meet. I overlap with most timezones during my working hours.',
  },
  {
    q: 'How do I get started?',
    a: 'Hit the "Book a free 20-min call" button, fill in the short form (project type, rough budget, timeline), and I\'ll reply within 24 hours with either a calendar link or — if it\'s not a good fit — a referral to someone better suited.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <SEO title="FAQ" path="/faq" description="Common questions about pricing, timelines, ownership, support and how to start a project." jsonLd={jsonLd} />

      <section className="container-x py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="text-sm text-primary font-medium">Frequently asked</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Questions, answered straight.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            If your question isn't here, the discovery call is free — ask me anything.
          </p>
        </motion.div>

        <div className="mt-12 max-w-3xl divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full text-left py-5 flex items-start justify-between gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className={cn('text-lg font-semibold transition-colors', isOpen ? 'text-primary' : 'group-hover:text-primary')}>
                    {f.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={cn('shrink-0 mt-1 transition-transform duration-300', isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground')}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-8 text-muted-foreground leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="alive mt-16 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Still got questions?</h2>
          <p className="mt-3 text-muted-foreground">Drop me a message — I respond within 24 hours.</p>
          <Button asChild size="lg" className="mt-6 glow shine">
            <Link to="/contact">Book a free 20-min call <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
