import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getLocalDashboardEvents, shouldUseLocalStore } from '@/lib/local-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const events = await prisma.event.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        wishes: {
          select: { id: true, name: true, message: true, isApproved: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    return NextResponse.json(events)
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      console.warn('[GET /api/dashboard/events] Database unreachable, using local dev events.')
      return NextResponse.json(await getLocalDashboardEvents())
    }
    console.error('[GET /api/dashboard/events]', err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
