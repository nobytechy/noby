import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// Dev-mode middleware that mounts /api/chat using the same module that the
// Netlify Function serves in production. Lets us test the bot locally without
// installing netlify-cli or running a second server.
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function askNobyDevApi(env) {
  return {
    name: 'ask-noby-dev-api',
    configureServer(server) {
      // Surface server-side env vars into process.env so the handler can read
      // them via the same mechanism it uses in Netlify.
      process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL || ''
      process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || ''

      // /api/chat — streaming SSE
      server.middlewares.use('/api/chat', async (req, res) => {
        // Exact path only — let /api/chat/suggest fall through to the handler below
        if (req.url && req.url.replace(/\?.*$/, '') !== '/' && req.url.replace(/\?.*$/, '') !== '') return
        if (req.method === 'OPTIONS') {
          res.writeHead(204, corsHeaders())
          return res.end()
        }
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'POST only' }))
        }
        let raw = ''
        for await (const chunk of req) raw += chunk
        let body = {}
        try { body = raw ? JSON.parse(raw) : {} }
        catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Invalid JSON' }))
        }
        res.writeHead(200, {
          ...corsHeaders(),
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        })
        try {
          const mod = await server.ssrLoadModule('/netlify/functions/chat.js')
          const ip = (req.socket?.remoteAddress || 'localhost').replace(/^::ffff:/, '')
          const userAgent = (req.headers['user-agent'] || '').slice(0, 240)
          for await (const evt of mod.runChat({ body, ip, userAgent })) {
            res.write(`data: ${JSON.stringify(evt)}\n\n`)
          }
        } catch (err) {
          console.error('[ask-noby-dev-api]', err)
          res.write(`data: ${JSON.stringify({ type: 'error', error: err.message || 'Internal error' })}\n\n`)
        }
        res.end()
      })

      // /api/chat/suggest — non-streaming JSON
      server.middlewares.use('/api/chat/suggest', async (req, res) => {
        if (req.method === 'OPTIONS') { res.writeHead(204, corsHeaders()); return res.end() }
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'POST only' }))
        }
        let raw = ''
        for await (const chunk of req) raw += chunk
        let body = {}
        try { body = raw ? JSON.parse(raw) : {} } catch { body = {} }
        try {
          const mod = await server.ssrLoadModule('/netlify/functions/suggest.js')
          const out = await mod.runSuggest({ body })
          res.writeHead(out.status, { ...corsHeaders(), 'Content-Type': 'application/json' })
          return res.end(JSON.stringify(out.json))
        } catch (err) {
          console.error('[ask-noby-suggest]', err)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: err.message || 'Internal error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load all env vars (not just VITE_-prefixed) so the dev plugin can wire
  // service-role secrets into process.env without committing them.
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [
    askNobyDevApi(env),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,            // we register manually via virtual:pwa-register/react
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: 'Noby — Full-Stack Developer',
        short_name: 'Noby',
        description: 'Full-stack developer · African payments specialist · Hire-me & ready-made systems.',
        theme_color: '#1aa169',
        background_color: '#fafdfa',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['business', 'productivity', 'developer'],
        icons: [
          { src: 'pwa-64x64.png',           sizes: '64x64',   type: 'image/png' },
          { src: 'pwa-192x192.png',         sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',         sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: false,           // wait for user to confirm reload
        skipWaiting: false,
        runtimeCaching: [
          // Never cache Supabase API — data must always be fresh.
          // The app's own cachedFetch handles offline fallback already.
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkOnly',
          },
          // Brand icons CDN — immutable, cache aggressively
          {
            urlPattern: /^https:\/\/cdn\.simpleicons\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'simple-icons',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google fonts — cache for a year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css', cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,                // don't run SW in dev
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  }
})
