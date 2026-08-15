import { Helmet } from 'react-helmet-async'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://nobie.netlify.app').replace(/\/$/, '')
const DEFAULT_TITLE = 'Noby — Full-Stack Developer'
const DEFAULT_DESC = 'Full-stack developer shipping software end-to-end — builder of ManishaPay (11-gateway payment platform) and ManishaAI. Web, mobile, ERP, payments and AI. Available for direct-client projects.'
const DEFAULT_IMG = `${SITE_URL}/og-image-v2.png`
const DEFAULT_IMG_ALT = 'Noby Tebulo — Full-Stack & Fintech Developer · nobie.netlify.app'

export default function SEO({ title, description, path = '/', image, imageAlt, jsonLd }) {
  const fullTitle = title ? `${title} — Noby` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const img = image || DEFAULT_IMG
  const imgAlt = imageAlt || DEFAULT_IMG_ALT

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Noby" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:image:secure_url" content={img} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imgAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={imgAlt} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
