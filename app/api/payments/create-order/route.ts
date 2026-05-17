import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getRazorpayClient, getPlanPrice } from '@/lib/razorpay'
import type { PlanId } from '@/lib/plans'
import { PLAN_MAP } from '@/lib/plans'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const plan = body?.plan as PlanId | undefined

  if (!plan || plan === 'free' || !PLAN_MAP[plan]) {
    return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 })
  }

  try {
    const amount = getPlanPrice(plan)
    const razorpay = getRazorpayClient()

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `inv_${session.user.id.slice(-8)}_${Date.now()}`,
      notes: { userId: session.user.id, plan },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[POST /api/payments/create-order]', err)
    return NextResponse.json({ error: 'Failed to create payment order. Please try again.' }, { status: 500 })
  }
}
