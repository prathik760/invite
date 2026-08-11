import { LOWEST_PAID_PRICE, templatePrice } from '@/lib/plans'

/**
 * Seasonal promotion config — the single place to turn a campaign on or off.
 *
 * ── On the "offer" framing ───────────────────────────────────────────────────
 * `originalPrice` is intentionally null. There is no discount mechanism
 * anywhere in this codebase: the Raksha Bandhan template has always been ₹199.
 * Showing "~~₹399~~ ₹199" would invent a reference price that never existed —
 * misleading advertising under the Consumer Protection Act 2019, and "false
 * urgency" under the CCPA's Guidelines for Prevention and Regulation of Dark
 * Patterns (2023).
 *
 * If you genuinely run a sale, set `originalPrice` to the price that was really
 * charged before it, and set `endsAt` to when it really ends. The popup then
 * shows the saving and a countdown automatically. Until then it leads with
 * claims that are true and still strong: lowest-priced premium template,
 * one-time payment, free to build and preview.
 */
export interface Promo {
  /** Master switch. */
  enabled: boolean
  templateId: string
  /** Real pre-sale price. null = no sale running; no strike-through is shown. */
  originalPrice: number | null
  /**
   * Real end of the campaign, ISO date. Drives the countdown.
   * Set this to the actual Raksha Bandhan date — it is deliberately left null
   * rather than guessed, because a countdown to a wrong date is worse than none.
   */
  endsAt: string | null
  /** Scroll depth (0–1) that triggers the popup. */
  triggerAtScroll: number
  /**
   * Also trigger once the visitor reaches the bottom of the page.
   *
   * A safety net rather than a second threshold: a fast flick to the footer, or
   * a jump via an anchor link, can land past the depth check without the
   * intermediate scroll events that would have satisfied it. This guarantees
   * anyone who reaches the footer is counted.
   */
  alsoTriggerAtBottom: boolean
  /**
   * Fallback for pages with nothing to scroll (content shorter than the
   * viewport). There is no scroll event to react to and the footer is already
   * on screen, so the popup would otherwise never appear at all. Set to null to
   * disable and keep the popup strictly scroll-driven.
   */
  shortPageDelayMs: number | null
  /** Days before a dismissed popup may appear again. */
  snoozeDays: number
}

export const PROMO: Promo = {
  enabled: true,
  templateId: 'rakshabandhan',
  originalPrice: null,
  endsAt: null,
  triggerAtScroll: 0.2,
  alsoTriggerAtBottom: true,
  shortPageDelayMs: 6000,
  snoozeDays: 7,
}

export function promoPrice(): number {
  return templatePrice(PROMO.templateId)
}

/** True only when a real, still-running sale is configured. */
export function hasRealDiscount(): boolean {
  return PROMO.originalPrice !== null && PROMO.originalPrice > promoPrice()
}

export function discountPercent(): number | null {
  if (!hasRealDiscount()) return null
  const was = PROMO.originalPrice as number
  return Math.round(((was - promoPrice()) / was) * 100)
}

/** True when this really is the cheapest paid template — checked, not asserted. */
export function isLowestPricedPaid(): boolean {
  return promoPrice() === LOWEST_PAID_PRICE
}

// ─── Dismissal memory ────────────────────────────────────────────────────────
// Kept here rather than in the dialog so the lightweight scroll trigger can
// check it without pulling the dialog's code into the bundle.

const STORAGE_KEY = 'si-promo-dismissed'

export function isPromoSnoozed(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const until = Number(window.localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(until) && Date.now() < until
  } catch {
    return false
  }
}

export function snoozePromo() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + PROMO.snoozeDays * 24 * 60 * 60 * 1000),
    )
  } catch {
    /* private mode — the popup simply reappears next session */
  }
}

/** Funnel and product surfaces where a promotion must never interrupt. */
export const PROMO_EXCLUDED_PREFIXES = [
  '/create',
  '/e/',
  '/dashboard',
  '/auth',
  '/admin',
  '/demo',
  '/pricing',
]
