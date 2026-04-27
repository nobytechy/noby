import { motion } from 'framer-motion'

// Real client / employer relationships from prior work.
// Designed as styled wordmarks rather than image logos so they look polished
// without needing real logo assets.
const clients = [
  { name: 'Nhau / Indaba News',           note: 'Lead Developer, 30+ branch CMS' },
  { name: 'AFPAZ',                        note: 'Foster-care NGO, donations portal' },
  { name: 'Foliage Fuels',                note: 'Document portal & corporate site' },
  { name: 'Ravensus (Pvt) Ltd',           note: 'Corporate website' },
  { name: 'Restless Development Zimbabwe',note: 'Field research collaboration' },
]

export default function ClientLogos() {
  return (
    <section className="container-x py-16">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trusted by</div>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold">Organizations I've delivered for</h2>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {clients.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="group rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-secondary/40 transition-colors p-5 text-center min-h-[110px] flex flex-col justify-center"
          >
            <div className="font-display font-bold text-base md:text-lg text-foreground/90 group-hover:gradient-text transition-colors">
              {c.name}
            </div>
            <div className="text-[11px] mt-1.5 text-muted-foreground leading-snug">{c.note}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
