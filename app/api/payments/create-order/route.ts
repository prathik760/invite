import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getToken } from 'next-auth/jwt'
import { authOptions } from '@/lib/auth'
import { checkoutCountry, getRazorpayClient, planPriceFor } from '@/lib/razorpay'
import { discountedPrice, minorUnits, priceInList } from '@/lib/pricing'
import { priceOverride } from '@/lib/priceOverrides'
import { checkCoupon, couponMessage } from '@/lib/coupons'
import type { PlanId } from '@/lib/plans'
import { PLAN_MAP } from '@/lib/plans'
import { getTemplateData } from '@/modules/templates/data'

export async function POST(req: NextRequest) {
  // No sign-in needed to pay: /verify records a signed-out buyer's purchase on
  // the account for the email they give Razorpay.
  const session = await getServerSession(authOptions).catch(() => null)
  const buyer = session?.user?.id ?? 'guest'

  const body = await req.json().catch(() => null)
  const plan = body?.plan as PlanId | undefined

  if (!plan || plan === 'free' || !PLAN_MAP[plan]) {
    return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 })
  }
  // Which design is being bought: kept on the order for the receipt email.
  const templateId = typeof body?.templateId === 'string' && getTemplateData(body.templateId) ? body.templateId : undefined

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
        userId: buyer, plan, priceList: price.list,
        ...(templateId ? { templateId } : {}),
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
