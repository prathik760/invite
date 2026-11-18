import { NextRequest, NextResponse } from 'next/server'
import { unbrandDesign } from '@/lib/freeInvites'
import { getServerSession } from 'next-auth/next'
import { getToken } from 'next-auth/jwt'
import { authOptions } from '@/lib/auth'
import { checkoutCountry, getRazorpayClient, planPriceFor } from '@/lib/razorpay'
import { discountedPrice, minorUnits, priceInList } from '@/lib/pricing'
import { priceOverride } from '@/lib/priceOverrides'
import { checkCoupon, couponMessage } from '@/lib/coupons'
import type { PlanId } from '@/lib/plans'
import { getRequiredPlan, PLAN_MAP } from '@/lib/plans'
import { ownsDesign } from '@/lib/entitlements'
import { getTemplateData } from '@/modules/templates/data'

export async function POST(req: NextRequest) {
  // No sign-in needed to pay: /verify records a signed-out buyer's purchase on
  // the account for the email they give Razorpay.
  // An account is required before checkout (4 Nov 2026): the builder needs one, and so does this.
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Please sign in to continue to payment.', code: 'AUTH_REQUIRED' }, { status: 401 })
  }
  const buyer = session.user.id

  const body = await req.json().catch(() => null)
  const plan = body?.plan as PlanId | undefined

  if (!plan || plan === 'free' || !PLAN_MAP[plan]) {
    return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 })
  }
  // The design being bought. Since 13 Nov 2026 it is what the payment buys
  // (lib/entitlements.ts), so it is required, and its price is the plan's.
  const templateId = typeof body?.templateId === 'string' && getTemplateData(body.templateId) ? (body.templateId as string) : undefined
  if (!templateId) {
    return NextResponse.json({ error: 'Choose a design to buy.' }, { status: 400 })
  }
  if (getRequiredPlan(templateId).id !== plan) {
    // A page open since a price change: stop before charging, not after.
    return NextResponse.json({ error: 'The price of this design has changed. Please reload the page.', code: 'PRICE_CHANGED' }, { status: 409 })
  }
  // Never charge twice for the same design.
  try {
    if (await ownsDesign(buyer, templateId)) {
      // An owner never sees branding: a free invitation from before the purchase is unbranded here.
      await unbrandDesign(buyer, templateId)
      return NextResponse.json({ error: 'This design is already yours.', code: 'ALREADY_OWNED' }, { status: 409 })
    }
  } catch (err) {
    console.error('[POST /api/payments/create-order] ownership check', err)
    return NextResponse.json({ error: 'We could not open the payment just now. Please try again in a moment.' }, { status: 503 })
  }

  // A token price set for this signed-in account and design (lib/priceOverrides.ts) replaces the
  // price, and any discount code, entirely.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }).catch(() => null)
  const tokenPrice = priceOverride({ email: session?.user?.email, provider: typeof token?.provider === 'string' ? token.provider : null, plan, templateId })

  // A discount code is checked here, not trusted from the browser. A code that
  // has ended or is for another design stops the checkout with the reason,
  // rather than quietly charging the full price to someone expecting less.
  const coupon = body?.code && tokenPrice === null ? checkCoupon(body.code, plan, templateId) : null
  if (coupon && !coupon.ok) {
    return NextResponse.json({ error: couponMessage(coupon.reason), coupon: coupon.reason }, { status: 400 })
  }

  try {
    // Priced for the country the request comes from (lib/pricing.ts). The
    // price list goes into the order's notes so /verify can check the amount
    // against the same list, even if the customer's country changes meanwhile.
    const full = tokenPrice !== null ? priceInList(tokenPrice, 'inr') : planPriceFor(plan, checkoutCountry(req))
    const price = coupon?.ok ? discountedPrice(full, coupon.coupon.percentOff) : full
    const razorpay = getRazorpayClient()

    const order = await razorpay.orders.create({
      amount: minorUnits(price),
      currency: price.currency,
      receipt: `inv_${buyer.slice(-8)}_${Date.now()}`,
      notes: {
        userId: buyer, plan, priceList: price.list, templateId,
        // Read back by /verify to expect the discounted amount; also how the
        // Razorpay dashboard shows which sales came through which code.
        ...(coupon?.ok ? { coupon: coupon.coupon.code, percentOff: coupon.coupon.percentOff } : {}),
        // Read back by /verify to expect the token price; also marks the sale in the Razorpay dashboard.
        ...(tokenPrice !== null ? { priceOverrideInr: tokenPrice } : {}),
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      // Whole units and label, for analytics and the payment-problem panel.
      price: price.amount,
      label: price.label,
      // A token-price order is a test: the page leaves it out of ad and analytics purchase reports.
      ...(tokenPrice !== null ? { test: true } : {}),
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[POST /api/payments/create-order]', err)
    return NextResponse.json({ error: 'Failed to create payment order. Please try again.' }, { status: 500 })
  }
}
