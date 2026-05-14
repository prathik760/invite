import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { prisma } from '@/lib/db'
import type { PlanId } from '@/lib/plans'

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

  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
  if (!isValid) {
    console.error('[verify] Signature mismatch for order', razorpay_order_id)
    return NextResponse.json({ error: 'Payment verification failed. Please contact support.' }, { status: 400 })
  }

  try {
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
