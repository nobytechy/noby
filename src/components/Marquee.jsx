export default function Marquee({ items = [] }) {
  if (!items.length) return null
  // duplicate so the loop is seamless (animation translates -50%)
  const list = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-border py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className="marquee whitespace-nowrap">
        {list.map((it, i) => (
          <span key={i} className="text-sm font-medium text-muted-foreground inline-flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-primary/60" />
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}
