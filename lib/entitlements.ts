import { prisma } from '@/lib/db'
import { mergePlans, owns, type Owned, type PlanId } from '@/lib/plans'

/**
 * Who owns which designs, on the server. Read by the checkout (so nobody pays
 * twice for a design they already have), by publishing, and by the builder.
 *
 * Two sources, both kept:
 *  - Purchase: one row per design bought since 13 Nov 2026. The design is the
 *    buyer's, for as many invitations as they need (the bride's side and the
 *    groom's side, a second function), and nothing else is unlocked.
 *  - Subscription: the plan of a customer who bought before then, when a
 *    purchase also unlocked every cheaper design. Kept as it was.
 */

/** True for Prisma's "table does not exist" (P2021): the migration has not been run yet. */
function isMissingTable(err: unknown): boolean {
  if ((err as { code?: string })?.code === 'P2021') return true
  return err instanceof Error && /relation "?Purchase"? does not exist/i.test(err.message)
}

/**
 * Everything the account owns. A database error is thrown, not read as "owns
 * nothing": that would show a customer the price of a design they have
 * already paid for.
 */
export async function ownedBy(userId: string): Promise<Owned> {
  const [sub, purchases] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId }, select: { plan: true, status: true } }),
    prisma.purchase
      .findMany({ where: { userId }, select: { templateId: true } })
      .catch((err: unknown) => {
        if (isMissingTable(err)) return []
        throw err
      }),
  ])
  return {
    plan: sub?.status === 'active' && sub.plan ? (sub.plan as PlanId) : 'free',
    designs: purchases.map((p) => p.templateId),
  }
}

export async function ownsDesign(userId: string, templateId: string): Promise<boolean> {
  return owns(templateId, await ownedBy(userId))
}

export interface PaidOrder {
  userId: string
  plan: PlanId
  /** The design bought, when the order names one (every order since 13 Nov 2026). */
  templateId: string | null
  paymentId: string
  orderId: string
  amount: number
  currency: string
}

/** A payment already recorded (a retried verify): true, so it is answered as a success again. */
export async function alreadyRecorded(paymentId: string): Promise<boolean> {
  const [purchase, sub] = await Promise.all([
    prisma.purchase.findUnique({ where: { razorpayPaymentId: paymentId }, select: { id: true } }).catch((err: unknown) => {
      if (isMissingTable(err)) return null
      throw err
    }),
    prisma.subscription.findFirst({ where: { razorpayPaymentId: paymentId }, select: { id: true } }),
  ])
  return Boolean(purchase || sub)
}

/**
 * Records a verified payment. The design bought becomes the buyer's.
 *
 * Falls back to the old plan record when the order names no design (one
 * opened before this change) or the Purchase table has not been created yet:
 * the customer then gets the old, more generous access rather than a payment
 * that publishes nothing.
 */
export async function recordPayment(p: PaidOrder): Promise<void> {
  if (p.templateId) {
    try {
      await prisma.purchase.upsert({
        where: { userId_templateId: { userId: p.userId, templateId: p.templateId } },
        update: { plan: p.plan, razorpayPaymentId: p.paymentId, razorpayOrderId: p.orderId, amount: p.amount, currency: p.currency },
        create: {
          userId: p.userId,
          templateId: p.templateId,
          plan: p.plan,
          razorpayPaymentId: p.paymentId,
          razorpayOrderId: p.orderId,
          amount: p.amount,
          currency: p.currency,
        },
      })
      return
    } catch (err) {
      if (!isMissingTable(err)) throw err
      console.error('[entitlements] The Purchase table is missing: run prisma/migrations/20261113120000_design_purchases/migration.sql. Recorded as a plan instead.')
    }
  }

  // The old record: one plan per account, merged so nothing paid for is lost.
  const current = await prisma.subscription.findUnique({ where: { userId: p.userId }, select: { plan: true, status: true } })
  const plan = current?.status === 'active' ? mergePlans(current.plan as PlanId, p.plan) : p.plan
  await prisma.subscription.upsert({
    where: { userId: p.userId },
    update: { plan, status: 'active', razorpayPaymentId: p.paymentId, razorpayOrderId: p.orderId },
    create: { userId: p.userId, plan, status: 'active', razorpayPaymentId: p.paymentId, razorpayOrderId: p.orderId },
  })
}
