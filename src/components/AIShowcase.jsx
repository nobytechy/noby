import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Plus, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

const providers = [
  {
    slug: 'claude',
    name: 'Claude',
    company: 'Anthropic',
    color: 'D97757',
    fallback: 'C',
    summary: 'Best for nuanced reasoning, long-context analysis, and code review at scale.',
    bullets: [
      'Document analysis & summarization',
      'Code review automation',
      'Multi-step business workflows',
    ],
  },
  {
    slug: 'grok',
    name: 'Grok',
    company: 'xAI',
    color: '000000',
    fallback: 'G',
    summary: 'Best for real-time data, X integration, and answers that don\'t pretend to be safe.',
    bullets: [
      'Real-time market / social signal apps',
      'X (Twitter) data pipelines',
      'Research assistants',
    ],
  },
  {
    slug: 'deepseek',
    name: 'DeepSeek',
    company: 'DeepSeek',
    color: '4D6BFE',
    fallback: 'D',
    summary: 'Best for cost-effective coding tasks and self-hosted inference. Open weights.',
    bullets: [
      'In-app code completion',
      'High-volume content generation',
      'Self-hosted inference for compliance',
    ],
  },
]

const others = ['OpenAI GPT', 'Google Gemini', 'Mistral', 'Llama', 'Hugging Face']

export default function AIShowcase() {
  return (
    <section className="container-x py-20 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-30" />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles size={12} /> AI integrations
        </div>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold">AI in your product, the right way</h2>
        <p className="mt-3 text-muted-foreground">
          I integrate large language models into web and mobile products — not as a gimmick,
          but where they save your team hours or your users a click. I'll pick the model
          that fits your latency, cost, and privacy needs. Below are three I deploy most.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {providers.map((p, i) => (
          <ProviderCard key={p.slug} provider={p} index={i} />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
          <Plus size={14} /> also integrating
        </span>
        {others.map(o => (
          <span key={o} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            {o}
          </span>
        ))}
      </div>
    </section>
  )
}

function ProviderCard({ provider, index }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="h-full hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shine">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-4">
            {imgOk ? (
              <img
                src={`https://cdn.simpleicons.org/${provider.slug}/${provider.color}`}
                alt={provider.name}
                width={36}
                height={36}
                className="h-9 w-9"
                onError={() => setImgOk(false)}
              />
            ) : (
              <div
                className="size-9 rounded-md grid place-items-center font-display font-bold text-white text-lg"
                style={{ backgroundColor: `#${provider.color}` }}
                aria-label={provider.name}
              >
                {provider.fallback}
              </div>
            )}
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{provider.company}</span>
          </div>
          <div className="text-xl font-bold">{provider.name}</div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{provider.summary}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {provider.bullets.map(b => (
              <li key={b} className="flex items-start gap-2">
                <Check size={14} className="text-primary mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
