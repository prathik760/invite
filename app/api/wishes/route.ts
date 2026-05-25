import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  createLocalWish,
  getApprovedLocalWishes,
  getLocalEventById,
  shouldUseLocalStore,
} from '@/lib/local-store'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId')
  if (!eventId) {
    return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
  }

  try {
    const wishes = await prisma.wish.findMany({
      where: { eventId, isApproved: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, message: true, createdAt: true, eventId: true, isApproved: true },
    })
    return NextResponse.json(wishes)
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      console.warn('[GET /api/wishes] Database unreachable, using local dev wishes.')
      return NextResponse.json(await getApprovedLocalWishes(eventId))
    }
    console.error('[GET /api/wishes]', err)
    return NextResponse.json({ error: 'Failed to fetch wishes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const eventId = body?.eventId
  const name = body?.name
  const message = body?.message

  // Explicit type guards before calling .trim() — prevents crashes if client sends non-string values
  if (!eventId || typeof name !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!name.trim() || !message.trim()) {
    return NextResponse.json({ error: 'Name and message cannot be empty' }, { status: 400 })
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 })
  }
  if (message.trim().length > 1000) {
    return NextResponse.json({ error: 'Message must be 1000 characters or less' }, { status: 400 })
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const wish = await prisma.wish.create({
      data: {
        eventId,
        name: name.trim(),
        message: message.trim(),
        isApproved: false,
      },
    })

    return NextResponse.json(wish, { status: 201 })
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      const localEvent = await getLocalEventById(eventId)
      if (!localEvent) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      const wish = await createLocalWish(eventId, name.trim(), message.trim())
      console.warn('[POST /api/wishes] Database unreachable, created local dev wish instead.')
      return NextResponse.json(wish, { status: 201 })
    }
    console.error('[POST /api/wishes]', err)
    return NextResponse.json({ error: 'Failed to submit wish' }, { status: 500 })
  }
}
