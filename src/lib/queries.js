import { supabase } from './supabase'

export async function getProfile() {
  const { data, error } = await supabase.from('profile').select('*').limit(1).single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateProfile(id, patch) {
  const { data, error } = await supabase.from('profile').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function listProjects({ featuredOnly = false } = {}) {
  let q = supabase.from('projects').select('*').order('sort_order').order('created_at', { ascending: false })
  if (featuredOnly) q = q.eq('featured', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()
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

export async function listServices() {
  const { data, error } = await supabase.from('services').select('*').order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function listSkills() {
  const { data, error } = await supabase.from('skills').select('*').order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function listTestimonials() {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
  if (error) throw error
  return data ?? []
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

// Generic CRUD helpers for services/skills/testimonials
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

// Storage helpers
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
