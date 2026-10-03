import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkoutCountry, getRazorpayClient, planPriceFor } from '@/lib/razorpay'
import { discountedPrice, minorUnits } from '@/lib/pricing'
import { checkCoupon, couponMessage } from '@/lib/coupons'
import type { PlanId } from '@/lib/plans'
import { PLAN_MAP } from '@/lib/plans'

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

  // A discount code is checked here, not trusted from the browser. A code that
  // has ended or is for another design stops the checkout with the reason,
  // rather than quietly charging the full price to someone expecting less.
  const coupon = body?.code ? checkCoupon(body.code, plan) : null
  if (coupon && !coupon.ok) {
    return NextResponse.json({ error: couponMessage(coupon.reason), coupon: coupon.reason }, { status: 400 })
  }

  try {
    // Priced for the country the request comes from (lib/pricing.ts). The
    // price list goes into the order's notes so /verify can check the amount
    // against the same list, even if the customer's country changes meanwhile.
    const full = planPriceFor(plan, checkoutCountry(req))
    const price = coupon?.ok ? discountedPrice(full, coupon.coupon.percentOff) : full
    const razorpay = getRazorpayClient()

    const order = await razorpay.orders.create({
      amount: minorUnits(price),
      currency: price.currency,
      receipt: `inv_${buyer.slice(-8)}_${Date.now()}`,
      notes: {
        userId: buyer, plan, priceList: price.list,
        // Read back by /verify to expect the discounted amount; also how the
        // Razorpay dashboard shows which sales came through which code.
        ...(coupon?.ok ? { coupon: coupon.coupon.code, percentOff: coupon.coupon.percentOff } : {}),
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      // Whole units and label, for analytics and the payment-problem panel.
      price: price.amount,
      label: price.label,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[POST /api/payments/create-order]', err)
    return NextResponse.json({ error: 'Failed to create payment order. Please try again.' }, { status: 500 })
  }
}
