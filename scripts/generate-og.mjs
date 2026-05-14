// Generates public/og-image-v2.png (1200x630) from an inline SVG.
// Run: npm run og
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'public/og-image-v2.png')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#0f2a3a"/>
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a9e6a"/>
      <stop offset="50%" stop-color="#15b6a8"/>
      <stop offset="100%" stop-color="#10bdcc"/>
    </linearGradient>
    <radialGradient id="glow" cx="22%" cy="50%" r="42%">
      <stop offset="0%" stop-color="#15b6a8" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#15b6a8" stop-opacity="0"/>
    </radialGradient>
    <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Logo mark — hero element, left side, vertically centered -->
  <g transform="translate(95, 115)" filter="url(#dropshadow)">
    <rect width="400" height="400" rx="76" fill="url(#brand)"/>
    <text x="200" y="200"
          font-family="'Space Grotesk', 'Segoe UI', system-ui, sans-serif"
          font-size="280" font-weight="800" letter-spacing="-14"
          fill="white" text-anchor="middle" dominant-baseline="central">N</text>
  </g>

  <!-- Wordmark + supporting text — right side, vertically centered -->
  <text x="555" y="305"
        font-family="'Space Grotesk', 'Segoe UI', system-ui, sans-serif"
        font-size="172" font-weight="800" letter-spacing="-6"
        fill="white">Noby</text>

  <text x="558" y="380"
        font-family="'Inter', 'Segoe UI', system-ui, sans-serif"
        font-size="44" font-weight="600"
        fill="#e2e8f0">Full-Stack Developer</text>

  <text x="558" y="430"
        font-family="'Inter', 'Segoe UI', system-ui, sans-serif"
        font-size="26" font-weight="500"
        fill="#94a3b8">React · Supabase · PHP · Tailwind</text>

  <!-- URL pill -->
  <g transform="translate(555, 470)">
    <rect width="340" height="58" rx="29" fill="rgba(255,255,255,0.05)" stroke="url(#brand)" stroke-width="1.5"/>
    <text x="170" y="29"
          font-family="'Inter', 'Segoe UI', system-ui, sans-serif"
          font-size="22" font-weight="600"
          fill="#10bdcc" text-anchor="middle" dominant-baseline="central">noby.aizim.co.zw</text>
  </g>
</svg>`

await mkdir(dirname(out), { recursive: true })
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(out)

console.log(`OG image written: ${out}`)
