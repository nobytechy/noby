import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { trackPageView } from '@/lib/analytics'

export default function AnalyticsTracker() {
  const { pathname } = useLocation()
  const { session, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (session) return
    trackPageView(pathname)
  }, [pathname, session, loading])

  return null
}
