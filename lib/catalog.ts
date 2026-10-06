/**
 * How the template catalogue is presented to visitors: occasions, display
 * names and style tags.
 *
 * `modules/templates/data.ts` stays the source of truth for what a template
 * *is* (fields, defaults). This module only describes how it is *browsed*, and
 * is plain data so server components, client filters and the header menu can
 * all share one list.
 *
 * Every occasion lists real template ids, and every `href` is a route that
 * exists. An occasion with no designs behind it is not listed here — a tile for
 * "Graduation" that leads to zero templates would promise something the
 * product does not have. Visitors with an unlisted event are sent to the custom
 * design request instead.
 */

export interface Occasion {
  key: string
  /** Tile / heading label. */
  label: string
  /** Chip label in filters. */
  short: string
  blurb: string
  /** Landing page for the occasion, or the filtered template gallery. */
  href: string
  /** Illustration in /public/occasions. */
  image: string
  templateIds: string[]
}

export const OCCASIONS: Occasion[] = [
  {
    key: 'wedding',
    label: 'Weddings',
    short: 'Wedding',
    blurb: 'Palace suites, Nikah, Kalyanam, Haldi & Sangeet',
    href: '/wedding-invitation',
    image: '/occasions/photo-wedding.jpg',
    templateIds: ['signature-rajwada', 'signature-aquarelle', 'signature-kalyanam', 'signature-nikah', 'signature-garden', 'save-the-date', 'elegant-wedding', 'luxury-wedding', 'cinematic-night', 'royal-deco', 'indian-wedding', 'kgf-wedding', 'haldi-mehendi', 'sangeet-night'],
  },
  {
    key: 'engagement',
    label: 'Engagements',
    short: 'Engagement',
    blurb: 'Ring ceremonies and proposals',
    href: '/engagement-invitation',
    image: '/occasions/photo-engagement.jpg',
    templateIds: ['indian-engagement', 'greeting-propose', 'greeting-promise'],
  },
  {
    key: 'birthday',
    label: 'Birthdays',
    short: 'Birthday',
    blurb: 'Milestones, parties, dinners and first birthdays',
    href: '/birthday-invitation',
    image: '/occasions/photo-birthday.jpg',
    templateIds: ['birthday-gala', 'birthday-mirrorball', 'birthday-champagne', 'birthday-martini', 'birthday-long-lunch', 'indian-birthday', 'first-birthday', 'surprise-journey'],
  },
  {
    key: 'anniversary',
    label: 'Anniversaries',
    short: 'Anniversary',
    blurb: 'Milestones and love notes',
    href: '/anniversary-invitation',
    image: '/occasions/photo-anniversary.jpg',
    templateIds: ['anniversary', 'greeting-anniversary'],
  },
  {
    key: 'baby',
    label: 'Baby & naming',
    short: 'Baby',
    blurb: 'Baby showers and naming ceremonies',
    href: '/namakaran-invitation',
    image: '/occasions/photo-baby.jpg',
    templateIds: ['namakaran', 'baby-shower'],
  },
  {
    key: 'home',
    label: 'Housewarming',
    short: 'Housewarming',
    blurb: 'Griha pravesh and home poojas',
    href: '/griha-pravesh-invitation',
    image: '/occasions/photo-home.jpg',
    templateIds: ['griha-pravesh', 'pooja-invite'],
  },
  {
    key: 'festival',
    label: 'Festivals',
    short: 'Festival',
    blurb: 'Dasara, Diwali, Christmas, New Year, Eid',
    href: '/templates?occasion=festival',
    image: '/occasions/photo-festival.jpg',
    templateIds: ['dasara-ambari', 'christmas-evergreen', 'newyear-midnight', 'diwali-party', 'ganesh-chaturthi', 'eid-milan', 'rakshabandhan', 'pooja-invite', 'greeting-festival'],
  },
  {
    key: 'love',
    label: 'Love & romance',
    short: 'Love',
    blurb: 'Valentines, promises and apologies',
    href: '/templates?occasion=love',
    image: '/occasions/photo-love.jpg',
    templateIds: ['greeting-love', 'greeting-valentine', 'greeting-propose', 'greeting-promise', 'greeting-sorry', 'surprise-journey'],
  },
  {
    key: 'friends',
    label: 'Friends & family',
    short: 'Friends & family',
    blurb: 'Thank-yous and just-because notes',
    href: '/templates?occasion=friends',
    image: '/occasions/photo-friends.jpg',
    templateIds: ['greeting-friendship', 'greeting-family', 'surprise-journey'],
  },
  {
    key: 'congrats',
    label: 'Congratulations',
    short: 'Congrats',
    blurb: 'Retirements, wins and new jobs',
    href: '/templates?occasion=congrats',
    image: '/occasions/photo-congrats.jpg',
    templateIds: ['retirement', 'greeting-congratulations'],
  },
]

