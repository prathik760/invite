import { hasLocalPrice } from './pricing'

// ─── Plan definitions ────────────────────────────────────────────────────────

/**
 * `'free'` is NOT a purchasable tier — it is the sentinel for "no active
 * purchase" (logged-out visitors, and the `plan` column's DB default). It
 * deliberately owns no templates, so every template now requires a purchase.
 *
 * The cheapest tier is `'ganesh'` (₹99); `'basic'` (₹199) is the entry price
 * for a wedding design. Pricing the sentinel itself would have granted every
 * anonymous visitor a template for nothing.
 *
 * PLANS is ordered by ascending price and must stay that way — `getRequiredPlan`
 * and `mergePlans` both take the first match as the cheapest one.
 */
export type PlanId = 'free' | 'basic' | 'rakhi' | 'ganesh' | 'standard' | 'premium' | 'gold' | 'gala' | 'signature' | 'couture'

export interface Plan {
  id: PlanId
  name: string
  price: number           // INR
  badge: string
  description: string
  templateIds: string[]   // templates accessible on this plan
  features: string[]
  highlighted?: boolean
}

// Templates assigned to each tier
const BASIC_TEMPLATES = ['elegant-wedding', 'pooja-invite', 'save-the-date']
const RAKHI_TEMPLATES = ['rakshabandhan']
const GANESH_TEMPLATES = ['ganesh-chaturthi']
const STANDARD_TEMPLATES = [
  ...BASIC_TEMPLATES, ...RAKHI_TEMPLATES, ...GANESH_TEMPLATES, 'cinematic-night', 'indian-birthday', 'namakaran', 'surprise-journey',
  'first-birthday', 'haldi-mehendi', 'diwali-party', 'eid-milan', 'retirement',
  'birthday-mirrorball', 'birthday-martini', 'birthday-champagne', 'birthday-long-lunch',
]
const GREETING_TEMPLATES = [
  'greeting-love', 'greeting-valentine', 'greeting-anniversary', 'greeting-propose', 'greeting-promise',
  'greeting-sorry', 'greeting-congratulations', 'greeting-festival', 'greeting-family', 'greeting-friendship',
]
const PREMIUM_TEMPLATES = [...STANDARD_TEMPLATES, 'indian-wedding', 'indian-engagement', 'griha-pravesh', ...GREETING_TEMPLATES, 'baby-shower', 'sangeet-night']
const GOLD_TEMPLATES = [...PREMIUM_TEMPLATES, 'anniversary', 'kgf-wedding', 'royal-deco', 'luxury-wedding']
// Signature collection: full wedding suites (every function, families, story,
// travel & stay, FAQs, contacts, RSVP). Each tier also includes everything
// below it, like the tiers above.
// Gala: the birthday weekend, between the everyday designs and the wedding suites.
const GALA_TEMPLATES = [...GOLD_TEMPLATES, 'birthday-gala']
const SIGNATURE_TEMPLATES = [...GALA_TEMPLATES, 'signature-kalyanam', 'signature-nikah', 'signature-garden']
const COUTURE_TEMPLATES = [...SIGNATURE_TEMPLATES, 'signature-rajwada']

