import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkoutCountry, getRazorpayClient, planPriceFor } from '@/lib/razorpay'
import { minorUnits } from '@/lib/pricing'
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

  try {
    // Priced for the country the request comes from (lib/pricing.ts). The
    // price list goes into the order's notes so /verify can check the amount
    // against the same list, even if the customer's country changes meanwhile.
    const price = planPriceFor(plan, checkoutCountry(req))
    const razorpay = getRazorpayClient()

    const order = await razorpay.orders.create({
      amount: minorUnits(price),
      currency: price.currency,
      receipt: `inv_${buyer.slice(-8)}_${Date.now()}`,
      notes: { userId: buyer, plan, priceList: price.list },
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
