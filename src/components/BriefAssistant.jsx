import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Loader2, RefreshCw, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'

const PROJECT_TYPES = [
  '— let me detect —',
  'Website / Landing page',
  'E-commerce / Online store',
  'WordPress / CMS site',
  'Custom web application',
  'Mobile app (Flutter / React Native)',
  'Payment integration',
  'API / Backend integration',
]

// Simple rule-based brief generator. Doesn't call an external API — instead it
// detects keywords and produces a structured starting brief. Works offline,
// costs nothing, and gives visitors a useful artifact they can hand back.
function generateBrief(text, explicitType) {
  const t = (text || '').toLowerCase()
  const wc = t.split(/\s+/).filter(Boolean).length
  const has = (re) => re.test(t)

  // 1. Detect project type
  let type = explicitType
  if (!type || type.startsWith('—')) {
    if (has(/wordpress|woocommerce|wp\b/)) type = 'WordPress / CMS site'
    else if (has(/mobile|android|ios|app store|play store|flutter|react native/)) type = 'Mobile app (Flutter / React Native)'
    else if (has(/shop|store|ecommerce|cart|checkout|product listing/)) type = 'E-commerce / Online store'
    else if (has(/payment|ecocash|paynow|zimswitch|innbucks|stripe|paypal|gateway/)) type = 'Payment integration'
    else if (has(/api|integration|webhook|third-party|third party/)) type = 'API / Backend integration'
    else if (has(/landing|brochure|company site|portfolio|one[- ]?pager/)) type = 'Website / Landing page'
    else type = 'Custom web application'
  }

  // 2. Suggested stack from keywords + project type
  const stack = new Set()
  if (type.includes('WordPress')) ['WordPress', 'PHP', 'MySQL'].forEach(s => stack.add(s))
  if (type.includes('Mobile')) ['Flutter', 'Firebase'].forEach(s => stack.add(s))
  if (type.includes('E-commerce')) ['WooCommerce', 'Stripe / PayPal'].forEach(s => stack.add(s))
  if (type.includes('Payment')) ['PayNow', 'Ecocash API', 'PHP'].forEach(s => stack.add(s))

  if (has(/laravel/))                    ['Laravel', 'PHP', 'MySQL'].forEach(s => stack.add(s))
  if (has(/django|python/))              ['Django', 'Python', 'PostgreSQL'].forEach(s => stack.add(s))
  if (has(/react|next/))                 ['React', 'Tailwind CSS'].forEach(s => stack.add(s))
  if (has(/vue/))                        stack.add('Vue.js')
  if (has(/whatsapp/))                   stack.add('WhatsApp Business API')
  if (has(/ai|chatbot|gpt|claude|deepseek|openai|llm/))
                                         stack.add('OpenAI / DeepSeek API')
  if (has(/auth|login|signup|user account/))
                                         stack.add('Supabase Auth')
  if (has(/realtime|live|chat|notifications/))
                                         stack.add('Supabase Realtime')

  if (!stack.size) ['Laravel', 'React', 'PostgreSQL', 'Tailwind CSS'].forEach(s => stack.add(s))

  // 3. Complexity heuristic → timeline + budget
  const complexitySignals =
    (t.match(/multiple|complex|enterprise|integration|custom|advanced|dashboard|admin panel|payment|crm|analytics|workflow/g) || []).length
  let timeline, budget
  if (complexitySignals >= 3 || wc > 80) {
    timeline = '8–12 weeks'; budget = '$5,000 – $15,000'
  } else if (complexitySignals >= 1 || wc > 30) {
    timeline = '4–8 weeks';  budget = '$2,000 – $5,000'
  } else {
    timeline = '2–4 weeks';  budget = '$500 – $2,000'
  }

  // 4. Suggested next steps
  const steps = [
    '20-min discovery call to confirm scope and constraints',
    'Fixed-quote proposal with milestone breakdown (within 2–4 days)',
    `Build phase with weekly preview links (${timeline})`,
    'Launch + 30 days free post-launch support',
  ]

  // 5. Render the brief as a message string suitable for the contact form
  const rendered = [
    `Project type: ${type}`,
    `Recommended stack: ${[...stack].join(', ')}`,
    `Estimated timeline: ${timeline}`,
    `Estimated budget: ${budget}`,
    '',
    'Original idea:',
    text.trim(),
  ].join('\n')

  return { type, stack: [...stack], timeline, budget, steps, rendered }
}

export default function BriefAssistant() {
  const nav = useNavigate()
  const [idea, setIdea] = useState('')
  const [type, setType] = useState(PROJECT_TYPES[0])
  const [thinking, setThinking] = useState(false)
  const [brief, setBrief] = useState(null)

  const onGenerate = async (e) => {
    e.preventDefault()
    if (idea.trim().length < 10) return
    setThinking(true); setBrief(null)
    // Small simulated delay so it feels deliberate, not a spam button.
    await new Promise(r => setTimeout(r, 900 + Math.random() * 700))
    setBrief(generateBrief(idea, type))
    setThinking(false)
  }

  const sendToNoby = () => {
    if (!brief) return
    nav('/contact', {
      state: {
        prefill: {
          message: brief.rendered,
          project_type: brief.type,
          budget_range: brief.budget,
          timeline: brief.timeline,
        },
      },
    })
  }

  const reset = () => { setBrief(null); setIdea(''); setType(PROJECT_TYPES[0]) }

  const selectClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <section className="container-x py-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles size={12} /> Brief Assistant
        </div>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold">Describe it. Get a brief.</h2>
        <p className="mt-3 text-muted-foreground">
          Tell me your idea in plain words. The assistant suggests a stack,
          timeline, and budget — then you can ship it straight to my inbox with one click.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {!brief ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={onGenerate}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="brief-idea">Your idea</Label>
                  <Textarea
                    id="brief-idea"
                    rows={5}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="e.g. I run a small grocery shop in Harare and want an online store where customers can pay with Ecocash, with delivery scheduling…"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brief-type">Project type (optional)</Label>
                  <select id="brief-type" value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                    {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <Button type="submit" size="lg" className="w-full glow shine" disabled={thinking || idea.trim().length < 10}>
                  {thinking ? (
                    <><Loader2 size={16} className="animate-spin" /> Thinking…</>
                  ) : (
                    <><Sparkles size={16} /> Generate brief</>
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Built locally — no data leaves your browser unless you click "Send to Noby".
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-3 gap-3">
                  <BriefStat label="Project type" value={brief.type} />
                  <BriefStat label="Estimated timeline" value={brief.timeline} />
                  <BriefStat label="Estimated budget" value={brief.budget} />
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recommended stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {brief.stack.map((s, i) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Suggested next steps</div>
                  <ol className="space-y-2 text-sm">
                    {brief.steps.map((s, i) => (
                      <motion.li
                        key={s}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-0.5 size-5 rounded-full bg-primary text-primary-foreground text-xs font-bold grid place-items-center shrink-0">{i + 1}</span>
                        <span className="text-foreground/90">{s}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button onClick={sendToNoby} size="lg" className="glow shine">
                    <Send size={16} /> Send this brief to Noby <ArrowRight size={14} />
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg">
                    <RefreshCw size={14} /> Start over
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </section>
  )
}

function BriefStat({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold text-sm">{value}</div>
    </div>
  )
}
