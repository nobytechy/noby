import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Palette } from 'lucide-react'
import SEO from '@/components/SEO'
import PageHero from '@/components/PageHero'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FALLBACK_DESIGNS, DESIGN_CATEGORIES } from '@/data/fallbackDesigns'

const pieceCount = d => (d.images?.length ? d.images.length : 1)

export default function Designs() {
  const [filter, setFilter] = useState('all')

  const visible = useMemo(
    () => (filter === 'all' ? FALLBACK_DESIGNS : FALLBACK_DESIGNS.filter(d => d.category === filter)),
    [filter]
  )

  return (
    <>
      <SEO
        title="Designs"
        path="/designs"
        description="Graphic design work by Noby — posters, flyers, brand kits, print editorial and social campaigns, each with the full journey from source files to finished artwork."
      />

      <PageHero
        eyebrow="Graphic design"
        title="Designs"
        subtitle="Posters, flyers, brand identities and print editorial — client work alongside clearly labelled spec and template pieces. Open any piece to see how it was built, layer by layer."
      />

      <section className="container-x py-16 md:py-24">
        <div className="mt-2 flex flex-wrap gap-2">
          {DESIGN_CATEGORIES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              aria-pressed={filter === t}
              className={
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                (filter === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary')
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visible.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              No designs match this filter.
            </div>
          ) : visible.map((d, i) => {
            const count = pieceCount(d)
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05 }}
                className="h-full"
              >
                <Link to={`/designs/${d.slug}`} className="group block h-full">
                  <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
                    <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                      {d.image_url ? (
                        <img
                          src={d.image_url}
                          alt={d.title}
                          loading={i < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Palette size={32} /></div>
                      )}
                      {count > 1 && (
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-background/90 text-foreground border border-border">
                            {count} {d.count_noun || 'pieces'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{d.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{d.short_description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(d.tags || []).slice(0, 3).map(t => (
                          <Badge key={t} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        How it was made <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </>
  )
}
