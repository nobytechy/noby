import { Helmet } from 'react-helmet-async'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://noby.aizim.co.zw'
const DEFAULT_TITLE = 'Noby — Full-Stack Developer'
const DEFAULT_DESC = 'Full-stack developer building modern web applications. Available for direct-client projects.'
const DEFAULT_IMG = `${SITE_URL}/og-image.png`

export default function SEO({ title, description, path = '/', image, jsonLd }) {
  const fullTitle = title ? `${title} — Noby` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC
  const url = `${SITE_URL}${path}`
  const img = image || DEFAULT_IMG

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
