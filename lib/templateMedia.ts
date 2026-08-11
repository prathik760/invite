// Intentionally self-contained: lib/seo.ts imports the full TEMPLATES config,
// and this module is used by client components. Re-deriving the site URL here
// keeps every template's field definitions out of the browser bundle.
const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

/**
 * Single source of truth for a template's preview image.
 *
 * These are the *actual* images rendered on the site (template cards in the
 * create flow live in components/create/templateVisuals.tsx and read from the
 * same set). Keeping the map here — as plain data, with no JSX — lets server
 * components, JSON-LD builders and metadata use it without pulling the icon
 * components into the server bundle.
 *
 * Self-hosted files (/1.jpg … /11.jpg) are preferred. The remaining templates
 * are 3D/animated experiences that have no flat screenshot yet; they use the
 * same stock photo the site already displays on their card, so the structured
 * data never points at an image the user cannot actually see.
 */
const TEMPLATE_IMAGES: Record<string, string> = {
  'elegant-wedding': '/1.jpg',
  'cinematic-night': '/2.jpg',
  'indian-wedding': '/3.jpg',
  'indian-engagement': '/4.jpg',
  'indian-birthday': '/5.jpg',
  'griha-pravesh': '/6.jpg',
  'namakaran': '/7.jpg',
  'kgf-wedding': '/8.jpg',
  'royal-deco': '/9.jpg',
  'anniversary': '/10.jpg',
  'luxury-wedding': '/11.jpg',
  'surprise-journey': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80',
  'rakshabandhan': 'https://images.unsplash.com/photo-1533903345306-15d1c30952de?auto=format&fit=crop&w=1200&q=80',
  'greeting-love': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
  'greeting-valentine': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
  'greeting-anniversary': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
  'greeting-propose': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
  'greeting-promise': 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=1200&q=80',
  'greeting-sorry': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
  'greeting-congratulations': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
  'greeting-festival': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  'greeting-family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
  'greeting-friendship': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
}

/** Path (or remote URL) for use in <img>/next/image `src`. */
export function templateImage(templateId: string): string {
  return TEMPLATE_IMAGES[templateId] ?? '/1.jpg'
}

/** Absolute, crawlable URL — required by Product/Offer structured data and OG tags. */
export function templateImageUrl(templateId: string): string {
  const src = templateImage(templateId)
  return src.startsWith('http') ? src : `${SITE_URL}${src}`
}
