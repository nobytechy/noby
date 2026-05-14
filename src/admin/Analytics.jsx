import { useEffect, useMemo, useState } from 'react'
import { Eye, Users, TrendingUp, Smartphone, Monitor, Tablet, ExternalLink, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'

const DAY_MS = 24 * 60 * 60 * 1000
const FETCH_LIMIT = 5000

const deviceIcon = { mobile: Smartphone, tablet: Tablet, desktop: Monitor }

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function fmtTime(d) {
  return new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function shortReferrer(r) {
  if (!r) return 'Direct'
  try {
    const u = new URL(r)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return r.slice(0, 40)
  }
}

export default function Analytics() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const since = new Date(Date.now() - 30 * DAY_MS).toISOString()
    supabase
      .from('page_views')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(FETCH_LIMIT)
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) console.error(error)
        setRows(data || [])
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const stats = useMemo(() => {
    const now = Date.now()
    const startToday = startOfDay(now).getTime()
    const start7 = now - 7 * DAY_MS
    const start30 = now - 30 * DAY_MS

    const inWindow = (since) => rows.filter(r => new Date(r.created_at).getTime() >= since)

    const today = inWindow(startToday)
    const last7 = inWindow(start7)
    const last30 = inWindow(start30)

    const uniq = (arr) => new Set(arr.map(r => r.session_id)).size

    return {
      todayViews: today.length,
      todaySessions: uniq(today),
      week: last7.length,
      weekSessions: uniq(last7),
      month: last30.length,
      monthSessions: uniq(last30),
    }
  }, [rows])

  const topPages = useMemo(() => {
    const counts = new Map()
    for (const r of rows) counts.set(r.path, (counts.get(r.path) || 0) + 1)
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [rows])

  const referrers = useMemo(() => {
    const counts = new Map()
    for (const r of rows) {
      const k = shortReferrer(r.referrer)
      counts.set(k, (counts.get(k) || 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [rows])

  const deviceCounts = useMemo(() => {
    const counts = { mobile: 0, tablet: 0, desktop: 0, unknown: 0 }
    for (const r of rows) counts[r.device_type || 'unknown'] = (counts[r.device_type || 'unknown'] || 0) + 1
    return counts
  }, [rows])

  const days14 = useMemo(() => {
    const buckets = []
    for (let i = 13; i >= 0; i--) {
      const day = startOfDay(Date.now() - i * DAY_MS)
      buckets.push({ day, views: 0, sessions: new Set() })
    }
    for (const r of rows) {
      const t = new Date(r.created_at).getTime()
      const idx = Math.floor((t - buckets[0].day.getTime()) / DAY_MS)
      if (idx >= 0 && idx < 14) {
        buckets[idx].views++
        buckets[idx].sessions.add(r.session_id)
      }
    }
    const max = Math.max(1, ...buckets.map(b => b.views))
    return buckets.map(b => ({ day: b.day, views: b.views, sessions: b.sessions.size, pct: (b.views / max) * 100 }))
  }, [rows])

  const recent = rows.slice(0, 25)

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Visitor activity over the last 30 days. Admin sessions are not tracked.</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <Card className="mt-10">
          <CardContent className="p-10 text-center text-muted-foreground">
            No visitor data yet. Once people start visiting your portfolio, their activity will appear here.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary cards */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard icon={Eye} label="Today" value={stats.todayViews} sub={`${stats.todaySessions} sessions`} />
            <SummaryCard icon={TrendingUp} label="Last 7 days" value={stats.week} sub={`${stats.weekSessions} sessions`} />
            <SummaryCard icon={Activity} label="Last 30 days" value={stats.month} sub={`${stats.monthSessions} sessions`} />
            <SummaryCard icon={Users} label="Unique sessions (30d)" value={stats.monthSessions} sub={`${(stats.month / Math.max(1, stats.monthSessions)).toFixed(1)} views/session`} />
          </div>

          {/* 14-day chart */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-base">Last 14 days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1.5 h-40">
                {days14.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group" title={`${fmtDate(b.day)} — ${b.views} views, ${b.sessions} sessions`}>
                    <div className="w-full bg-secondary rounded-t-sm relative" style={{ height: `${Math.max(2, b.pct)}%` }}>
                      <div className="absolute inset-0 bg-primary rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[10px] text-muted-foreground">{fmtDate(b.day)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top pages + Referrers */}
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Top pages</CardTitle></CardHeader>
              <CardContent className="p-0 divide-y divide-border">
                {topPages.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">No pages yet.</div>
                ) : topPages.map(([path, count]) => (
                  <div key={path} className="flex items-center justify-between gap-4 p-4">
                    <a href={path} target="_blank" rel="noreferrer" className="text-sm font-medium truncate hover:text-primary inline-flex items-center gap-1.5 min-w-0">
                      <span className="truncate">{path}</span>
                      <ExternalLink size={12} className="shrink-0 opacity-60" />
                    </a>
                    <span className="text-sm font-semibold shrink-0">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Top referrers</CardTitle></CardHeader>
              <CardContent className="p-0 divide-y divide-border">
                {referrers.map(([ref, count]) => (
                  <div key={ref} className="flex items-center justify-between gap-4 p-4">
                    <span className="text-sm font-medium truncate">{ref}</span>
                    <span className="text-sm font-semibold shrink-0">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Devices */}
          <Card className="mt-8">
            <CardHeader><CardTitle className="text-base">Devices</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              {[['mobile', 'Mobile'], ['tablet', 'Tablet'], ['desktop', 'Desktop']].map(([k, label]) => {
                const Icon = deviceIcon[k]
                return (
                  <div key={k} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                    <Icon size={18} className="text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="text-lg font-semibold">{deviceCounts[k] || 0}</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="mt-8">
            <CardHeader><CardTitle className="text-base">Recent activity</CardTitle></CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {recent.map((r) => {
                const Icon = deviceIcon[r.device_type] || Monitor
                return (
                  <div key={r.id} className="flex items-center gap-3 p-4">
                    <Icon size={16} className="text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.path}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {shortReferrer(r.referrer)} · {fmtTime(r.created_at)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, sub }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm text-muted-foreground">{label}</div>
          <Icon size={16} className="text-muted-foreground" />
        </div>
        <div className="text-3xl font-bold mt-2">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  )
}
