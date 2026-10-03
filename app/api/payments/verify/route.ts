import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getRazorpayClient, verifyPaymentSignature, planPriceIn } from '@/lib/razorpay'
import { discountedPrice, isPriceList, minorUnits } from '@/lib/pricing'
import { prisma } from '@/lib/db'
import type { PlanId } from '@/lib/plans'
import { mergePlans, PLAN_MAP } from '@/lib/plans'
import { issuePass } from '@/lib/purchasePass'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * The account a signed-out buyer's purchase is recorded on: theirs if the
 * email they gave Razorpay already has one, otherwise a new one with no
 * password, which they reach later with "Continue with Google" on the same
 * address. A payment without a usable email (Razorpay sends void@razorpay.com
 * when the field is hidden) gets an internal address of its own, so the
 * purchase still lands somewhere; their phone stays in the Razorpay dashboard.
 */
async function payerAccount(paymentId: string): Promise<string> {
  let email = ''
  try {
    const payment = await getRazorpayClient().payments.fetch(paymentId)
    email = String(payment.email ?? '').trim().toLowerCase()
  } catch (err) {
    console.error('[verify] could not read the payer from Razorpay', err instanceof Error ? err.message : err)
  }
  const usable = EMAIL.test(email) && !email.endsWith('@razorpay.com')
  const address = usable ? email : `guest-${paymentId.toLowerCase()}@guests.shareinvite.in`
  const user = await prisma.user.upsert({ where: { email: address }, update: {}, create: { email: address } })
  return user.id
}

export async function POST(req: NextRequest) {
  // Signing in is optional: a signed-out buyer's purchase goes on the account
  // for the email they paid with (payerAccount), and they get a purchase pass
  // to publish with instead of a session.
  const session = await getServerSession(authOptions).catch(() => null)
  const sessionUserId = session?.user?.id ?? null

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
    // A discount code's percentage is on the order too. Only our server writes
    // order notes, and it checked the code when it did, so a code that has
    // ended since the payment window opened is still honoured.
    const percentOff = notes.coupon ? Number(notes.percentOff) : 0
    const listPrice = planPriceIn(plan as PlanId, list)
    const expected = percentOff > 0 && percentOff < 100 ? discountedPrice(listPrice, percentOff) : listPrice
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
      return NextResponse.json({ success: true, plan: existing.plan, ...(sessionUserId ? {} : { pass: issuePass(existing.userId) }) })
    }

    const userId = sessionUserId ?? (await payerAccount(razorpay_payment_id))

    // Never revoke templates on a later purchase. A customer on All Access who
    // then buys the standalone Raksha Bandhan plan must keep All Access — a
    // plain upsert would overwrite it and take away templates they paid for.
    // mergePlans also covers the same-price case (Basic and Raksha Bandhan are
    // both ₹199 and neither contains the other), where a level comparison alone
    // would drop whichever was bought first.
    const current = await prisma.subscription.findUnique({
      where: { userId },
      select: { plan: true, status: true },
    })
    const effectivePlan =
      current?.status === 'active'
        ? mergePlans(current.plan as PlanId, plan as PlanId)
        : (plan as PlanId)

    await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: effectivePlan,
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      create: {
        userId,
        plan: effectivePlan,
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
    })

    return NextResponse.json({ success: true, plan: effectivePlan, ...(sessionUserId ? {} : { pass: issuePass(userId) }) })
  } catch (err) {
    console.error('[POST /api/payments/verify]', err)
    return NextResponse.json({ error: 'Could not activate subscription. Contact support with payment ID.' }, { status: 500 })
  }
}
