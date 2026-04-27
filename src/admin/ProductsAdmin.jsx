import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Star, ExternalLink, ChevronUp, ChevronDown, X as Close, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadImage } from '@/lib/queries'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'

const empty = {
  title: '', slug: '', category: '',
  short_description: '', long_description: '',
  cover_image_url: '',
  screenshots: [],     // array of URLs
  features: '',        // multiline string in form, parsed to array on save
  tech_stack: '',      // comma-separated string in form
  price: 0, currency: 'USD',
  is_published: true, featured: false, sort_order: 0,
}

const SUGGESTED_CATEGORIES = ['HR', 'Hospital', 'Education', 'Hospitality', 'E-commerce', 'Real Estate', 'Finance', 'Logistics', 'Restaurant', 'Other']

export default function ProductsAdmin() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingShot, setUploadingShot] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from('products').select('*').order('sort_order').order('created_at', { ascending: false })
    if (error) toast.error(error.message); else setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditingId(null); setForm({ ...empty, sort_order: items.length }); setOpen(true) }
  const openEdit = (p) => {
    setEditingId(p.id)
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      category: p.category || '',
      short_description: p.short_description || '',
      long_description: p.long_description || '',
      cover_image_url: p.cover_image_url || '',
      screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
      features: Array.isArray(p.features) ? p.features.join('\n') : '',
      tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '',
      price: p.price ?? 0,
      currency: p.currency || 'USD',
      is_published: !!p.is_published,
      featured: !!p.featured,
      sort_order: p.sort_order ?? 0,
    })
    setOpen(true)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target?.type === 'checkbox' ? e.target.checked : e.target.value }))

  const onUploadCover = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadImage(file, 'products')
      setForm(f => ({ ...f, cover_image_url: url }))
      toast.success('Cover uploaded')
    } catch (err) { toast.error(err.message) } finally { setUploadingCover(false) }
  }

  const onUploadShot = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingShot(true)
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f, 'products')))
      setForm(f => ({ ...f, screenshots: [...f.screenshots, ...urls] }))
      toast.success(`${urls.length} screenshot${urls.length === 1 ? '' : 's'} added`)
    } catch (err) { toast.error(err.message) } finally { setUploadingShot(false); e.target.value = '' }
  }

  const moveShot = (idx, dir) => {
    setForm(f => {
      const next = [...f.screenshots]
      const j = idx + dir
      if (j < 0 || j >= next.length) return f
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return { ...f, screenshots: next }
    })
  }
  const removeShot = (idx) => {
    setForm(f => ({ ...f, screenshots: f.screenshots.filter((_, i) => i !== idx) }))
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: (form.slug || slugify(form.title)).trim(),
        category: form.category || null,
        short_description: form.short_description || null,
        long_description: form.long_description || null,
        cover_image_url: form.cover_image_url || null,
        screenshots: form.screenshots,
        features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
        tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        price: parseFloat(form.price) || 0,
        currency: form.currency.trim() || 'USD',
        is_published: form.is_published,
        featured: form.featured,
        sort_order: parseInt(form.sort_order, 10) || 0,
      }
      const { error } = editingId
        ? await supabase.from('products').update(payload).eq('id', editingId)
        : await supabase.from('products').insert(payload)
      if (error) throw error
      toast.success(editingId ? 'Product updated' : 'Product created')
      setOpen(false); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const onDelete = async (p) => {
    if (!confirm(`Delete "${p.title}"? This is permanent.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) toast.error(error.message); else { toast.success('Deleted'); load() }
  }

  const togglePublished = async (p) => {
    const { error } = await supabase.from('products').update({ is_published: !p.is_published }).eq('id', p.id)
    if (error) toast.error(error.message); else load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">Pre-built systems sold via WhatsApp. Buyer pays once, gets the source code.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus size={16} /> New product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit product' : 'New product'}</DialogTitle>
              <DialogDescription>Tags / tech stack are comma-separated. Features are one per line.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={set('title')} required placeholder="Hotel Management System" />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug (URL)</Label>
                  <Input value={form.slug} onChange={set('slug')} placeholder={slugify(form.title)} />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 sm:col-span-1">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={set('category')} placeholder="e.g. Hospital" list="cat-list" />
                  <datalist id="cat-list">{SUGGESTED_CATEGORIES.map(c => <option key={c} value={c} />)}</datalist>
                </div>
                <div className="space-y-1.5">
                  <Label>Price</Label>
                  <Input type="number" step="1" min="0" value={form.price} onChange={set('price')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Input value={form.currency} onChange={set('currency')} placeholder="USD" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Short description</Label>
                <Textarea rows={2} value={form.short_description} onChange={set('short_description')} placeholder="One-liner shown on the products grid." />
              </div>
              <div className="space-y-1.5">
                <Label>Long description</Label>
                <Textarea rows={5} value={form.long_description} onChange={set('long_description')} placeholder="Full markdown-style description shown on the product detail page." />
              </div>

              <div className="space-y-1.5">
                <Label>Cover image</Label>
                <div className="flex items-center gap-3">
                  <Input value={form.cover_image_url} onChange={set('cover_image_url')} placeholder="https://… or upload" />
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={onUploadCover} />
                    <span className="inline-flex items-center justify-center rounded-md border border-border px-3 h-10 text-sm hover:bg-secondary">
                      {uploadingCover ? 'Uploading…' : 'Upload'}
                    </span>
                  </label>
                </div>
                {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-2 w-40 h-24 object-cover rounded-md border border-border" />}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Screenshots ({form.screenshots.length})</Label>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={onUploadShot} />
                    <span className="inline-flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm hover:bg-secondary">
                      <ImageIcon size={14} /> {uploadingShot ? 'Uploading…' : 'Add screenshots'}
                    </span>
                  </label>
                </div>
                {form.screenshots.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No screenshots yet. Add several so buyers can see the product before paying.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {form.screenshots.map((url, i) => (
                      <div key={url + i} className="relative group rounded-md overflow-hidden border border-border aspect-video">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button type="button" onClick={() => moveShot(i, -1)} className="p-1 rounded bg-black/60 text-white disabled:opacity-30" disabled={i === 0}><ChevronUp size={14} /></button>
                          <button type="button" onClick={() => moveShot(i, +1)} className="p-1 rounded bg-black/60 text-white disabled:opacity-30" disabled={i === form.screenshots.length - 1}><ChevronDown size={14} /></button>
                          <button type="button" onClick={() => removeShot(i)} className="p-1 rounded bg-destructive text-white"><Close size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Features (one per line)</Label>
                <Textarea rows={4} value={form.features} onChange={set('features')}
                  placeholder={'Patient registration & history\nAppointment scheduling\nBilling & invoicing\nReporting dashboard'} />
              </div>

              <div className="space-y-1.5">
                <Label>Tech stack (comma-separated)</Label>
                <Input value={form.tech_stack} onChange={set('tech_stack')} placeholder="Laravel, MySQL, Bootstrap, jQuery" />
              </div>

              <div className="grid sm:grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label>Sort order</Label>
                  <Input type="number" value={form.sort_order} onChange={set('sort_order')} />
                </div>
                <label className="flex items-center gap-2 h-10">
                  <input type="checkbox" checked={form.featured} onChange={set('featured')} />
                  <span className="text-sm">Featured on home</span>
                </label>
                <label className="flex items-center gap-2 h-10">
                  <input type="checkbox" checked={form.is_published} onChange={set('is_published')} />
                  <span className="text-sm">Published (visible publicly)</span>
                </label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No products yet. Click "New product" to add your first.
          </div>
        ) : items.map(p => (
          <Card key={p.id} className={p.is_published ? '' : 'opacity-60'}>
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              {p.cover_image_url
                ? <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon size={32} /></div>}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{p.title}</h3>
                {p.featured && <Star size={14} className="text-yellow-500 fill-yellow-500 shrink-0 mt-0.5" />}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                {p.category && <Badge variant="outline">{p.category}</Badge>}
                <span className="font-bold gradient-text">${Number(p.price).toLocaleString()} {p.currency}</span>
                {!p.is_published && <Badge variant="secondary">draft</Badge>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{p.short_description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(p.tech_stack || []).slice(0, 4).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
              <div className="flex items-center justify-between gap-2 mt-4">
                <a href={`/products/${p.slug}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Open public page">
                  <ExternalLink size={14} />
                </a>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => togglePublished(p)} title={p.is_published ? 'Unpublish' : 'Publish'}>
                    {p.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(p)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
