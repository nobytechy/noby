import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import { Card, CardContent } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'

/**
 * Fetches admin-pinned repos from the pinned_repos table; for each one,
 * pulls live metadata from GitHub's public REST API (no token).
 * If no repos are pinned, falls back to "top by stars" on the user's profile.
 * Fail-quiet: renders nothing if both sources fail.
 */
async function fetchRepoMeta(fullName) {
  const r = await fetch(`https://api.github.com/repos/${fullName}`)
  if (!r.ok) throw new Error(`Failed: ${fullName}`)
  return r.json()
}

export default function GithubRepos({ username = 'nobytechy', max = 6 }) {
  const [repos, setRepos] = useState(null) // null = loading

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: pinned } = await supabase
          .from('pinned_repos')
          .select('*')
          .order('sort_order')

        if (pinned && pinned.length) {
          // Resolve each pinned entry to live metadata
          const results = await Promise.allSettled(pinned.map(p => fetchRepoMeta(p.repo_full_name)))
          const merged = results
            .map((r, i) => r.status === 'fulfilled'
              ? { ...r.value, _description_override: pinned[i].description_override }
              : null)
            .filter(Boolean)
          if (!cancelled) setRepos(merged)
        } else {
          // Fallback: top public repos by stars for the configured username
          const r = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`)
          const rows = r.ok ? await r.json() : []
          const top = (Array.isArray(rows) ? rows : [])
            .filter(x => !x.fork && !x.archived)
            .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)))
            .slice(0, max)
          if (!cancelled) setRepos(top)
        }
      } catch {
        if (!cancelled) setRepos([])
      }
    })()
    return () => { cancelled = true }
  }, [username, max])

  if (repos == null) {
    return (
      <section className="container-x py-16">
        <div className="text-center mb-10">
          <div className="text-sm text-primary font-medium">Open source</div>
          <h2 className="text-3xl md:text-4xl font-bold mt-1">From my GitHub</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg border border-border animate-pulse bg-card" />
          ))}
        </div>
      </section>
    )
  }
  if (!repos.length) return null

  return (
    <section className="container-x py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-sm text-primary font-medium">Open source</div>
          <h2 className="text-3xl md:text-4xl font-bold mt-1">From my GitHub</h2>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank" rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary group"
        >
          <GithubIcon size={14} /> @{username} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.slice(0, max).map((r, i) => (
          <motion.a
            key={r.id}
            href={r.html_url}
            target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="block h-full"
          >
            <Card className="h-full hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shine">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-2 text-primary">
                  <GithubIcon size={14} />
                  <span className="text-sm font-semibold truncate">{r.name}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                  {r._description_override || r.description || 'No description.'}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {r.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary/70" />
                      {r.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1"><Star size={12} /> {r.stargazers_count}</span>
                  <span className="inline-flex items-center gap-1"><GitFork size={12} /> {r.forks_count}</span>
                </div>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
