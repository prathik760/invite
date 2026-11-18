import { OCCASION_MAP } from '@/lib/catalog'
import { templatePrice } from '@/lib/plans'

/**
 * Lower-priced designs offered at the price step ("Over your budget?") for the
 * occasions that sell: weddings and birthdays.
 *
 * 17 people reached the price in the builder in Aug–Nov 2026 and 3 went on to
 * pay (GA4). Someone who leaves at ₹1,999 may well have paid ₹399 for the same
 * invitation in a simpler design, and switching keeps everything they typed.
 * Only the main invitation of each occasion gets picks: a save-the-date, haldi
 * or sangeet is a different event, not a cheaper version of the same one.
 */
const BUDGET: { occasion: string; categories: string[]; picks: string[] }[] = [
  { occasion: 'wedding', categories: ['signature', 'wedding', 'retro', 'movie'], picks: ['indian-wedding', 'elegant-wedding'] },
  { occasion: 'birthday', categories: ['birthday'], picks: ['indian-birthday', 'birthday-champagne'] },
]

/** Cheaper designs for the same invitation, dearest first; none when it is already the lowest. */
export function budgetPicks(templateId: string, category: string): string[] {
  const price = templatePrice(templateId)
  const group = BUDGET.find((g) => g.categories.includes(category) && OCCASION_MAP[g.occasion]?.templateIds.includes(templateId))
  if (!group) return []
  return group.picks.filter((id) => id !== templateId && templatePrice(id) > 0 && templatePrice(id) < price)
}
