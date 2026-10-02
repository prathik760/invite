import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getRazorpayClient, verifyPaymentSignature, planPriceIn } from '@/lib/razorpay'
import { isPriceList, minorUnits } from '@/lib/pricing'
import { prisma } from '@/lib/db'
import type { PlanId } from '@/lib/plans'
import { mergePlans, PLAN_MAP } from '@/lib/plans'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan } = body ?? {}

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !plan) {
    return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 })
  }

  if (!PLAN_MAP[plan as PlanId] || plan === 'free') {
    return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 })
  }

  // Verify HMAC signature — proves this payment_id + order_id combination is genuine
  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
  if (!isValid) {
    console.error('[verify] Signature mismatch for order', razorpay_order_id)
    return NextResponse.json({ error: 'Payment verification failed. Please contact support.' }, { status: 400 })
  }

  // Fetch the order from Razorpay to verify the amount matches the claimed plan.
  // Prevents a user from paying for "standard" but claiming "gold" in the body.
  try {
    const razorpay = getRazorpayClient()
    const order = await razorpay.orders.fetch(razorpay_order_id)
    const notes = (order.notes ?? {}) as Record<string, unknown>

    if (notes.plan !== undefined && notes.plan !== plan) {
      console.error(`[verify] Plan mismatch — order was for "${String(notes.plan)}", request claims "${plan}"`)
      return NextResponse.json({ error: 'Payment amount does not match plan price.' }, { status: 400 })
    }

    // The order records the price list it was created in (lib/pricing.ts).
    // Orders from before country pricing have none and were always INR.
    const list = isPriceList(notes.priceList) ? notes.priceList : 'inr'
    const expected = planPriceIn(plan as PlanId, list)
    const expectedMinor = minorUnits(expected)

    if (Number(order.amount) !== expectedMinor || order.currency !== expected.currency) {
      console.error(
        `[verify] Amount mismatch — order: ${order.amount} ${order.currency}, plan "${plan}" in "${list}" expects ${expectedMinor} ${expected.currency}`,
      )
      return NextResponse.json({ error: 'Payment amount does not match plan price.' }, { status: 400 })
    }

    // Idempotency — if this payment_id already activated a subscription, return success
    const existing = await prisma.subscription.findFirst({
      where: { razorpayPaymentId: razorpay_payment_id },
    })
    if (existing) {
      return NextResponse.json({ success: true, plan: existing.plan })
    }

    // Never revoke templates on a later purchase. A customer on All Access who
    // then buys the standalone Raksha Bandhan plan must keep All Access — a
    // plain upsert would overwrite it and take away templates they paid for.
    // mergePlans also covers the same-price case (Basic and Raksha Bandhan are
    // both ₹199 and neither contains the other), where a level comparison alone
    // would drop whichever was bought first.
    const current = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { plan: true, status: true },
    })
    const effectivePlan =
      current?.status === 'active'
        ? mergePlans(current.plan as PlanId, plan as PlanId)
        : (plan as PlanId)

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        plan: effectivePlan,
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      create: {
        userId: session.user.id,
        plan: effectivePlan,
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
    })

    return NextResponse.json({ success: true, plan: effectivePlan })
  } catch (err) {
    console.error('[POST /api/payments/verify]', err)
    return NextResponse.json({ error: 'Could not activate subscription. Contact support with payment ID.' }, { status: 500 })
  }
}
