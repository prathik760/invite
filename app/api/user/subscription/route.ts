import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ plan: 'free' })
  }

  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })
    const plan = sub?.status === 'active' ? sub.plan : 'free'
    return NextResponse.json({ plan })
  } catch {
    return NextResponse.json({ plan: 'free' })
  }
}
