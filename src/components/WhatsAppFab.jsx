import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProfile } from '@/lib/queries'

const DEFAULT_MESSAGE = "Hi Noby! I saw your portfolio and I'd like to discuss a project. Could we set up a quick call?"
const WHATSAPP_GREEN = '#25D366'

function WhatsAppGlyph({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.099-.473-.149-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.575-1.516-3.39-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.875 2.909 4.365 2.909 7.02-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
    </svg>
  )
}

export default function WhatsAppFab() {
  const [phone, setPhone] = useState(null)
  const [shown, setShown] = useState(false)
  const [tooltip, setTooltip] = useState(false)

  useEffect(() => {
    getProfile().then(p => p?.phone && setPhone(p.phone)).catch(() => {})
  }, [])

  useEffect(() => {
    // Mount delay so it feels intentional, not a popup
    const t1 = setTimeout(() => setShown(true), 1400)
    // Auto-show tooltip once for 4s after mount
    const t2 = setTimeout(() => setTooltip(true), 2400)
    const t3 = setTimeout(() => setTooltip(false), 6800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40"
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, x: 12, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 12, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap rounded-xl bg-foreground text-background px-4 py-2.5 shadow-xl"
              >
                <div className="text-sm font-semibold">Chat on WhatsApp</div>
                <div className="text-[11px] opacity-70 mt-0.5">Usually replies in minutes</div>
                <span aria-hidden className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px]" style={{ borderLeftColor: 'var(--foreground)' }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with Noby on WhatsApp"
            className="relative grid place-items-center size-14 md:size-16 rounded-full text-white transition-transform duration-300 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: WHATSAPP_GREEN,
              boxShadow: '0 10px 28px -6px rgba(37, 211, 102, 0.55), 0 4px 12px -2px rgba(0,0,0,0.18)',
            }}
          >
            {/* outer ping ring */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full animate-ping opacity-40"
              style={{ backgroundColor: WHATSAPP_GREEN }}
            />
            {/* second slower ring */}
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full opacity-30"
              style={{
                backgroundColor: WHATSAPP_GREEN,
                animation: 'pulse-ring 2.4s cubic-bezier(0.66,0,0,1) infinite',
              }}
            />
            <WhatsAppGlyph size={28} className="relative z-10" />

            {/* unread-style green dot for visual interest */}
            <span
              aria-hidden
              className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 border-2 border-background grid place-items-center"
              style={{ animation: 'pulse-ring 2.4s cubic-bezier(0.66,0,0,1) infinite' }}
            >
              <span className="text-[10px] font-bold text-white leading-none">1</span>
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
