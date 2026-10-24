/**
 * The three levels every design falls into by its price: Classic, Premium and
 * Signature (good, better, best). The catalogue is grouped by them so a
 * visitor finds their level at a glance, and sees the step up beside it.
 *
 * Bands follow the plan ladder in lib/plans.ts: a design's level is its
 * price's. Nothing here makes a claim about a design that its own fields
 * don't back up: the "in every design here" lines are worked out from the
 * fields each design really has (see lib/catalogItems.ts).
 */

export type TierKey = 'classic' | 'premium' | 'signature'

export interface Tier {
  key: TierKey
  name: string
  /** Lowest price in INR that belongs to this tier. */
  min: number
  /** Who it is for, in a line. */
  promise: string
}

/** Highest first: the catalogue shows the best first and the budget choice last. */
export const TIERS: Tier[] = [
  { key: 'signature', name: 'Signature', min: 1299, promise: 'For the celebration everyone remembers. Complete suites with a grand opening and everything your guests need to know.' },
  { key: 'premium', name: 'Premium', min: 399, promise: 'For invitations guests talk about. Richer artwork, more animation and more room for your details.' },
  { key: 'classic', name: 'Classic', min: 0, promise: 'Beautiful, quick and kind to your budget. Ready to send today.' },
]

export function tierOf(price: number): TierKey {
  return (TIERS.find((t) => price >= t.min) ?? TIERS[TIERS.length - 1]).key
}

export const TIER_MAP = Object.fromEntries(TIERS.map((t) => [t.key, t])) as Record<TierKey, Tier>

/** What a design can hold, read from its fields; listed in the order they are worth mentioning. */
export const FEATURES = [
  { key: 'functions', label: 'Each function on its own card' },
  { key: 'guide', label: 'Travel & FAQs for guests' },
  { key: 'rsvp', label: 'WhatsApp RSVP' },
  { key: 'film', label: 'Your own film' },
  { key: 'photos', label: 'Photo gallery' },
  { key: 'music', label: 'Your music' },
  { key: 'programme', label: 'Programme of the day' },
  { key: 'map', label: 'Map & directions' },
  { key: 'wishes', label: 'Guest wishes wall' },
] as const

export type FeatureKey = (typeof FEATURES)[number]['key']
