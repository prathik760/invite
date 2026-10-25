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
  'signature-rajwada', 'signature-kalyanam', 'signature-nikah', 'signature-garden', 'signature-aquarelle', 'signature-saptapadi', 'signature-two-worlds',
  'baby-shower', 'first-birthday', 'haldi-mehendi', 'sangeet-night', 'pooja-invite', 'diwali-party', 'eid-milan', 'retirement',
  'save-the-date',
  'birthday-mirrorball', 'birthday-martini', 'birthday-champagne', 'birthday-long-lunch', 'birthday-gala',
  'dasara-ambari', 'christmas-evergreen', 'newyear-midnight',
] as const

/**
 * Bump whenever the images are re-shot. next/image responses are cached for a
 * year (images.minimumCacheTTL), so a replaced file only reaches returning
 * visitors under a new URL. Every use goes through templateImage() for this.
 */
const IMAGE_VERSION = 2

/**
 * Images re-shot on their own since the last full reshoot, each with its own
 * version, so only that card's cached copy is replaced.
 */
const RESHOT: Partial<Record<(typeof TEMPLATE_IDS)[number], number>> = {
  'signature-two-worlds': 4,
}

const TEMPLATE_IMAGES: Record<string, string> = Object.fromEntries(
  TEMPLATE_IDS.map((id) => [id, `/templates/${id}.jpg?v=${RESHOT[id] ?? IMAGE_VERSION}`]),
)

/** Path (or remote URL) for use in <img>/next/image `src`. */
export function templateImage(templateId: string): string {
  return TEMPLATE_IMAGES[templateId] ?? TEMPLATE_IMAGES['elegant-wedding']
}

/** Widths of the ready-made copies in public/templates/sized (scripts/template-sizes.mjs). */
const SIZED_WIDTHS = [128, 384, 640, 960]
const IDS = new Set<string>(TEMPLATE_IDS)

/**
 * The ready-made copy of a design picture for a next/image width: the
 * narrowest at least that wide, or the widest. Null for any other image.
 *
 * Design pictures skip Vercel's image optimiser. In October 2026 the Hobby
 * plan's monthly allowance ran out, and every picture it had not already
 * made came back "402 Payment required": a blank card. components/ui/Image
 * uses this for every design picture on the site.
 */
export function sizedTemplateImage(src: string, width: number): string | null {
  const m = /^\/templates\/([a-z0-9-]+)\.jpg(\?v=\d+)?$/.exec(src)
  if (!m || !IDS.has(m[1])) return null
  const w = SIZED_WIDTHS.find((s) => s >= width) ?? SIZED_WIDTHS[SIZED_WIDTHS.length - 1]
  return `/templates/sized/${m[1]}-${w}.webp${m[2] ?? ''}`
}

/** Absolute, crawlable URL — required by Product/Offer structured data and OG tags. */
export function templateImageUrl(templateId: string): string {
  const src = templateImage(templateId)
  return src.startsWith('http') ? src : `${SITE_URL}${src}`
}
