import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { submitContact, getProfile } from '@/lib/queries'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => { getProfile().then(setProfile).catch(() => {}) }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in name, email, and message.')
      return
    }
    setSubmitting(true)
    try {
      await submitContact(form)
      toast.success('Message sent. I\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SEO title="Contact" path="/contact" description="Get in touch about a project." />

      <section className="container-x py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="text-sm text-muted-foreground">Get in touch</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Let's build something.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a project, an idea, or just a question? Drop a message and I'll respond within 24 hours.
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
                <div className="text-xs text-muted-foreground mt-0.5">Response within 24 hours</div>
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
          </div>

          <form onSubmit={onSubmit} className="md:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={set('name')} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={set('email')} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={set('subject')} placeholder="What's this about?" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={form.message} onChange={set('message')} required />
            </div>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? 'Sending…' : <>Send Message <Send size={16} /></>}
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}
