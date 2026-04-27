import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProfile } from '@/lib/queries'

function GlyphWA({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.099-.473-.149-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.575-1.516-3.39-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.875 2.909 4.365 2.909 7.02-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
    </svg>
  )
}

/**
 * "Buy on WhatsApp" button. Resolves the seller's phone from the profile
 * and pre-fills a purchase-intent message with the product title and price.
 * Returns null until phone loads — never renders a broken link.
 */
export default function BuyOnWhatsApp({ product, size = 'lg', className = '' }) {
  const [phone, setPhone] = useState(null)
  useEffect(() => { getProfile().then(p => p?.phone && setPhone(p.phone)).catch(() => {}) }, [])
  if (!phone || !product) return null

  const price = `${product.currency || 'USD'} ${Number(product.price ?? 0).toLocaleString()}`
  const message =
`Hi Noby! I'm interested in buying *${product.title}* (${price}).

Could you confirm:
• What's included in the source code package?
• Payment method & next steps after I confirm?

Thanks!`

  const digits = phone.replace(/\D/g, '')
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
  const sizeClass = size === 'lg' ? 'h-12 px-6 text-base' : size === 'sm' ? 'h-9 px-4 text-sm' : 'h-11 px-5 text-sm'

  return (
    <motion.a
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        `inline-flex items-center justify-center gap-2 rounded-md font-semibold text-white transition-shadow ${sizeClass} ${className}`
      }
      style={{
        backgroundColor: '#25D366',
        boxShadow: '0 8px 24px -6px rgba(37,211,102,0.55)',
      }}
    >
      <GlyphWA size={size === 'sm' ? 14 : 18} />
      Buy on WhatsApp · {price}
    </motion.a>
  )
}
