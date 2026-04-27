import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderGit2, Wrench, Sparkles, Users, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'

const counters = [
  { table: 'projects', label: 'Projects', icon: FolderGit2, to: '/admin/projects' },
  { table: 'services', label: 'Services', icon: Wrench, to: '/admin/services' },
  { table: 'skills', label: 'Skills', icon: Sparkles, to: '/admin/skills' },
  { table: 'testimonials', label: 'Testimonials', icon: Users, to: '/admin/testimonials' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({})
  const [unread, setUnread] = useState(0)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    Promise.all(counters.map(c =>
      supabase.from(c.table).select('id', { count: 'exact', head: true }).then(r => [c.table, r.count ?? 0])
    )).then(rows => setCounts(Object.fromEntries(rows)))

    supabase.from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)
      .then(r => setUnread(r.count ?? 0))

    supabase.from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(r => setRecent(r.data ?? []))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Quick overview of your portfolio.</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {counters.map(c => (
          <Link key={c.table} to={c.to}>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  <div className="text-3xl font-bold mt-1">{counts[c.table] ?? '—'}</div>
                </div>
                <c.icon className="text-muted-foreground" size={24} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent messages</h2>
          <Link to="/admin/messages" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <Mail size={14} /> Inbox {unread > 0 && <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs px-1.5">{unread}</span>}
          </Link>
        </div>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {recent.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No messages yet.</div>
            ) : recent.map(m => (
              <Link key={m.id} to="/admin/messages" className="flex items-start justify-between gap-4 p-4 hover:bg-secondary/40">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{m.name} <span className="text-muted-foreground font-normal">— {m.email}</span></div>
                  <div className="text-sm text-muted-foreground truncate">{m.subject || m.message}</div>
                </div>
                {!m.is_read && <span className="size-2 rounded-full bg-primary mt-2 shrink-0" />}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
