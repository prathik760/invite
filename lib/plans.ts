// ─── Plan definitions ────────────────────────────────────────────────────────

export type PlanId = 'free' | 'standard' | 'premium' | 'gold'

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
const STANDARD_TEMPLATES = [...FREE_TEMPLATES, 'cinematic-night', 'indian-birthday', 'namakaran',]
const PREMIUM_TEMPLATES = [...STANDARD_TEMPLATES, 'indian-wedding', 'indian-engagement', 'griha-pravesh']
const GOLD_TEMPLATES = [...PREMIUM_TEMPLATES, 'anniversary', 'kgf-wedding', 'royal-deco', 'luxury-wedding']

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    badge: 'Free forever',
    description: 'Create a beautiful invitation in minutes — no payment needed.',
    templateIds: FREE_TEMPLATES,
    features: ['1 template (Elegant Wedding)', 'Date, venue & Google Maps', 'Guest wishes collection', 'WhatsApp share link'],
  },
  {
    id: 'standard',
    name: 'Starter',
    price: 299,
    badge: 'Most popular',
    description: 'Unlock 4 designs for weddings, birthdays, naming ceremonies and more.',
    templateIds: STANDARD_TEMPLATES,
    features: ['4 templates', 'Background music player', 'Event schedule timeline', 'No ShareInvite branding'],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Pro',
    price: 599,
    badge: 'Best value',
    description: 'Cover every Indian ceremony — weddings, engagements, griha pravesh and more.',
    templateIds: PREMIUM_TEMPLATES,
    features: ['7 templates', 'Photo gallery up to 20 images', 'Live countdown timer', 'Priority support'],
  },
  {
    id: 'gold',
    name: 'All Access',
    price: 999,
    badge: 'Complete collection',
    description: 'Every template unlocked — including KGF Royal Empire, Anniversary and more.',
    templateIds: GOLD_TEMPLATES,
    features: ['All 11 templates', 'KGF Royal Empire + Royal Deco', 'Custom slug support', 'Priority support'],
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
  const plan = PLAN_MAP[userPlan]
  return plan?.templateIds.includes(templateId) ?? false
}

export function planLevel(plan: PlanId): number {
  return { free: 0, standard: 1, premium: 2, gold: 3 }[plan] ?? 0
}
