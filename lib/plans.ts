// ─── Plan definitions ────────────────────────────────────────────────────────

export type PlanId = 'free' | 'rakhi' | 'standard' | 'premium' | 'gold'

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
const FREE_TEMPLATES = ['elegant-wedding']
const RAKHI_TEMPLATES = ['rakshabandhan']
const STANDARD_TEMPLATES = [...FREE_TEMPLATES, ...RAKHI_TEMPLATES, 'cinematic-night', 'indian-birthday', 'namakaran', 'surprise-journey',]
const GREETING_TEMPLATES = [
  'greeting-love', 'greeting-valentine', 'greeting-anniversary', 'greeting-propose', 'greeting-promise',
  'greeting-sorry', 'greeting-congratulations', 'greeting-festival', 'greeting-family', 'greeting-friendship',
]
const PREMIUM_TEMPLATES = [...STANDARD_TEMPLATES, 'indian-wedding', 'indian-engagement', 'griha-pravesh', ...GREETING_TEMPLATES]
const GOLD_TEMPLATES = [...PREMIUM_TEMPLATES, 'anniversary', 'kgf-wedding', 'royal-deco', 'luxury-wedding']

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    badge: 'Free forever',
    description: 'Create a beautiful invitation in minutes — no payment needed.',
    templateIds: FREE_TEMPLATES,
    features: ['Elegant Wedding template', 'Date, venue & Google Maps', 'Guest wishes collection', 'WhatsApp share link'],
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
    description: 'Unlock 4 designs for weddings, birthdays, naming ceremonies and more.',
    templateIds: STANDARD_TEMPLATES,
    features: [`${STANDARD_TEMPLATES.length} templates`, 'Background music player', 'Event schedule timeline', 'No ShareInvite branding'],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Pro',
    price: 599,
    badge: 'Best value',
    description: 'Cover every Indian ceremony — weddings, engagements, griha pravesh and more.',
    templateIds: PREMIUM_TEMPLATES,
    features: [`${PREMIUM_TEMPLATES.length} templates`, 'Photo gallery up to 20 images', 'Live countdown timer', 'Priority support'],
  },
  {
    id: 'gold',
    name: 'All Access',
    price: 999,
    badge: 'Complete collection',
    description: 'Every template unlocked — including KGF Royal Empire, Anniversary and more.',
    templateIds: GOLD_TEMPLATES,
    features: [`All ${GOLD_TEMPLATES.length} templates`, 'KGF Royal Empire + Royal Deco', 'Custom slug support', 'Priority support'],
  },
]

// Lookup helpers
export const PLAN_MAP = Object.fromEntries(PLANS.map(p => [p.id, p])) as Record<PlanId, Plan>

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
  // Free templates are available on every plan. Without this, buying the
  // standalone Raksha Bandhan plan would *remove* access to the free template,
  // because that plan's templateIds list only contains its own design.
  if (FREE_TEMPLATES.includes(templateId)) return true
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

export function isFreeTemplate(templateId: string): boolean {
  return templatePrice(templateId) === 0
}

/** Formatted for display, e.g. "Free" / "₹299". */
export function formatTemplatePrice(templateId: string): string {
  const price = templatePrice(templateId)
  return price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`
}

/** Cheapest paid template price — used in "from ₹X" copy. */
export const LOWEST_PAID_PRICE = Math.min(
  ...PLANS.filter((p) => p.price > 0).map((p) => p.price),
)

export function planLevel(plan: PlanId): number {
  return { free: 0, rakhi: 0.5, standard: 1, premium: 2, gold: 3 }[plan] ?? 0
}