export const PLANS: Plan[] = [
  {
    id: 'ganesh',
    name: 'Ganesh Chaturthi',
    price: 99,
    badge: 'Lowest price',
    description: 'Unlock the premium Ganesh Chaturthi invitation for ₹99 — invite family home for darshan, aarti and prasad.',
    templateIds: GANESH_TEMPLATES,
    features: ['Ganesh Chaturthi Premium template', 'Sthapana countdown & utsav schedule', 'Visarjan day & Google Maps', 'Guest wishes & blessings wall'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 199,
    badge: 'Entry wedding price',
    description: 'Build and preview before you pay — publish the Elegant Wedding invitation for a one-time ₹199.',
    templateIds: BASIC_TEMPLATES,
    features: ['Elegant Wedding template', 'Date, venue & Google Maps', 'Guest wishes collection', 'WhatsApp share link', 'No ShareInvite branding'],
  },
  {
    id: 'rakhi',
    name: 'Raksha Bandhan',
    price: 199,
    badge: 'Festive special',
    description: 'Unlock the premium Raksha Bandhan invitation — celebrate the bond of a lifetime.',
    templateIds: RAKHI_TEMPLATES,
    features: ['Raksha Bandhan Premium template', 'Countdown, timeline & photo memories', 'Guest wishes & RSVP', 'Optional gift / shagun link'],
  },
  {
    id: 'standard',
    name: 'Starter',
    price: 299,
    badge: 'Most popular',
    description: `Unlock ${STANDARD_TEMPLATES.length} designs for weddings, birthdays, naming ceremonies and more.`,
    templateIds: STANDARD_TEMPLATES,
    features: [`${STANDARD_TEMPLATES.length} templates`, 'Background music player', 'Event schedule timeline', 'No ShareInvite branding'],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Pro',
    price: 399,
    badge: 'Best value',
    description: 'Cover every Indian ceremony — weddings, engagements, griha pravesh and more.',
    templateIds: PREMIUM_TEMPLATES,
    features: [`${PREMIUM_TEMPLATES.length} templates`, 'Photo gallery up to 20 images', 'Live countdown timer', 'Priority support'],
  },
  {
    id: 'gold',
    name: 'All Access',
    price: 499,
    badge: 'Complete collection',
    description: 'Every template unlocked — including KGF Royal Empire, Anniversary and more.',
    templateIds: GOLD_TEMPLATES,
    features: [`All ${GOLD_TEMPLATES.length} templates`, 'KGF Royal Empire + Royal Deco', 'Custom slug support', 'Priority support'],
  },
  {
    id: 'gala',
    name: 'Gala',
    price: 1299,
    badge: 'Luxury birthday',
    description: 'Gala — the birthday weekend: an envelope addressed to each guest, every part of the celebration on its own card, their story, where to stay and a full RSVP.',
    templateIds: GALA_TEMPLATES,
    features: ['Envelope addressed to each guest', 'Every part of the weekend on its own card', 'RSVP with parts, numbers, dietary needs & songs', 'Everything in the designs below'],
  },
  {
    id: 'signature',
    name: 'Signature',
    price: 1499,
    badge: 'Signature collection',
    description: 'A complete wedding suite — Kalyanam, Nikah or Garden Vows — with every function, both families, your story, travel & stay, FAQs and RSVP.',
    templateIds: SIGNATURE_TEMPLATES,
    features: ['Every function on its own card', 'Travel, stay, FAQs & contacts for guests', 'WhatsApp RSVP, livestream & hashtag', 'Everything in the designs below'],
  },
  {
    id: 'couture',
    name: 'Signature Couture',
    price: 1999,
    badge: 'Signature collection',
    description: 'Rajwada — the royal palace wedding suite, with the gates-opening welcome and the full week of functions.',
    templateIds: COUTURE_TEMPLATES,
    features: ['Rajwada palace suite', 'Every function on its own card', 'Travel, stay, FAQs & contacts for guests', 'Everything in the designs below'],
  },
]

// Lookup helpers.
// `'free'` has no entry here on purpose — it is the no-purchase sentinel, so
// every lookup for it must miss and every entitlement check must fail.
export const PLAN_MAP = Object.fromEntries(PLANS.map(p => [p.id, p])) as Record<PlanId, Plan | undefined>

export function getPlanForTemplate(templateId: string): Plan {
  return PLANS.find(p => p.templateIds.includes(templateId) &&
    !PLANS.find(prev => prev.id !== p.id && prev.templateIds.includes(templateId) && PLANS.indexOf(prev) < PLANS.indexOf(p))
  ) ?? PLANS[0]
}

export function getRequiredPlan(templateId: string): Plan {
  // Returns the LOWEST plan that includes this template
  return PLANS.find(p => p.templateIds.includes(templateId)) ?? PLANS[PLANS.length - 1]
}

export function canAccess(templateId: string, userPlan: PlanId): boolean {
  // No blanket exemption any more: with no free tier, access is granted only by
  // the plan the user actually bought. Basic, Raksha Bandhan and Ganesh
  // Chaturthi are parallel single-template tiers — buying one does not grant
  // the others. Standard and above include all of them, so an upgrade never
  // takes a template away.
  const plan = PLAN_MAP[userPlan]
  return plan?.templateIds.includes(templateId) ?? false
}

/**
 * One-time price of a single template, in INR.
 *
 * Every surface that shows a price (landing pages, template pages, the pricing
 * page, the create flow, the upgrade modal, JSON-LD) must call this so the
 * numbers can never drift apart.
 */
export function templatePrice(templateId: string): number {
  return getRequiredPlan(templateId).price
}

/**
 * No template publishes for free any more — every design is a one-time
 * purchase. Kept so callers that gate on it keep compiling and correctly
 * take the paid path.
 */
export function isFreeTemplate(templateId: string): boolean {
  return templatePrice(templateId) === 0
}

/**
 * Formatted in INR, e.g. "₹199". Visitors outside India see their own price:
 * render it with <Price> / <PriceText> (components/price), which swap any "₹…"
 * catalogue price for the local one. Metadata and JSON-LD stay in INR.
 */
export function formatTemplatePrice(templateId: string): string {
  const price = templatePrice(templateId)
  return price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`
}

/** Cheapest paid template price — used in "from ₹X" copy. */
export const LOWEST_PAID_PRICE = Math.min(
  ...PLANS.filter((p) => p.price > 0).map((p) => p.price),
)

/** Dearest template price — used in "₹X – ₹Y" range copy and JSON-LD. */
export const HIGHEST_PAID_PRICE = Math.max(...PLANS.map((p) => p.price))

/**
 * Resolve which single plan a user should hold after buying `purchased` while
 * already on `current`.
 *
 * The subscription table stores one plan per user, so a plain overwrite can
 * revoke templates that were already paid for. Basic and Raksha Bandhan make
 * this concrete: they cost the same and sit at the same level, but neither
 * contains the other, so buying the second would drop the first.
 *
 * Returns whichever plan already covers everything the user owns, and when
 * neither does, promotes them to the cheapest plan that covers both. PLANS is
 * ordered by ascending price, so `find` yields the cheapest such plan.
 */
export function mergePlans(current: PlanId, purchased: PlanId): PlanId {
  const owned = [
    ...(PLAN_MAP[current]?.templateIds ?? []),
    ...(PLAN_MAP[purchased]?.templateIds ?? []),
  ]
  const covers = (p: Plan) => owned.every(t => p.templateIds.includes(t))

  const purchasedPlan = PLAN_MAP[purchased]
  if (purchasedPlan && covers(purchasedPlan)) return purchased

  const currentPlan = PLAN_MAP[current]
  if (currentPlan && covers(currentPlan)) return current

  return PLANS.find(covers)?.id ?? purchased
}

export function planLevel(plan: PlanId): number {
  return { free: 0, ganesh: 0.5, basic: 0.5, rakhi: 0.5, standard: 1, premium: 2, gold: 3, gala: 3.5, signature: 4, couture: 5 }[plan] ?? 0
}

// Every INR price needs a row in lib/pricing.ts's LADDER, or visitors abroad
// would be shown and charged rupees. Failing here fails the build.
for (const p of PLANS) {
  if (!hasLocalPrice(p.price)) throw new Error(`lib/pricing.ts has no local prices for ₹${p.price} (plan "${p.id}")`)
}
