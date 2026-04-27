import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderGit2, Wrench, Sparkles, Users, Mail, User, LogOut, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Users },
  { to: '/admin/messages', label: 'Inbox', icon: Mail },
  { to: '/admin/profile', label: 'Profile', icon: User },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    nav('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="text-lg font-bold">
            <span className="gradient-text">noby</span><span>.dev</span>
          </Link>
          <div className="text-xs text-muted-foreground mt-1">Admin Panel</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <l.icon size={16} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Link to="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <ExternalLink size={16} /> View Site
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <LogOut size={16} /> Sign Out
          </button>
          <div className="px-3 pt-3 text-xs text-muted-foreground truncate">{user?.email}</div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="md:hidden border-b border-border p-4 flex items-center justify-between">
          <Link to="/admin" className="text-lg font-bold">
            <span className="gradient-text">noby</span><span>.dev</span>
          </Link>
          <button onClick={handleSignOut} className="text-sm text-muted-foreground"><LogOut size={16} /></button>
        </header>
        <div className="md:hidden border-b border-border overflow-x-auto">
          <nav className="flex gap-1 p-2">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap',
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                )}
              >
                <l.icon size={14} /> {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
