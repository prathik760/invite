import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ownedBy } from '@/lib/entitlements'
import { NOTHING_OWNED } from '@/lib/plans'

export const dynamic = 'force-dynamic'

/**
 * What the signed-in account owns, for the builder: `plan` (an earlier
 * customer's plan, or 'free') and `designs` (each design bought since
 * 13 Nov 2026). See lib/plans.ts `Owned`.
 *
 * On a database error it answers "nothing owned", and the builder shows the
 * price; the checkout then checks again on the server and never charges for a
 * design the account already has (/api/payments/create-order).
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json(NOTHING_OWNED)
  }

  try {
    return NextResponse.json(await ownedBy(session.user.id))
  } catch {
    return NextResponse.json(NOTHING_OWNED)
  }
}
