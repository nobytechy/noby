import { cn } from '@/lib/utils'

const sizes = {
  sm: { mark: 'size-7', font: 'text-base',  letter: 'text-sm'  },
  md: { mark: 'size-9', font: 'text-xl',    letter: 'text-base' },
  lg: { mark: 'size-12', font: 'text-3xl',  letter: 'text-xl'  },
}

export default function Logo({ size = 'md', wordmark = true, className = '' }) {
  const s = sizes[size] || sizes.md
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <span
        aria-hidden
        className={cn(
          'relative grid place-items-center rounded-[10px] overflow-hidden',
          'bg-gradient-to-br from-[var(--grad-1)] via-[var(--grad-2)] to-[var(--grad-3)]',
          'shadow-[0_4px_16px_-4px_color-mix(in_oklab,var(--primary)_45%,transparent)]',
          'ring-1 ring-black/5 dark:ring-white/10',
          s.mark
        )}
      >
        <span
          className={cn(
            'font-display font-bold leading-none text-white tracking-tighter',
            s.letter
          )}
          style={{ textShadow: '0 1px 1px rgba(0,0,0,0.18)' }}
        >
          N
        </span>
        {/* subtle highlight */}
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
      </span>
      {wordmark && (
        <span className={cn('font-display font-bold tracking-tight text-foreground', s.font)}>
          Noby
        </span>
      )}
    </span>
  )
}
