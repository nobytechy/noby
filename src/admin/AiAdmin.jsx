/**
 * /admin/ai — runtime configuration for the Ask Noby bot.
 *
 * Admin can:
 *   • Choose the active provider (Groq / Anthropic / Gemini)
 *   • Paste / replace each provider's API key
 *   • Override the model identifier per provider
 *   • Edit the system prompt template (supports {{profile}}, {{projects}}, {{skills}})
 *   • Toggle the master kill-switch
 *
 * Keys are write-only from the UI: once saved they're masked with "•••••• [Set]"
 * and only replaced if the admin types into the input. The Supabase RLS policy
 * blocks all non-admin access; the public client never reads this table.
 */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Save, Sparkles, Zap, Bot, Power, Send, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Card, CardContent } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const PROVIDERS = [
  { id: 'groq',      label: 'Groq',       icon: Zap,       hint: 'Free tier, Llama 3.3 70B — fastest, no card required.' },
  { id: 'deepseek',  label: 'DeepSeek',   icon: Cpu,       hint: 'OpenAI-compatible. Very cheap ($0.27/M in, $1.10/M out). Free credit on signup.' },
  { id: 'anthropic', label: 'Anthropic',  icon: Sparkles,  hint: 'Claude Haiku 4.5 — paid, ~$0.001/turn with caching.' },
  { id: 'gemini',    label: 'Gemini',     icon: Bot,       hint: 'Google free tier — Gemini 2.0 Flash.' },
]

const KEY_FIELDS = [
  { provider: 'groq',      column: 'groq_api_key',      label: 'Groq API key',      placeholder: 'gsk_…',     hint: 'Get one at console.groq.com (free, no card).' },
  { provider: 'deepseek',  column: 'deepseek_api_key',  label: 'DeepSeek API key',  placeholder: 'sk-…',      hint: 'platform.deepseek.com → API keys. Free credits on signup.' },
  { provider: 'anthropic', column: 'anthropic_api_key', label: 'Anthropic API key', placeholder: 'sk-ant-…',  hint: 'console.anthropic.com → API keys. $5 free credit on signup.' },
  { provider: 'gemini',    column: 'gemini_api_key',    label: 'Gemini API key',    placeholder: 'AIza…',     hint: 'ai.google.dev → Get API key. Free tier 15 RPM.' },
]

