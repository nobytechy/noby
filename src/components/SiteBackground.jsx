/**
 * Fixed-viewport ambient background for the public site.
 * - Slow-drifting aurora of three blurred green radials
 * - Periodic diagonal sheen sweep
 * - Subtle dotted grid for depth
 * Sits behind all content (z-index: -10) and never scrolls.
 * Respects prefers-reduced-motion via the .aurora-full / .sheen-full keyframes.
 */
export default function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="aurora-full absolute inset-0" />
      <div className="sheen-full absolute inset-0" />
    </div>
  )
}
