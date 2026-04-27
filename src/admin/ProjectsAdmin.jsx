import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Star, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { listProjects, createProject, updateProject, deleteProject, uploadImage } from '@/lib/queries'
import { slugify } from '@/lib/utils'

const empty = {
  title: '', slug: '', short_description: '', long_description: '',
  cover_image_url: '', tags: '', tech_stack: '',
  github_url: '', live_url: '', featured: false, sort_order: 0,
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = () => listProjects().then(setProjects).catch(e => toast.error(e.message))
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditingId(null); setForm(empty); setOpen(true) }
  const openEdit = (p) => {
    setEditingId(p.id)
    setForm({
      title: p.title || '', slug: p.slug || '',
      short_description: p.short_description || '', long_description: p.long_description || '',
      cover_image_url: p.cover_image_url || '',
      tags: (p.tags || []).join(', '),
      tech_stack: (p.tech_stack || []).join(', '),
      github_url: p.github_url || '', live_url: p.live_url || '',
      featured: !!p.featured, sort_order: p.sort_order || 0,
    })
    setOpen(true)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target?.type === 'checkbox' ? e.target.checked : e.target.value }))

  const onUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'projects')
      setForm(f => ({ ...f, cover_image_url: url }))
      toast.success('Image uploaded')
    } catch (err) { toast.error(err.message) } finally { setUploading(false) }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: (form.slug || slugify(form.title)).trim(),
        short_description: form.short_description,
        long_description: form.long_description,
        cover_image_url: form.cover_image_url || null,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        github_url: form.github_url || null,
        live_url: form.live_url || null,
        featured: form.featured,
        sort_order: parseInt(form.sort_order, 10) || 0,
      }
      if (editingId) await updateProject(editingId, payload)
      else await createProject(payload)
      toast.success(editingId ? 'Project updated' : 'Project created')
      setOpen(false); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const onDelete = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return
    try { await deleteProject(p.id); toast.success('Deleted'); load() }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus size={16} /> New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Project' : 'New Project'}</DialogTitle>
              <DialogDescription>Tags and tech stack are comma-separated.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={set('title')} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug (URL)</Label>
                  <Input value={form.slug} onChange={set('slug')} placeholder={slugify(form.title)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Short description</Label>
                <Textarea rows={2} value={form.short_description} onChange={set('short_description')} />
              </div>
              <div className="space-y-1.5">
                <Label>Long description</Label>
                <Textarea rows={5} value={form.long_description} onChange={set('long_description')} />
              </div>
              <div className="space-y-1.5">
                <Label>Cover image</Label>
                <div className="flex items-center gap-3">
                  <Input value={form.cover_image_url} onChange={set('cover_image_url')} placeholder="https://… or upload" />
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                    <span className="inline-flex items-center justify-center rounded-md border border-border px-3 h-10 text-sm hover:bg-secondary">
                      {uploading ? 'Uploading…' : 'Upload'}
                    </span>
                  </label>
                </div>
                {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-2 w-32 h-20 object-cover rounded-md border border-border" />}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Tags</Label>
                  <Input value={form.tags} onChange={set('tags')} placeholder="web, saas, dashboard" />
                </div>
                <div className="space-y-1.5">
                  <Label>Tech stack</Label>
                  <Input value={form.tech_stack} onChange={set('tech_stack')} placeholder="React, Node, Postgres" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>GitHub URL</Label>
                  <Input value={form.github_url} onChange={set('github_url')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Live URL</Label>
                  <Input value={form.live_url} onChange={set('live_url')} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label>Sort order</Label>
                  <Input type="number" value={form.sort_order} onChange={set('sort_order')} />
                </div>
                <label className="flex items-center gap-2 h-10">
                  <input type="checkbox" checked={form.featured} onChange={set('featured')} />
                  <span className="text-sm">Featured on homepage</span>
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

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No projects yet. Click "New Project" to add one.
          </div>
        ) : projects.map(p => (
          <Card key={p.id}>
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              {p.cover_image_url && <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{p.title}</h3>
                {p.featured && <Star size={14} className="text-yellow-500 fill-yellow-500 shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.short_description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(p.tech_stack || []).slice(0, 3).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
              <div className="flex items-center justify-between gap-2 mt-4">
                <div className="flex gap-1">
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="p-1.5 rounded text-muted-foreground hover:text-foreground"><ExternalLink size={14} /></a>}
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="p-1.5 rounded text-muted-foreground hover:text-foreground"><GithubIcon size={14} /></a>}
                </div>
                <div className="flex gap-1">
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
