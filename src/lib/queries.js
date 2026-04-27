import { supabase } from './supabase'

// ============================================================================
// cachedFetch — robustness wrapper for read queries
// 1. Tries the fetch
// 2. On failure, retries once after a short delay
// 3. On final failure, returns the last successful result from localStorage
//    if available — so brief network blips never blank the page
// 4. On success, updates localStorage cache
// Cached values persist across reloads/sessions.
// ============================================================================
const CACHE_PREFIX = 'noby:cache:'
const RETRY_DELAY_MS = 600

async function cachedFetch(key, fetcher) {
  const cacheKey = CACHE_PREFIX + key
  const readCache = () => {
    try {
      const raw = localStorage.getItem(cacheKey)
      if (!raw) return undefined
      const parsed = JSON.parse(raw)
      return parsed?.value
    } catch { return undefined }
  }
  const writeCache = (value) => {
    try { localStorage.setItem(cacheKey, JSON.stringify({ value, savedAt: Date.now() })) } catch {}
  }

  let lastErr
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const fresh = await fetcher()
      writeCache(fresh)
      return fresh
    } catch (err) {
      lastErr = err
      if (attempt === 0) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
      }
    }
  }
  // Both attempts failed — fall back to cache if we have one
  const cached = readCache()
  if (cached !== undefined) {
    console.warn(`[query:${key}] using cached value after fetch failed:`, lastErr?.message || lastErr)
    return cached
  }
  throw lastErr
}

// ----------------------------------------------------------------------------
// Reads (wrapped with cachedFetch for resilience)
// ----------------------------------------------------------------------------

export async function getProfile() {
  return cachedFetch('profile', async () => {
    const { data, error } = await supabase.from('profile').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  })
}

export async function listProjects({ featuredOnly = false } = {}) {
  const key = featuredOnly ? 'projects:featured' : 'projects:all'
  return cachedFetch(key, async () => {
    let q = supabase.from('projects').select('*').order('sort_order').order('created_at', { ascending: false })
    if (featuredOnly) q = q.eq('featured', true)
    const { data, error } = await q
    if (error) throw error
    return data ?? []
  })
}

export async function getProjectBySlug(slug) {
  return cachedFetch(`project:${slug}`, async () => {
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()
    if (error) throw error
    return data
  })
}

export async function listServices() {
  return cachedFetch('services', async () => {
    const { data, error } = await supabase.from('services').select('*').order('sort_order')
    if (error) throw error
    return data ?? []
  })
}

export async function listSkills() {
  return cachedFetch('skills', async () => {
    const { data, error } = await supabase.from('skills').select('*').order('sort_order')
    if (error) throw error
    return data ?? []
  })
}

export async function listTestimonials() {
  return cachedFetch('testimonials', async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
    if (error) throw error
    return data ?? []
  })
}

export async function listProducts({ featuredOnly = false } = {}) {
  const key = featuredOnly ? 'products:featured' : 'products:all'
  return cachedFetch(key, async () => {
    let q = supabase.from('products').select('*').eq('is_published', true)
      .order('sort_order').order('created_at', { ascending: false })
    if (featuredOnly) q = q.eq('featured', true)
    const { data, error } = await q
    if (error) throw error
    return data ?? []
  })
}

export async function getProductBySlug(slug) {
  return cachedFetch(`product:${slug}`, async () => {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
    if (error) throw error
    return data
  })
}

// ----------------------------------------------------------------------------
// Writes (no caching — caching writes would mask failures)
// ----------------------------------------------------------------------------

export async function updateProfile(id, patch) {
  const { data, error } = await supabase.from('profile').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function createProject(payload) {
  const { data, error } = await supabase.from('projects').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id, patch) {
  const { data, error } = await supabase.from('projects').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function submitContact(payload) {
  const { error } = await supabase.from('contact_messages').insert(payload)
  if (error) throw error
}

export async function listContactMessages() {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function markMessageRead(id, isRead = true) {
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id)
  if (error) throw error
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}

// Generic CRUD helpers for admin pages (services/skills/testimonials/repos).
// Note: list() does NOT use cachedFetch — admin needs fresh data each time.
export const crud = (table) => ({
  list: async () => {
    const { data, error } = await supabase.from(table).select('*').order('sort_order')
    if (error) throw error
    return data ?? []
  },
  create: async (payload) => {
    const { data, error } = await supabase.from(table).insert(payload).select().single()
    if (error) throw error
    return data
  },
  update: async (id, patch) => {
    const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  remove: async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
  },
})

// ----------------------------------------------------------------------------
// Storage helpers
// ----------------------------------------------------------------------------

export async function uploadImage(file, folder = 'projects') {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('images').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data: pub } = supabase.storage.from('images').getPublicUrl(filename)
  return pub.publicUrl
}

export async function uploadDocument(file, folder = 'resumes') {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('documents').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data: pub } = supabase.storage.from('documents').getPublicUrl(filename)
  return pub.publicUrl
}
