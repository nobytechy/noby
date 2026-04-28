import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { submitContact, getProfile } from '@/lib/queries'

const PROJECT_TYPES = [
  'Website / Landing page',
  'E-commerce / Online store',
  'WordPress / CMS site',
  'Custom web application',
  'Mobile app (Flutter / React Native)',
  'Payment integration',
  'API / Backend integration',
  'Other',
]
const BUDGET_RANGES = [
  'Under $500',
  '$500 – $2,000',
  '$2,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000+',
  'Not sure yet',
]
const TIMELINES = [
  'ASAP / This week',
  'Within 1 month',
  '1–3 months',
  '3+ months',
  'Flexible',
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '',
    project_type: '', budget_range: '', timeline: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [profile, setProfile] = useState(null)
  const location = useLocation()

  useEffect(() => { getProfile().then(setProfile).catch(() => {}) }, [])

  // Prefill from Brief Assistant or anywhere else routing here with state.prefill
  useEffect(() => {
    const pf = location.state?.prefill
    if (!pf) return
    setForm(f => ({
      ...f,
      message: pf.message ?? f.message,
      project_type: pf.project_type ?? f.project_type,
      budget_range: pf.budget_range ?? f.budget_range,
      timeline: pf.timeline ?? f.timeline,
      subject: pf.subject ?? f.subject,
    }))
    if (pf.message) {
      // small UX nudge so user knows it was prefilled
      toast.success('Brief loaded — review and send when ready')
    }
  }, [location.state])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in name, phone, and message.')
      return
    }
    setSubmitting(true)
    try {
      await submitContact({
        ...form,
        // empty optional fields -> null so DB doesn't store empty strings
        email: form.email || null,
        project_type: form.project_type || null,
        budget_range: form.budget_range || null,
        timeline: form.timeline || null,
      })
      toast.success('Message sent. I\'ll get back to you within 24 hours.')
      setForm({ name: '', email: '', phone: '', subject: '', project_type: '', budget_range: '', timeline: '', message: '' })
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <>
      <SEO title="Contact" path="/contact" description="Get in touch about a project. 24-hour response, fixed quotes." />

      <section className="container-x py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="text-sm text-primary font-medium">Get in touch</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Let's build something.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell me about your project — even a rough idea is fine. I respond within 24 hours
            with either a discovery-call invite or a referral if it's not a fit.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1 space-y-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-primary" />
              <div>
                <div className="font-semibold">Email</div>
                <a href={`mailto:${profile?.email || 'nobytechy@gmail.com'}`} className="text-muted-foreground hover:text-foreground">
                  {profile?.email || 'nobytechy@gmail.com'}
                </a>
              </div>
            </div>
            {profile?.phone && (
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-primary" />
                <div>
                  <div className="font-semibold">Phone / WhatsApp</div>
                  <a href={`tel:${profile.phone.replace(/\s/g,'')}`} className="text-muted-foreground hover:text-foreground">{profile.phone}</a>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-primary" />
              <div>
                <div className="font-semibold">Location</div>
                <div className="text-muted-foreground">{profile?.location || 'Harare, Zimbabwe — remote worldwide'}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 text-primary" />
              <div>
                <div className="font-semibold">Response time</div>
                <div className="text-muted-foreground">Within 24 hours, every weekday</div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="md:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input id="name" value={form.name} onChange={set('name')} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone / WhatsApp <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+263 77…"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="project_type">Project type</Label>
                <select id="project_type" value={form.project_type} onChange={set('project_type')} className={selectClass}>
                  <option value="">Select…</option>
                  {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget_range">Budget</Label>
                <select id="budget_range" value={form.budget_range} onChange={set('budget_range')} className={selectClass}>
                  <option value="">Select…</option>
                  {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="timeline">Timeline</Label>
                <select id="timeline" value={form.timeline} onChange={set('timeline')} className={selectClass}>
                  <option value="">Select…</option>
                  {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={set('subject')} placeholder="Optional" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Tell me about your project <span className="text-destructive">*</span></Label>
              <Textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={set('message')}
                placeholder="What problem are you trying to solve? Even a rough description helps."
                required
              />
            </div>

            <Button type="submit" size="lg" className="glow shine" disabled={submitting}>
              {submitting ? 'Sending…' : <>Send message <Send size={16} /></>}
            </Button>

            <p className="text-xs text-muted-foreground">
              Your details stay private. No spam, no list-selling, no follow-up unless you respond.
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
