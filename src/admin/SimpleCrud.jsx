import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { crud, uploadImage } from '@/lib/queries'

/**
 * fields: [{ key, label, type: 'text'|'textarea'|'number'|'image' }]
 * primaryField: which field to show as title in list
 * secondaryField: optional subtitle field
 */
export default function SimpleCrud({ title, table, fields, primaryField, secondaryField }) {
  const api = crud(table)
  const empty = Object.fromEntries(fields.map(f => [f.key, f.type === 'number' ? 0 : '']))
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({})

  const load = () => api.list().then(setItems).catch(e => toast.error(e.message))
  useEffect(() => { load() }, [table])

  const openCreate = () => { setEditingId(null); setForm({ ...empty, sort_order: items.length }); setOpen(true) }
  const openEdit = (it) => {
    setEditingId(it.id)
    setForm(Object.fromEntries(fields.map(f => [f.key, it[f.key] ?? (f.type === 'number' ? 0 : '')])))
    setOpen(true)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const onUpload = (k) => async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(u => ({ ...u, [k]: true }))
    try {
      const url = await uploadImage(file, table)
      setForm(f => ({ ...f, [k]: url }))
      toast.success('Uploaded')
    } catch (err) { toast.error(err.message) } finally { setUploading(u => ({ ...u, [k]: false })) }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      fields.forEach(f => { if (f.type === 'number') payload[f.key] = parseInt(payload[f.key], 10) || 0 })
      if (editingId) await api.update(editingId, payload)
      else await api.create(payload)
      toast.success('Saved')
      setOpen(false); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const onDelete = async (it) => {
    if (!confirm(`Delete "${it[primaryField]}"?`)) return
    try { await api.remove(it.id); toast.success('Deleted'); load() }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus size={16} /> New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'New'} {title.replace(/s$/, '')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              {fields.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  {f.type === 'textarea' ? (
                    <Textarea rows={4} value={form[f.key] ?? ''} onChange={set(f.key)} />
                  ) : f.type === 'image' ? (
                    <div className="flex items-center gap-3">
                      <Input value={form[f.key] ?? ''} onChange={set(f.key)} placeholder="https://… or upload" />
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={onUpload(f.key)} />
                        <span className="inline-flex items-center justify-center rounded-md border border-border px-3 h-10 text-sm hover:bg-secondary">
                          {uploading[f.key] ? 'Uploading…' : 'Upload'}
                        </span>
                      </label>
                    </div>
                  ) : (
                    <Input type={f.type} value={form[f.key] ?? ''} onChange={set(f.key)} />
                  )}
                </div>
              ))}
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
            Nothing here yet.
          </div>
        ) : items.map(it => (
          <Card key={it.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{it[primaryField]}</div>
                {secondaryField && it[secondaryField] && (
                  <div className="text-sm text-muted-foreground line-clamp-1">{it[secondaryField]}</div>
                )}
              </div>
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
