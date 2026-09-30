import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE } from '@/lib/plans'

/**
 * What a customer buys, stated once for every page.
 *
 * The public offer is one design, one price: pay once for the design you
 * publish and every feature in it is yours. No plans, no bundles, no
 * subscription. (lib/plans.ts still grants cumulative tiers internally so that
 * earlier customers who bought "Starter"/"Pro"/"All Access" keep what they paid
 * for — that is a courtesy of the backend, never advertised.)
 *
 * Every line here must stay true of the product:
 *  - nothing is feature-gated after purchase (no plan checks outside lib/plans)
 *  - published invitations expire 3 days after the event date (app/e/[slug])
 *  - a published invitation cannot currently be edited — do not promise it
 *  - many designs carry a small "Made with ShareInvite" credit, so the claim is
 *    "no banner or ads", not "no branding"
 */
export const OFFER = {
  headline: 'One design. One price. Everything included.',
  short: 'Pay once for the design you love — every feature in it is yours.',
  from: LOWEST_PAID_PRICE,
  to: HIGHEST_PAID_PRICE,
} as const

export const OFFER_INCLUDES = [
  'Your invitation on its own private link',
  'Every feature in the design — nothing locked',
  'Share on WhatsApp, Instagram, email or text',
  'Opens on any phone — no app for guests',
  'No banner or ads on your invitation',
  'Live through your event, and three days after',
  'Secure one-time payment — no subscription',
] as const

export const OFFER_PROMISES = [
  'Free to build & preview',
  'Pay once, only when you publish',
  'No subscription',
  '7-day refund policy',
] as const
