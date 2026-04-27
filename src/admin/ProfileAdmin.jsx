import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Card, CardContent } from '@/components/ui/Card'
import { getProfile, updateProfile, uploadImage, uploadDocument } from '@/lib/queries'
import { supabase } from '@/lib/supabase'

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getProfile().then(p => {
      if (!p) {
        // create empty profile if none exists
        supabase.from('profile').insert({ full_name: 'Noby' }).select().single()
          .then(r => { setProfile(r.data); setForm({ ...r.data, ...flattenSocials(r.data) }) })
      } else {
        setProfile(p); setForm({ ...p, ...flattenSocials(p) })
      }
    }).catch(e => toast.error(e.message))
  }, [])

  if (!form) return <div>Loading…</div>

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const onUploadHeadshot = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    try {
      const url = await uploadImage(file, 'headshot')
      setForm(f => ({ ...f, headshot_url: url }))
      toast.success('Headshot uploaded')
    } catch (err) { toast.error(err.message) }
  }
  const onUploadResume = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    try {
      const url = await uploadDocument(file, 'resumes')
      setForm(f => ({ ...f, resume_url: url }))
      toast.success('Resume uploaded')
    } catch (err) { toast.error(err.message) }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        full_name: form.full_name,
        headline: form.headline,
        tagline: form.tagline,
        bio: form.bio,
        email: form.email,
        phone: form.phone,
        location: form.location,
        headshot_url: form.headshot_url,
        resume_url: form.resume_url,
        hire_cta_text: form.hire_cta_text,
        socials: {
          github: form.github || '',
          linkedin: form.linkedin || '',
          twitter: form.twitter || '',
          website: form.website || '',
        },
      }
      const next = await updateProfile(profile.id, payload)
      setProfile(next)
      toast.success('Profile saved')
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-muted-foreground mt-1">This drives the site's hero, about, and contact sections.</p>

      <form onSubmit={onSave} className="mt-8 space-y-6 max-w-3xl">
        <Card><CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Full name</Label><Input value={form.full_name || ''} onChange={set('full_name')} /></div>
            <div className="space-y-1.5"><Label>Headline (e.g. Full-Stack Developer)</Label><Input value={form.headline || ''} onChange={set('headline')} /></div>
          </div>
          <div className="space-y-1.5"><Label>Tagline (one-line pitch)</Label><Input value={form.tagline || ''} onChange={set('tagline')} /></div>
          <div className="space-y-1.5"><Label>Bio</Label><Textarea rows={6} value={form.bio || ''} onChange={set('bio')} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Hire CTA button text</Label><Input value={form.hire_cta_text || ''} onChange={set('hire_cta_text')} /></div>
            <div className="space-y-1.5"><Label>Location</Label><Input value={form.location || ''} onChange={set('location')} /></div>
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Contact details</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email || ''} onChange={set('email')} /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone || ''} onChange={set('phone')} /></div>
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Headshot & Resume</h2>
          <div className="space-y-1.5">
            <Label>Headshot</Label>
            <div className="flex items-center gap-3">
              <Input value={form.headshot_url || ''} onChange={set('headshot_url')} placeholder="https://… or upload" />
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={onUploadHeadshot} />
                <span className="inline-flex items-center justify-center rounded-md border border-border px-3 h-10 text-sm hover:bg-secondary">Upload</span>
              </label>
            </div>
            {form.headshot_url && <img src={form.headshot_url} alt="" className="mt-2 size-24 rounded-md object-cover border border-border" />}
          </div>
          <div className="space-y-1.5">
            <Label>Resume PDF</Label>
            <div className="flex items-center gap-3">
              <Input value={form.resume_url || ''} onChange={set('resume_url')} placeholder="https://… or upload" />
              <label className="cursor-pointer">
                <input type="file" accept="application/pdf" className="hidden" onChange={onUploadResume} />
                <span className="inline-flex items-center justify-center rounded-md border border-border px-3 h-10 text-sm hover:bg-secondary">Upload</span>
              </label>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Social links</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>GitHub</Label><Input value={form.github || ''} onChange={set('github')} /></div>
            <div className="space-y-1.5"><Label>LinkedIn</Label><Input value={form.linkedin || ''} onChange={set('linkedin')} /></div>
            <div className="space-y-1.5"><Label>Twitter / X</Label><Input value={form.twitter || ''} onChange={set('twitter')} /></div>
            <div className="space-y-1.5"><Label>Website</Label><Input value={form.website || ''} onChange={set('website')} /></div>
          </div>
        </CardContent></Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Saving…' : <><Save size={16} /> Save Profile</>}
          </Button>
        </div>
      </form>
    </div>
  )
}

function flattenSocials(p) {
  const s = p.socials || {}
  return { github: s.github || '', linkedin: s.linkedin || '', twitter: s.twitter || '', website: s.website || '' }
}
