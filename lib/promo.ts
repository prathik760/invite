import { LOWEST_PAID_PRICE, getRequiredPlan, templatePrice } from '@/lib/plans'
import { checkCoupon, type Coupon } from '@/lib/coupons'

/**
 * Seasonal promotion config — the single place to turn a campaign on or off.
 *
 * ── On the "offer" framing ───────────────────────────────────────────────────
 * `originalPrice` stays null unless a design's own price really drops.
 * Showing "~~₹199~~ ₹99" would invent a reference price that never existed —
 * misleading advertising under the Consumer Protection Act 2019, and "false
 * urgency" under the CCPA's Guidelines for Prevention and Regulation of Dark
 * Patterns (2023).
 *
 * If you genuinely run a sale, set `originalPrice` to the price that was really
 * charged before it, and set `endsAt` to when it really ends. The popup then
 * shows the saving and a countdown automatically. Until then it leads with
 * claims that are true and still strong: lowest-priced premium template,
 * one-time payment, preview before you pay.
 *
 * A discount code (lib/coupons.ts) is a real discount with a real end date:
 * set `coupon` and the popup shows the price with the code, struck through
 * against the normal price, and its CTA carries the code into the builder.
 */
export interface Promo {
  /** Master switch. */
  enabled: boolean
  templateId: string
  /** Real pre-sale price. null = no sale running; no strike-through is shown. */
  originalPrice: number | null
  /** A discount code from lib/coupons.ts the popup advertises, or null. */
  coupon: string | null
  /**
   * Pages the popup may appear on, or null for every page outside the funnel.
   * '/' means the home page only; other entries match as prefixes.
   */
  onlyOn: string[] | null
  /**
   * Real end of the campaign, ISO date. Drives the countdown.
   * Set this to the actual festival date — it is deliberately left null rather
   * than guessed, because a countdown to a wrong date is worse than none.
   */
  endsAt: string | null
  /**
   * A visitor's first time on the site: open the popup this long after they
   * land rather than waiting for a scroll. null = scroll for everyone.
   * Returning visitors always get it on scroll.
   */
  firstVisitDelayMs: number | null
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
  /**
   * Campaign creative.
   *
   * This used to be hard-coded inside ScrollPromo, which meant pointing
   * `templateId` at a different festival left the popup showing the new
   * template's image above the old festival's words. Keeping the copy beside
   * the id makes a switch a single, self-consistent edit.
   */
  copy: PromoCopy
  /** The slim offer bar above the header on every page (PromoBar), or null for none. */
  bar: PromoBarCopy | null
}

export interface PromoBarCopy {
  /** Small caps label, shown on wider screens. */
  eyebrow: string
  /** What is on offer, for phones: keep it to a word or two. */
  short: string
  /** The same, for wider screens. */
  long: string
  cta: string
  /** Days a closed bar stays hidden. */
  snoozeDays: number
}

export interface PromoCopy {
  /** Small label above the headline, e.g. the festival name. */
  eyebrow: string
  headline: string
  body: string
  /** Four short feature ticks — the grid is two columns. */
  features: string[]
  cta: string
  imageAlt: string
  /** Accent pair taken from the template's own palette. */
  accent: string
  accentSoft: string
  /** The darkest shade of the accent, for the popup's lower edge. */
  accentDeep?: string
}

export const PROMO: Promo = {
  // Wedding-season launch of Rajwada with the ROYAL20 code (lib/coupons.ts):
  // the popup on a first visit and on scroll after that, plus the offer bar on
  // every page. Both end on their own when the code does.
  enabled: true,
  templateId: 'signature-rajwada',
  originalPrice: null,
  coupon: 'ROYAL20',
  onlyOn: null,
  endsAt: '2026-12-31T23:59:59+05:30',
  firstVisitDelayMs: 2500,
  triggerAtScroll: 0.2,
  alsoTriggerAtBottom: true,
  shortPageDelayMs: 6000,
  snoozeDays: 7,
  copy: {
    eyebrow: 'Wedding season offer',
    headline: 'Open the palace gates for your guests',
    body: 'Our royal palace wedding suite: the gates open onto every function of the week, both families, travel and stay for guests and a WhatsApp RSVP — all on one link.',
    features: ['Palace gates opening', 'A card for every function', 'Travel, stay & FAQs', 'WhatsApp RSVP'],
    cta: 'Start my Rajwada invitation →',
    imageAlt: 'Rajwada royal palace wedding invitation design',
    accent: '#8A2E35',
    accentSoft: '#C9A45C',
    accentDeep: '#2A0710',
  },
  bar: {
    eyebrow: 'Wedding season',
    short: 'Rajwada',
    long: 'Rajwada royal palace suite',
    cta: 'Claim',
    snoozeDays: 2,
  },
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

/** The campaign's discount code, while it is live and covers the promoted design. */
export function promoCoupon(): Coupon | null {
  if (!PROMO.coupon) return null
  const check = checkCoupon(PROMO.coupon, getRequiredPlan(PROMO.templateId).id, PROMO.templateId)
  return check.ok ? check.coupon : null
}

/** Whether the popup belongs on this page. */
export function promoAllowedOn(pathname: string | null): boolean {
  if (!pathname || PROMO_EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return false
  return !PROMO.onlyOn || PROMO.onlyOn.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)))
}

// ─── First visit ─────────────────────────────────────────────────────────────

const SEEN_KEY = 'si-visited'
let firstVisit: boolean | null = null

/**
 * Whether this page load is the visitor's first time on the site. Decided once
 * per load and remembered, so moving to a second page in the same visit, or
 * coming back tomorrow, counts as returning.
 */
export function isFirstVisit(): boolean {
  if (firstVisit !== null) return firstVisit
  try {
    firstVisit = !window.localStorage.getItem(SEEN_KEY)
    if (firstVisit) window.localStorage.setItem(SEEN_KEY, String(Date.now()))
  } catch {
    // Storage blocked: there is no way to know, so treat them as returning
    // and let the scroll decide, rather than opening it on every page.
    firstVisit = false
  }
  return firstVisit
}

// ─── Offer bar ───────────────────────────────────────────────────────────────

/** Read by the root layout's pre-paint script and written by PromoBar's close button. */
export const PROMO_BAR_DISMISS_KEY = 'si-promo-bar-dismissed'

/** Pages that keep the offer bar off: the builder, guests' invitations, account and demo screens. */
export const PROMO_BAR_EXCLUDED_PREFIXES = ['/create', '/e/', '/admin', '/demo', '/auth', '/dashboard']

export function promoBarAllowedOn(pathname: string | null): boolean {
  return !!pathname && !PROMO_BAR_EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))
}

export function snoozePromoBar() {
  try {
    window.localStorage.setItem(PROMO_BAR_DISMISS_KEY, String(Date.now() + (PROMO.bar?.snoozeDays ?? 2) * 24 * 60 * 60 * 1000))
  } catch { /* private mode: it hides for this page only */ }
  document.documentElement.setAttribute('data-promo-bar', 'off')
}
