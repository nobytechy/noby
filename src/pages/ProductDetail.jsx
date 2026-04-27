import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, X as Close, ChevronLeft, ChevronRight, ShieldCheck, Zap, Code2 } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import BuyOnWhatsApp from '@/components/BuyOnWhatsApp'
import { getProductBySlug } from '@/lib/queries'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [lightbox, setLightbox] = useState(-1) // index in screenshots, -1 = closed

  useEffect(() => {
    setError(null); setProduct(null)
    getProductBySlug(slug).then(setProduct).catch(setError)
  }, [slug])

  // Keyboard nav for the lightbox
  useEffect(() => {
    if (lightbox < 0) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(-1)
      else if (e.key === 'ArrowLeft') setLightbox(i => (i > 0 ? i - 1 : i))
      else if (e.key === 'ArrowRight') setLightbox(i => (product?.screenshots && i < product.screenshots.length - 1 ? i + 1 : i))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, product])

  if (error) {
    return (
      <section className="container-x py-24 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist or has been unpublished.</p>
        <Button asChild className="mt-6"><Link to="/products">Back to products</Link></Button>
      </section>
    )
  }
  if (!product) {
    return (
      <section className="container-x py-24 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </section>
    )
  }

  const shots = Array.isArray(product.screenshots) ? product.screenshots : []
  const features = Array.isArray(product.features) ? product.features : []

  return (
    <>
      <SEO
        title={product.title}
        path={`/products/${product.slug}`}
        description={product.short_description}
        image={product.cover_image_url}
      />

      <article className="container-x py-12 md:py-20">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> All products
        </Link>

        <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-10">
          {/* MAIN COLUMN */}
          <div>
            <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.category && <Badge variant="outline">{product.category}</Badge>}
                {product.featured && <Badge>Featured</Badge>}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{product.title}</h1>
              {product.short_description && (
                <p className="mt-4 text-lg text-muted-foreground">{product.short_description}</p>
              )}
            </motion.header>

            {/* Cover */}
            {product.cover_image_url && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="mt-8 rounded-2xl overflow-hidden border border-border cursor-zoom-in"
                onClick={() => shots.length > 0 ? setLightbox(0) : null}
              >
                <img src={product.cover_image_url} alt={product.title} className="w-full" />
              </motion.div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-4">What's included</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <motion.li
                      key={f + i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </ul>
              </section>
            )}

            {/* Long description */}
            {product.long_description && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-4">About this product</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {product.long_description}
                  </div>
                </div>
              </section>
            )}

            {/* Screenshots gallery */}
            {shots.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {shots.map((src, i) => (
                    <motion.button
                      key={src + i}
                      type="button"
                      onClick={() => setLightbox(i)}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="rounded-lg overflow-hidden border border-border hover:border-primary/60 transition-colors aspect-video relative group select-none"
                    >
                      <img src={src} alt={`${product.title} screenshot ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" draggable={false} />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center text-white text-sm font-medium">
                        View
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* STICKY SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="rounded-2xl border border-primary/30 bg-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">One-time price</div>
              <div className="mt-1 text-4xl font-bold gradient-text">
                ${Number(product.price ?? 0).toLocaleString()}
                <span className="text-base font-medium text-muted-foreground ml-1">{product.currency || 'USD'}</span>
              </div>

              <BuyOnWhatsApp product={product} className="w-full mt-5" />

              <div className="mt-5 pt-5 border-t border-border space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Code2 size={16} className="text-primary mt-0.5 shrink-0" />
                  <span><span className="font-medium">Full source code</span> — yours to keep, modify and host.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-primary mt-0.5 shrink-0" />
                  <span><span className="font-medium">Deploy in days</span> instead of months of custom development.</span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={16} className="text-primary mt-0.5 shrink-0" />
                  <span><span className="font-medium">Code released after WhatsApp payment confirmation.</span></span>
                </div>
              </div>
            </div>

            {(product.tech_stack || []).length > 0 && (
              <div className="rounded-xl border border-border p-5 bg-card">
                <div className="text-sm font-semibold mb-3">Tech stack</div>
                <div className="flex flex-wrap gap-1.5">
                  {product.tech_stack.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border p-5 bg-card text-sm">
              <div className="font-semibold mb-1">Need customisations?</div>
              <p className="text-muted-foreground">
                I can extend this product to fit your business — e.g. extra modules, branding, integrations.
              </p>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/contact">Discuss customisations</Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* Mobile sticky bottom-bar */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur p-3 flex items-center justify-between gap-3">
          <div className="text-sm">
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="font-bold gradient-text">${Number(product.price ?? 0).toLocaleString()} {product.currency}</div>
          </div>
          <BuyOnWhatsApp product={product} size="default" />
        </div>
      </article>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox >= 0 && shots[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur grid place-items-center p-4"
            onClick={() => setLightbox(-1)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(-1) }}
              className="absolute top-4 right-4 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
              aria-label="Close"
            ><Close size={18} /></button>
            {lightbox > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(i => i - 1) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                aria-label="Previous"
              ><ChevronLeft size={22} /></button>
            )}
            {lightbox < shots.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(i => i + 1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                aria-label="Next"
              ><ChevronRight size={22} /></button>
            )}
            <motion.img
              key={shots[lightbox]}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              src={shots[lightbox]}
              alt=""
              className="max-w-full max-h-[88vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs">
              {lightbox + 1} / {shots.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
