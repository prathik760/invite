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
const GOLD_TEMPLATES = [...PREMIUM_TEMPLATES, 'anniversary', 'kgf-wedding', 'royal-deco'] // all 10

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Basic',
    price: 0,
    badge: 'Free forever',
    description: 'Try the builder and share a simple, elegant invite.',
    templateIds: FREE_TEMPLATES,
    features: ['Elegant Wedding template', 'Date, venue & Google Maps', 'Guest wishes collection', 'WhatsApp share link'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 499,
    badge: 'Most popular',
    description: 'More designs + music for a complete invitation experience.',
    templateIds: STANDARD_TEMPLATES,
    features: ['4 templates (incl. Cinematic Night)', 'Background music player', 'Event schedule timeline', 'No ShareInvite branding'],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    badge: 'Best value',
    description: 'All Indian ceremony templates for weddings and engagements.',
    templateIds: PREMIUM_TEMPLATES,
    features: ['7 templates (Indian Wedding, Engagement & more)', 'Photo gallery up to 20 images', 'Live countdown timer', 'Priority support'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 1499,
    badge: 'Luxury',
    description: 'Every template unlocked. The full ShareInvite experience.',
    templateIds: GOLD_TEMPLATES,
    features: ['All 9 premium templates', 'KGF Royal Empire + Anniversary', 'Custom slug support', '1-year page hosting'],
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