export const OCCASION_MAP: Record<string, Occasion> = Object.fromEntries(OCCASIONS.map((o) => [o.key, o]))

/** The first occasion a template belongs to — its primary label on cards. */
export function primaryOccasion(templateId: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.templateIds.includes(templateId))
}

/**
 * Short look-and-feel tag for a card. Describes the design, never the price or
 * popularity: there is no sales data to back a "Bestseller" badge.
 */
const STYLE_TAGS: Record<string, string> = {
  'elegant-wedding': 'Ivory & gold',
  'cinematic-night': 'Cinematic',
  'indian-wedding': 'Traditional',
  'indian-engagement': 'Rose gold',
  'indian-birthday': 'Festive',
  'griha-pravesh': 'Traditional',
  'namakaran': 'Soft & serene',
  'kgf-wedding': 'Cinematic gold',
  'royal-deco': 'Art Deco',
  'anniversary': 'Wine & gold',
  'luxury-wedding': 'Multi-event',
  'surprise-journey': 'Interactive',
  'rakshabandhan': 'Festive',
  'ganesh-chaturthi': 'Festive',
  'signature-rajwada': 'Signature · Palace',
  'signature-kalyanam': 'Signature · South Indian',
  'signature-nikah': 'Signature · Nikah',
  'signature-garden': 'Signature · Destination',
  'signature-aquarelle': 'Signature · Hand-painted florals',
  'baby-shower': 'Soft & playful',
  'first-birthday': 'Storybook',
  'haldi-mehendi': 'Pre-wedding',
  'sangeet-night': 'Pre-wedding',
  'pooja-invite': 'Devotional',
  'diwali-party': 'Festive',
  'eid-milan': 'Festive',
  'retirement': 'Warm & classic',
  'save-the-date': 'Letterpress',
  'birthday-mirrorball': 'Disco · Night out',
  'birthday-martini': 'Cocktail hour',
  'birthday-champagne': 'Milestone · Black tie',
  'birthday-long-lunch': 'Garden party',
  'birthday-gala': 'Luxury · Birthday weekend',
  'dasara-ambari': 'Mysuru Dasara · Animated',
  'christmas-evergreen': 'Christmas · Animated',
  'newyear-midnight': 'New Year’s Eve · Fireworks',
}

export function styleTag(templateId: string): string {
  if (templateId.startsWith('greeting-')) return '3D animated'
  return STYLE_TAGS[templateId] ?? 'Classic'
}

/** Templates that are full-screen 3D experiences rather than scrolling pages. */
export function is3D(templateId: string): boolean {
  return templateId === 'surprise-journey' || templateId.startsWith('greeting-')
}

/** "Shaadi — Indian Wedding" → "Shaadi". Card titles use the short name. */
export function displayName(name: string): string {
  return name.split('—')[0].trim()
}

/** Order used when a gallery shows every template: occasion by occasion. */
export function catalogueOrder(ids: string[]): string[] {
  const rank = new Map<string, number>()
  OCCASIONS.forEach((o, oi) => o.templateIds.forEach((id, ti) => {
    if (!rank.has(id)) rank.set(id, oi * 100 + ti)
  }))
  return [...ids].sort((a, b) => (rank.get(a) ?? 9999) - (rank.get(b) ?? 9999))
}
