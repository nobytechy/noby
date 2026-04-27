import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
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
      <div className="container-x py-12 flex flex-col md:flex-row gap-8 justify-between">
        <div className="max-w-md">
          <Logo size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">
            {profile?.tagline || 'Full-stack developer building modern web applications for direct clients.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12">
          <div>
            <div className="text-sm font-semibold mb-3">Site</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3">Connect</div>
            <div className="flex gap-3">
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 rounded-md border border-border hover:bg-secondary">
                  <GithubIcon size={16} />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-md border border-border hover:bg-secondary">
                  <LinkedinIcon size={16} />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="p-2 rounded-md border border-border hover:bg-secondary">
                  <TwitterIcon size={16} />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} aria-label="Email" className="p-2 rounded-md border border-border hover:bg-secondary">
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
