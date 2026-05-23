/**
 * /chat — Ask Noby AI public page.
 *
 * v2: streaming responses + tool-use indicators + dynamic follow-up chips.
 *
 * Wire format from /api/chat (Server-Sent Events):
 *   data: {"type":"start", "provider":"…", "model":"…"}
 *   data: {"type":"delta", "text":"…"}
 *   data: {"type":"tool_start", "name":"…"}
 *   data: {"type":"tool_end", "name":"…", "summary":"…"}
 *   data: {"type":"usage", "tokens_in":…, "tokens_out":…}
 *   data: {"type":"done", "latency_ms":…}
 *   data: {"type":"error", "error":"…"}
 */
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Loader2, Bot, RefreshCw, User, Wrench, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const STARTERS = [
  'What does Noby do?',
  'Tell me about his most impressive project.',
  "What's his experience with payment integrations?",
  "Is he available for remote work?",
  'Show me his AI / Claude experience.',
]

const GREETING = "Hi! I'm Noby's AI assistant. Ask me anything about his work, skills, projects or experience — I'll point you to the live URLs so you can verify everything yourself."

function newSessionId() {
  return 'sess-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now()
}

// Friendly labels for tool names — shown to the user as the bot "looks something up"
const TOOL_LABELS = {
  find_projects_by_tech: 'Searching projects',
  get_project_detail:    'Reading project details',
  list_skills:           'Listing skills',
}

