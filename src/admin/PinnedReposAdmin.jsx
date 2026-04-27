import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { GithubIcon } from '@/components/BrandIcons'
import { crud } from '@/lib/queries'

const empty = { repo_full_name: '', description_override: '', sort_order: 0 }

// Accept a full URL or "owner/repo" or just "repo" — return owner/repo or null.
function normaliseRepo(input) {
  const s = (input || '').trim()
  if (!s) return null
  const url = s.match(/github\.com\/([^/]+)\/([^/?#]+)/i)
  if (url) return `${url[1]}/${url[2].replace(/\.git$/, '')}`
  if (/^[\w-]+\/[\w.-]+$/.test(s)) return s.replace(/\.git$/, '')
  return null
}

export default function PinnedReposAdmin() {
  const api = crud('pinned_repos')
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => api.list().then(setItems).catch(e => toast.error(e.message))
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditingId(null); setForm({ ...empty, sort_order: items.length }); setOpen(true) }
  const openEdit = (it) => {
    setEditingId(it.id)
    setForm({
      repo_full_name: it.repo_full_name || '',
      description_override: it.description_override || '',
      sort_order: it.sort_order || 0,
    })
    setOpen(true)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const onSave = async (e) => {
    e.preventDefault()
    const repo = normaliseRepo(form.repo_full_name)
    if (!repo) { toast.error('Enter a GitHub URL or owner/repo'); return }
    setSaving(true)
    try {
      const payload = {
        repo_full_name: repo,
        description_override: form.description_override || null,
        sort_order: parseInt(form.sort_order, 10) || 0,
      }
      if (editingId) await api.update(editingId, payload)
      else await api.create(payload)
      toast.success('Saved')
      setOpen(false); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const onDelete = async (it) => {
    if (!confirm(`Unpin ${it.repo_full_name}?`)) return
    try { await api.remove(it.id); toast.success('Unpinned'); load() }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pinned repositories</h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            Add the GitHub repos you want featured on your home page. Live metadata
            (stars, forks, language, description) is fetched fresh on every visit
            via the public REST API — no token, no rate-limit issues for visitors.
            Leave this empty to fall back to your top public repos by stars.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus size={16} /> Pin a repo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit pinned repo' : 'Pin a repo'}</DialogTitle>
              <DialogDescription>
                Paste a full GitHub URL or just <code>owner/repo</code> (e.g. <code>nobytechy/noby</code>).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Repository</Label>
                <Input
                  value={form.repo_full_name}
                  onChange={set('repo_full_name')}
                  placeholder="https://github.com/nobytechy/noby  or  nobytechy/noby"
                  required
                />
                {form.repo_full_name && (
                  <div className="text-xs text-muted-foreground">
                    Will save as: <code>{normaliseRepo(form.repo_full_name) || '— invalid —'}</code>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Description override <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea
                  rows={2}
                  value={form.description_override}
                  onChange={set('description_override')}
                  placeholder="Leave blank to use the GitHub repo description"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Sort order</Label>
                <Input type="number" value={form.sort_order} onChange={set('sort_order')} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-2">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No pinned repos yet — your home page will show your top repos by stars.
          </div>
        ) : items.map(it => (
          <Card key={it.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <GithubIcon size={18} className="shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{it.repo_full_name}</div>
                {it.description_override && (
                  <div className="text-sm text-muted-foreground line-clamp-1">{it.description_override}</div>
                )}
              </div>
              <a
                href={`https://github.com/${it.repo_full_name}`}
                target="_blank" rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Open on GitHub"
              ><ExternalLink size={14} /></a>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(it)}><Pencil size={14} /></Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(it)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
