// Intentionally self-contained: lib/seo.ts imports the full TEMPLATES config,
// and this module is used by client components. Re-deriving the site URL here
// keeps every template's field definitions out of the browser bundle.
const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

/**
 * Single source of truth for a template's preview image.
 *
 * Every design's image is a real screenshot of that design's first screen,
 * rendered with its sample content (public/templates/<id>.jpg, 4:5). What a
 * visitor sees on a card is exactly what the design looks like — no stock
 * photography or illustrations standing in for it. Regenerate with the
 * scratchpad thumbnail script whenever a design changes.
 *
 * Plain data, no JSX, so server components, JSON-LD builders and metadata can
 * use it without pulling icon components into the server bundle.
 */
const TEMPLATE_IDS = [
  'elegant-wedding', 'cinematic-night', 'indian-wedding', 'indian-engagement', 'indian-birthday',
  'griha-pravesh', 'namakaran', 'kgf-wedding', 'royal-deco', 'anniversary', 'luxury-wedding',
  'surprise-journey', 'rakshabandhan', 'ganesh-chaturthi',
  'greeting-love', 'greeting-valentine', 'greeting-anniversary', 'greeting-propose', 'greeting-promise',
  'greeting-sorry', 'greeting-congratulations', 'greeting-festival', 'greeting-family', 'greeting-friendship',
  'signature-rajwada', 'signature-kalyanam', 'signature-nikah', 'signature-garden',
  'baby-shower', 'first-birthday', 'haldi-mehendi', 'sangeet-night', 'pooja-invite', 'diwali-party', 'eid-milan', 'retirement',
  'save-the-date',
  'birthday-mirrorball', 'birthday-martini', 'birthday-champagne', 'birthday-long-lunch', 'birthday-gala',
  'dasara-ambari', 'christmas-evergreen', 'newyear-midnight',
] as const

const TEMPLATE_IMAGES: Record<string, string> = Object.fromEntries(
  TEMPLATE_IDS.map((id) => [id, `/templates/${id}.jpg`]),
)

/** Path (or remote URL) for use in <img>/next/image `src`. */
export function templateImage(templateId: string): string {
  return TEMPLATE_IMAGES[templateId] ?? '/templates/elegant-wedding.jpg'
}

/** Absolute, crawlable URL — required by Product/Offer structured data and OG tags. */
export function templateImageUrl(templateId: string): string {
  const src = templateImage(templateId)
  return src.startsWith('http') ? src : `${SITE_URL}${src}`
}
