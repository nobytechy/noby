import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'
import { GithubIcon } from '@/components/BrandIcons'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/projects', label: 'Projects' },
  { to: '/designs', label: 'Designs' },
  { to: '/process', label: 'Process' },
  { to: '/faq', label: 'FAQ' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled ? 'glass border-b border-border' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" aria-label="Noby — home" className="group">
          <Logo size="md" className="transition-transform duration-300 group-hover:-rotate-3" />
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => cn(
                'px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/nobytechy"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <GithubIcon size={18} />
          </a>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-md hover:bg-secondary transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NavLink
            to="/chat"
            className={({ isActive }) => cn(
              'hidden sm:inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors',
              isActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10',
            )}
          >
            <Sparkles size={12} /> Ask AI
          </NavLink>
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center rounded-sm bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity glow"
          >
            Book a call
          </Link>
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-md hover:bg-secondary"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border glass"
          >
            <nav className="container-x py-4 flex flex-col gap-1">
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn(
                    'px-3 py-3 rounded-md text-sm font-medium uppercase tracking-wider',
                    isActive ? 'bg-secondary text-primary' : 'text-muted-foreground',
                  )}
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink
                to="/chat"
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn(
                  'mt-2 inline-flex justify-center items-center gap-1.5 rounded-sm border border-primary/30 px-4 py-3 text-sm font-semibold uppercase tracking-wider',
                  isActive ? 'bg-primary/10 text-primary' : 'text-primary bg-primary/5',
                )}
              >
                <Sparkles size={14} /> Ask AI
              </NavLink>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center items-center rounded-sm bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
              >
                Book a call
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
