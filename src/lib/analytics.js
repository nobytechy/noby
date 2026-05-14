import { supabase } from './supabase'

const SESSION_KEY = 'noby-session-id'
const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|linkedin|twitter|googlebot|bingbot|preview|fetch|httpclient|curl|wget|python-requests/i

let lastTrackedPath = null

function getSessionId() {
  if (typeof sessionStorage === 'undefined') return 'no-storage'
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function detectDevice() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 0
  if (w === 0) return 'unknown'
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export async function trackPageView(path) {
  if (typeof window === 'undefined') return
  if (!path || path.startsWith('/admin')) return
  if (path === lastTrackedPath) return
  lastTrackedPath = path

  const ua = navigator.userAgent || ''
  if (BOT_RE.test(ua)) return

  try {
    await supabase.from('page_views').insert({
      path,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      user_agent: ua,
      language: navigator.language || null,
      screen_width: window.innerWidth,
      device_type: detectDevice(),
      is_bot: false,
    })
  } catch {
    // Silent — analytics must never block the user experience.
  }
}
