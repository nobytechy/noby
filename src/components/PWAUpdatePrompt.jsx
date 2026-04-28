import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Sparkles, X } from 'lucide-react'

/**
 * Listens for service-worker updates and shows a non-blocking
 * "New version available" card bottom-left. Clicking Reload activates
 * the new SW and reloads. Dismiss leaves the user on the old version
 * until they manually refresh.
 *
 * Mounted once at the app root. Renders nothing in dev (devOptions.enabled = false).
 */
export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl) {
      // Optional: poll for updates every hour
      if ('serviceWorker' in navigator) {
        setInterval(async () => {
          try {
            const reg = await navigator.serviceWorker.getRegistration(swUrl)
            if (reg) reg.update()
          } catch {}
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(err) {
      console.error('[PWA] SW registration failed:', err)
    },
  })

  // Auto-dismiss the "ready offline" toast after 5s — non-actionable, just informative
  useEffect(() => {
    if (!offlineReady) return
    const t = setTimeout(() => setOfflineReady(false), 5000)
    return () => clearTimeout(t)
  }, [offlineReady, setOfflineReady])

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          key="update"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{    opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="fixed bottom-5 left-5 z-[55] w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-primary/40 bg-card shadow-xl overflow-hidden"
          role="status"
          aria-live="polite"
        >
          <div className="aurora absolute inset-0 -z-10" />
          <div className="p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">New version available</div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  An updated build is ready. Reload to get the latest UI &amp; fixes.
                </p>
              </div>
              <button
                onClick={() => setNeedRefresh(false)}
                aria-label="Dismiss"
                className="text-muted-foreground hover:text-foreground -mt-0.5 -mr-1 p-1"
              >
                <X size={14} />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => updateServiceWorker(true)}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold glow shine"
              >
                <RefreshCw size={12} /> Reload now
              </button>
              <button
                onClick={() => setNeedRefresh(false)}
                className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {offlineReady && !needRefresh && (
        <motion.div
          key="offline"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-5 left-5 z-[55] rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground shadow-lg"
          role="status"
          aria-live="polite"
        >
          <span className="text-primary font-medium">Ready for offline.</span> The app will keep working without internet.
        </motion.div>
      )}
    </AnimatePresence>
  )
}
