import { Link } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/BrandIcons'
import { useEffect, useState } from 'react'
import { getProfile } from '@/lib/queries'
import Logo from '@/components/Logo'

export default function Footer() {
  const [profile, setProfile] = useState(null)
  useEffect(() => { getProfile().then(setProfile).catch(() => {}) }, [])
  const socials = profile?.socials || {}
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border">
      {/* CTA band */}
      <div className="border-b border-border">
        <div className="container-x py-14 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Let&apos;s work together</div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.02]">
              Have a project<br />in mind?
            </h2>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity glow"
          >
            Book a call <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="container-x py-12 flex flex-col md:flex-row gap-10 justify-between">
        <div className="max-w-md">
          <Logo size="lg" />
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {profile?.tagline || 'Full-stack developer building modern web applications for direct clients.'}
          </p>
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <Mail size={14} /> {profile.email}
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-16">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Site</div>
            <ul className="space-y-2.5 text-sm">
              {[['/services', 'Services'], ['/products', 'Products'], ['/projects', 'Projects'], ['/process', 'Process'], ['/about', 'About'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-muted-foreground hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Connect</div>
            <div className="flex flex-wrap gap-2.5">
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2.5 rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
                  <GithubIcon size={16} />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
                  <LinkedinIcon size={16} />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="p-2.5 rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
                  <TwitterIcon size={16} />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} aria-label="Email" className="p-2.5 rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
                  <Mail size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <div>© {year} {profile?.full_name || 'Noby'}. All rights reserved.</div>
          <Link to="/admin/login" className="hover:text-foreground">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
