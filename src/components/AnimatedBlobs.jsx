export default function AnimatedBlobs() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="blob absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.16_160/0.45),transparent_60%)] blur-3xl" />
      <div className="blob blob-2 absolute -top-20 right-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,oklch(0.75_0.15_180/0.40),transparent_60%)] blur-3xl" />
      <div className="blob blob-3 absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,oklch(0.78_0.14_140/0.35),transparent_60%)] blur-3xl" />
    </div>
  )
}
