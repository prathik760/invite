import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getRazorpayClient, verifyPaymentSignature, getPlanPrice } from '@/lib/razorpay'
import { prisma } from '@/lib/db'
import type { PlanId } from '@/lib/plans'
import { PLAN_MAP } from '@/lib/plans'

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
    const expectedPaise = getPlanPrice(plan as PlanId)

    if (Number(order.amount) !== expectedPaise) {
      console.error(
        `[verify] Amount mismatch — order: ${order.amount} paise, plan "${plan}" expects ${expectedPaise} paise`,
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

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        plan: plan as PlanId,
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      create: {
        userId: session.user.id,
        plan: plan as PlanId,
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
    })

    return NextResponse.json({ success: true, plan })
  } catch (err) {
    console.error('[POST /api/payments/verify]', err)
    return NextResponse.json({ error: 'Could not activate subscription. Contact support with payment ID.' }, { status: 500 })
  }
}