export default function Chat() {
  const [sessionId] = useState(() => newSessionId())
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING, tools: [] }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [providerHint, setProviderHint] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  const send = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || busy) return
    setInput('')
    setSuggestions([])

    // Push the user message + an empty assistant placeholder we'll stream into.
    const userMsg = { role: 'user', content: trimmed }
    const assistantMsg = { role: 'assistant', content: '', tools: [], streaming: true }
    const baseMessages = [...messages, userMsg]
    setMessages([...baseMessages, assistantMsg])
    setBusy(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: baseMessages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      if (!res.ok || !res.body) {
        const errBody = await res.text().catch(() => '')
        throw new Error(errBody || `HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let gotAnyDelta = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop()
        for (const block of events) {
          const line = block.split('\n').find((l) => l.startsWith('data: '))
          if (!line) continue
          const payload = line.slice(6).trim()
          if (!payload) continue
          let evt
          try { evt = JSON.parse(payload) } catch { continue }

          if (evt.type === 'start') {
            setProviderHint({ provider: evt.provider, model: evt.model, latencyMs: null })
          } else if (evt.type === 'delta') {
            gotAnyDelta = true
            setMessages((arr) => updateLast(arr, (m) => ({ ...m, content: (m.content || '') + evt.text })))
          } else if (evt.type === 'tool_start') {
            setMessages((arr) => updateLast(arr, (m) => ({
              ...m,
              tools: [...(m.tools || []), { name: evt.name, summary: null, active: true }],
            })))
          } else if (evt.type === 'tool_end') {
            setMessages((arr) => updateLast(arr, (m) => ({
              ...m,
              tools: (m.tools || []).map((t, i, all) => (
                i === all.length - 1 || (t.name === evt.name && t.active)
                  ? { ...t, active: false, summary: evt.summary }
                  : t
              )),
            })))
          } else if (evt.type === 'done') {
            setProviderHint((p) => p ? { ...p, latencyMs: evt.latency_ms } : { latencyMs: evt.latency_ms })
            setMessages((arr) => updateLast(arr, (m) => ({ ...m, streaming: false })))
          } else if (evt.type === 'error') {
            setMessages((arr) => updateLast(arr, (m) => ({ ...m, content: m.content || `Sorry — ${evt.error}`, error: true, streaming: false })))
          }
        }
      }

      // Empty stream — show a fallback message rather than a blank bubble.
      if (!gotAnyDelta) {
        setMessages((arr) => updateLast(arr, (m) => ({
          ...m,
          content: m.content || 'No response. Try again or rephrase.',
          streaming: false,
        })))
      }
    } catch (err) {
      toast.error('Network error — try again')
      setMessages((arr) => updateLast(arr, (m) => ({
        ...m,
        content: m.content || `Network error: ${err.message}`,
        error: true,
        streaming: false,
      })))
    } finally {
      setBusy(false)
      setTimeout(() => inputRef.current?.focus(), 80)
      // Fire follow-up suggestions — fire-and-forget, never block the UI.
      fetchSuggestions([...baseMessages, { role: 'assistant', content: '' }])
    }
  }

  const fetchSuggestions = async (currentMessages) => {
    try {
      // Send the actual last assistant content if available
      setMessages((arr) => {
        const fresh = arr.slice(-6).map((m) => ({ role: m.role, content: m.content }))
        // Fire the request inside an effect-safe wrapper
        ;(async () => {
          try {
            const res = await fetch('/api/chat/suggest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, messages: fresh }),
            })
            if (!res.ok) return
            const json = await res.json()
            if (Array.isArray(json.suggestions)) setSuggestions(json.suggestions.slice(0, 3))
          } catch { /* silent */ }
        })()
        return arr
      })
    } catch { /* silent */ }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }
  const reset = () => {
    setMessages([{ role: 'assistant', content: GREETING, tools: [] }])
    setInput(''); setProviderHint(null); setSuggestions([])
  }

  const showStarters = messages.length === 1 && !busy
  const showSuggestions = !busy && suggestions.length > 0 && messages.length > 1

  return (
    <>
      <Helmet>
        <title>Ask Noby — AI portfolio assistant</title>
        <meta name="description" content="Ask anything about Noby's work, projects and experience. Powered by an AI assistant that draws on his live portfolio."/>
      </Helmet>

      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-gradient-to-br from-primary/10 via-card to-card px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Sparkles size={20}/>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Ask Noby</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">AI assistant trained on Noby's live portfolio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                title="Start a new conversation"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
              >
                <RefreshCw size={12}/> Reset
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="h-[420px] md:h-[520px] overflow-y-auto px-4 py-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {m.role === 'assistant' && (
                    <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary mt-0.5">
                      <Bot size={14}/>
                    </div>
                  )}
                  <div className="max-w-[78%] space-y-1.5">
                    {/* Tool chips above the message bubble */}
                    {m.tools && m.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.tools.map((t, ti) => (
                          <span
                            key={ti}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
                              t.active
                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-300 dark:ring-amber-800'
                                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-300 dark:ring-emerald-800',
                            )}
                          >
                            {t.active
                              ? <Loader2 size={10} className="animate-spin"/>
                              : <CheckCircle2 size={10}/>}
                            <Wrench size={10}/>
                            <span>{TOOL_LABELS[t.name] || t.name}{t.summary ? ` · ${t.summary}` : ''}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Actual message bubble */}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : m.error
                            ? 'bg-destructive/10 text-destructive border border-destructive/30 rounded-bl-sm'
                            : 'bg-secondary text-foreground rounded-bl-sm',
                      )}
                    >
                      {m.streaming && !m.content
                        ? <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Loader2 size={12} className="animate-spin"/> Thinking…</span>
                        : <>
                            {renderMarkdown(m.content)}
                            {m.streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-current animate-pulse align-middle"/>}
                          </>}
                    </div>
                  </div>
                  {m.role === 'user' && (
                    <div className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground mt-0.5">
                      <User size={14}/>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Dynamic follow-up chips appear below the conversation */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="pt-1"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 ml-9">Suggested follow-ups</p>
                  <div className="ml-9 flex flex-wrap gap-1.5">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary hover:bg-primary/10 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Starter prompts (only on fresh chat) */}
          {showStarters && (
            <div className="border-t border-border px-4 py-3 bg-secondary/30">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Try asking</p>
              <div className="flex flex-wrap gap-1.5">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-border bg-card p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Ask about Noby's work — Enter to send, Shift+Enter for a new line"
                disabled={busy}
                className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                style={{ maxHeight: 140 }}
              />
              <Button onClick={() => send()} disabled={busy || !input.trim()} size="default" className="shrink-0">
                {busy ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          {providerHint
            ? <>Powered by <span className="font-semibold">{providerHint.provider}</span>{providerHint.model ? ` · ${providerHint.model}` : ''}{providerHint.latencyMs ? ` · last reply in ${providerHint.latencyMs}ms` : ''}</>
            : <>AI replies can be wrong — verify against the live project URLs.</>}
        </p>
      </div>
    </>
  )
}

// Replace the LAST element of an array via a producer function.
function updateLast(arr, fn) {
  if (arr.length === 0) return arr
  const next = arr.slice(0, -1)
  next.push(fn(arr[arr.length - 1]))
  return next
}

// ─── Lightweight markdown rendering (links, bold, lists, line breaks) ─────

function renderMarkdown(text) {
  if (!text) return null
  const lines = String(text).split(/\r?\n/)
  const out = []
  let listBuffer = null
  const flushList = () => {
    if (listBuffer) {
      out.push(
        <ul key={`l-${out.length}`} className="list-disc list-inside space-y-0.5 my-1">
          {listBuffer.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
        </ul>
      )
      listBuffer = null
    }
  }
  lines.forEach((line, i) => {
    const m = line.match(/^\s*[-*]\s+(.*)$/)
    if (m) { if (!listBuffer) listBuffer = []; listBuffer.push(m[1]) }
    else {
      flushList()
      if (line.trim() === '') out.push(<div key={`b-${i}`} className="h-2"/>)
      else out.push(<div key={`p-${i}`}>{renderInline(line)}</div>)
    }
  })
  flushList()
  return out
}

function renderInline(s) {
  const urlRe = /(https?:\/\/[^\s)]+)/g
  const parts = []
  let last = 0
  let m
  while ((m = urlRe.exec(s)) !== null) {
    if (m.index > last) parts.push(s.slice(last, m.index))
    parts.push({ url: m[0] })
    last = m.index + m[0].length
  }
  if (last < s.length) parts.push(s.slice(last))
  return parts.map((p, i) => {
    if (typeof p === 'object' && p.url) {
      return (
        <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80 break-all">
          {p.url}
        </a>
      )
    }
    const segs = String(p).split(/(\*\*[^*]+\*\*)/g)
    return segs.map((seg, j) => {
      if (/^\*\*[^*]+\*\*$/.test(seg)) return <strong key={`${i}-${j}`}>{seg.slice(2, -2)}</strong>
      return <span key={`${i}-${j}`}>{seg}</span>
    })
  })
}
