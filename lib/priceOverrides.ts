import type { PlanId } from './plans'

/**
 * Token prices for one account and one design: a real purchase, end to end,
 * without paying the design's full price (the owner testing a new design).
 *
 * Applied by the server only (/api/payments/create-order, checked again in
 * /verify), never from anything the browser sends, and only to an account
 * that signed in with Google: an email-and-password sign-up doesn't prove the
 * address belongs to whoever typed it. Each one stops working after `until`.
 */
interface PriceOverride {
  email: string
  templateId: string
  plan: PlanId
  /** The price in rupees. */
  inr: number
  /** Last day it applies (India time). */
  until: string
}

const OVERRIDES: PriceOverride[] = [
  // The owner's test purchase of Two Worlds, asked for on 24 Oct 2026.
  { email: 'prathikthelkar760@gmail.com', templateId: 'signature-two-worlds', plan: 'heirloom', inr: 5, until: '2026-11-30' },
]

/** The token price in rupees for this buyer, plan and design, or null for the normal price. */
export function priceOverride({
  email,
  provider,
  plan,
  templateId,
  now = new Date(),
}: {
  email?: string | null
  provider?: string | null
  plan: PlanId
  templateId?: string
  now?: Date
}): number | null {
  if (provider !== 'google' || !email || !templateId) return null
  const address = email.trim().toLowerCase()
  const match = OVERRIDES.find((o) => o.email === address && o.templateId === templateId && o.plan === plan)
  if (!match || now > new Date(`${match.until}T23:59:59+05:30`)) return null
  return match.inr
}
