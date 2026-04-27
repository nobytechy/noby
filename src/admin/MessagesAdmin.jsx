import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, MailOpen, Mail, Reply } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { listContactMessages, markMessageRead, deleteMessage } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([])
  const [active, setActive] = useState(null)

  const load = () => listContactMessages().then(setMessages).catch(e => toast.error(e.message))
  useEffect(() => { load() }, [])

  const onOpen = async (m) => {
    setActive(m)
    if (!m.is_read) {
      try { await markMessageRead(m.id, true); load() } catch {}
    }
  }
  const onDelete = async (m) => {
    if (!confirm('Delete this message?')) return
    try { await deleteMessage(m.id); toast.success('Deleted'); setActive(null); load() }
    catch (err) { toast.error(err.message) }
  }
  const onToggleRead = async (m) => {
    try { await markMessageRead(m.id, !m.is_read); load() }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Inbox</h1>
      <p className="text-muted-foreground mt-1">Messages from your contact form.</p>

      <div className="mt-8 grid md:grid-cols-5 gap-6 min-h-[60vh]">
        <div className="md:col-span-2">
          {messages.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              No messages yet.
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map(m => (
                <button
                  key={m.id}
                  onClick={() => onOpen(m)}
                  className={
                    'w-full text-left rounded-lg border border-border p-4 hover:border-primary/50 transition-colors ' +
                    (active?.id === m.id ? 'border-primary' : '') +
                    (!m.is_read ? ' bg-secondary/40' : '')
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold truncate">{m.name}</div>
                    {!m.is_read && <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  <div className="text-sm mt-1 truncate">{m.subject || m.message}</div>
                  <div className="text-xs text-muted-foreground mt-2">{formatDate(m.created_at)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-3">
          {active ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{active.subject || '(no subject)'}</h2>
                    <div className="text-sm text-muted-foreground mt-1">
                      From <span className="font-medium text-foreground">{active.name}</span> &lt;{active.email}&gt;
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDate(active.created_at)}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button asChild size="sm" variant="outline">
                      <a href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject || '')}`}>
                        <Reply size={14} /> Reply
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onToggleRead(active)}>
                      {active.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(active)} className="text-destructive hover:text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div className="mt-6 whitespace-pre-line text-sm leading-relaxed">{active.message}</div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground h-full flex items-center justify-center">
              Select a message to read.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