export default function AiAdmin() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState(null)
  // Track which key fields the admin has actually typed into this session.
  // Only "dirty" key fields are sent on save — untouched ones are not overwritten.
  const [keyDirty, setKeyDirty] = useState({ groq_api_key: false, anthropic_api_key: false, gemini_api_key: false, deepseek_api_key: false })
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testReply, setTestReply] = useState('')

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('ai_settings').select('*').eq('id', 1).maybeSingle()
      if (error) { toast.error(error.message); return }
      if (!data) {
        toast.error('ai_settings row missing. Run migration 007_ai_chat.sql.')
        return
      }
      setSettings(data)
      // Don't expose raw key values in the form — mask them.
      setForm({
        ...data,
        groq_api_key: '',
        anthropic_api_key: '',
        gemini_api_key: '',
        deepseek_api_key: '',
      })
    })()
  }, [])

  if (!form) return <div className="text-muted-foreground">Loading…</div>

  const set = (k) => (e) => {
    const v = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e
    setForm((f) => ({ ...f, [k]: v }))
  }
  const setKey = (k) => (e) => {
    setKeyDirty((d) => ({ ...d, [k]: true }))
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }
  const hasExistingKey = (col) => Boolean(settings?.[col] && settings[col].length > 4)

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        provider: form.provider,
        is_enabled: form.is_enabled,
        groq_model: form.groq_model,
        anthropic_model: form.anthropic_model,
        gemini_model: form.gemini_model,
        deepseek_model: form.deepseek_model,
        system_prompt: form.system_prompt,
        max_tokens: Number(form.max_tokens) || 1024,
        temperature: Number(form.temperature) || 0.7,
      }
      // Only include API key fields the admin actually changed this session.
      KEY_FIELDS.forEach(({ column }) => {
        if (keyDirty[column] && form[column]?.trim()) payload[column] = form[column].trim()
      })
      const { data, error } = await supabase.from('ai_settings').update(payload).eq('id', 1).select().single()
      if (error) throw error
      setSettings(data)
      setKeyDirty({ groq_api_key: false, anthropic_api_key: false, gemini_api_key: false, deepseek_api_key: false })
      setForm((f) => ({ ...f, groq_api_key: '', anthropic_api_key: '', gemini_api_key: '', deepseek_api_key: '' }))
      toast.success('Saved')
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const onTest = async () => {
    setTesting(true); setTestReply('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'admin-test',
          messages: [{ role: 'user', content: 'In one sentence, what is the most impressive project Noby has shipped?' }],
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)
      setTestReply(`[${json.provider} · ${json.model} · ${json.latency_ms}ms]\n\n${json.content}`)
      toast.success(`Reply in ${json.latency_ms}ms`)
    } catch (err) {
      toast.error(err.message)
      setTestReply(`Error: ${err.message}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Ask Noby AI</h1>
      <p className="text-muted-foreground mt-1">Settings for the public chatbot at <a href="/chat" className="underline">/chat</a>. Keys are stored in Supabase and never exposed to the browser.</p>

      <form onSubmit={onSave} className="mt-8 space-y-6 max-w-3xl">
        {/* Master switch */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Power size={16} className={form.is_enabled ? 'text-primary' : 'text-muted-foreground'} />
                  <h2 className="text-lg font-semibold">Chat is {form.is_enabled ? 'ON' : 'OFF'}</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">When off, /chat returns a friendly "temporarily unavailable" message.</p>
              </div>
              <button
                type="button"
                onClick={() => set('is_enabled')({ target: { type: 'checkbox', checked: !form.is_enabled } })}
                className={cn(
                  'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                  form.is_enabled ? 'bg-primary' : 'bg-muted',
                )}
              >
                <span className={cn(
                  'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition',
                  form.is_enabled ? 'translate-x-5' : 'translate-x-0',
                )}/>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Provider picker */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Active provider</h2>
            <p className="text-sm text-muted-foreground -mt-2">The current provider used for every chat call. Swap any time — no redeploy.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PROVIDERS.map((p) => {
                const Icon = p.icon
                const active = form.provider === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set('provider')({ target: { value: p.id } })}
                    className={cn(
                      'rounded-lg border p-4 text-left transition',
                      active ? 'border-primary ring-2 ring-primary/30 bg-primary/5' : 'border-border hover:border-primary/50',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={active ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="font-semibold">{p.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{p.hint}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* API keys */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">API keys</h2>
            <p className="text-sm text-muted-foreground -mt-2">Type into a field to replace its key. Leave blank to keep the existing one.</p>
            {KEY_FIELDS.map((k) => (
              <div key={k.column} className="space-y-1.5">
                <Label className="flex items-center justify-between">
                  <span>{k.label}</span>
                  <span className={cn('text-[10px] uppercase tracking-wider', hasExistingKey(k.column) ? 'text-emerald-600' : 'text-muted-foreground')}>
                    {hasExistingKey(k.column) ? '● Set' : 'Not set'}
                  </span>
                </Label>
                <Input
                  type="password"
                  autoComplete="off"
                  value={form[k.column] || ''}
                  onChange={setKey(k.column)}
                  placeholder={hasExistingKey(k.column) ? '•••••• (type to replace)' : k.placeholder}
                />
                <p className="text-xs text-muted-foreground">{k.hint}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Models */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Models</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Groq model</Label><Input value={form.groq_model || ''} onChange={set('groq_model')} placeholder="llama-3.3-70b-versatile"/></div>
              <div className="space-y-1.5"><Label>DeepSeek model</Label><Input value={form.deepseek_model || ''} onChange={set('deepseek_model')} placeholder="deepseek-chat"/></div>
              <div className="space-y-1.5"><Label>Anthropic model</Label><Input value={form.anthropic_model || ''} onChange={set('anthropic_model')} placeholder="claude-haiku-4-5"/></div>
              <div className="space-y-1.5"><Label>Gemini model</Label><Input value={form.gemini_model || ''} onChange={set('gemini_model')} placeholder="gemini-2.0-flash-exp"/></div>
            </div>
          </CardContent>
        </Card>

        {/* Behaviour */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Behaviour</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Max tokens per reply <span className="text-xs text-muted-foreground">(64–8192)</span></Label>
                <Input type="number" min={64} max={8192} value={form.max_tokens ?? 1024} onChange={set('max_tokens')}/>
              </div>
              <div className="space-y-1.5">
                <Label>Temperature <span className="text-xs text-muted-foreground">(0 strict, 2 wild)</span></Label>
                <Input type="number" step="0.1" min={0} max={2} value={form.temperature ?? 0.7} onChange={set('temperature')}/>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>System prompt <span className="text-xs text-muted-foreground">— supports <code>{'{{profile}}'}</code> <code>{'{{projects}}'}</code> <code>{'{{skills}}'}</code></span></Label>
              <Textarea rows={14} value={form.system_prompt || ''} onChange={set('system_prompt')} className="font-mono text-xs"/>
            </div>
          </CardContent>
        </Card>

        {/* Test */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Test it</h2>
              <Button type="button" variant="outline" onClick={onTest} disabled={testing}>
                {testing ? 'Testing…' : <><Send size={14}/> Send test message</>}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Sends a fixed prompt through the live settings (saved or not). Useful for catching key / model mistakes before recruiters see them.</p>
            {testReply && (
              <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-secondary/50 p-3 text-xs">{testReply}</pre>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Saving…' : <><Save size={16}/> Save settings</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
