import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ArrowRight, ImageIcon } from 'lucide-react'
import SEO from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { listProducts } from '@/lib/queries'

export default function Products() {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    listProducts()
      .then(rows => { setProducts(rows); setError(null) })
      .catch(err => { console.error('[Products] load failed:', err); setError(err.message); setProducts([]) })
  }, [])

  const categories = useMemo(() => {
    if (!products) return ['all']
    const set = new Set()
    products.forEach(p => p.category && set.add(p.category))
    return ['all', ...Array.from(set)]
  }, [products])

  const visible = !products ? [] : filter === 'all' ? products : products.filter(p => p.category === filter)

  return (
    <>
      <SEO
        title="Products"
        path="/products"
        description="Pre-built systems you can buy and deploy in days, not months. HR, hospital, school, hotel, e-commerce — full source code, one-time payment."
      />

      <section className="container-x py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="text-sm text-primary font-medium">Ready to ship</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Pre-built systems for sale</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tested, production-ready systems you can deploy in days instead of building from scratch.
            One-time payment, full source code, you own it forever.
          </p>
        </motion.div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                  (filter === c ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary')
                }
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products === null ? (
            <div className="col-span-full p-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="col-span-full rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
              <div className="text-sm font-semibold text-destructive">Couldn't load products</div>
              <div className="text-xs text-muted-foreground mt-1 break-all">{error}</div>
            </div>
          ) : visible.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              <Package className="mx-auto size-8 mb-3 opacity-50" />
              <div className="font-semibold text-foreground">
                {filter === 'all' ? 'No products yet' : `No products in "${filter}"`}
              </div>
              <div className="text-sm mt-1">
                {filter === 'all' ? 'Add some from the admin panel.' : 'Try a different category.'}
              </div>
            </div>
          ) : visible.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/products/${p.slug}`} className="group block h-full">
                <Card className="overflow-hidden h-full hover:border-primary/60 hover:-translate-y-1.5 transition-all duration-300 shine">
                  <div className="aspect-video bg-muted overflow-hidden relative">
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-transparent">
                        <ImageIcon size={36} />
                      </div>
                    )}
                    {p.category && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="bg-background/90 text-foreground border border-border">{p.category}</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(p.tech_stack || []).slice(0, 4).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">From</div>
                        <div className="text-xl font-bold gradient-text">
                          ${Number(p.price ?? 0).toLocaleString()}
                          <span className="text-xs font-medium text-muted-foreground ml-1">{p.currency || 'USD'}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                        View <ArrowRight size={14} />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="alive mt-20 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Need a system that's not listed?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            I can build it from scratch — typical custom system: 4–10 weeks, fixed quote.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="glow shine">
              <Link to="/contact">Request a custom build <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/services">View services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
