import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  // Block the internal sentinel event used for custom template requests
  if (params.slug === '__custom-requests__') {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      const event = await getLocalEventBySlug(params.slug)
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      console.warn('[GET /api/events/:slug] Database unreachable, using local dev event.')
      return NextResponse.json(event)
    }
    console.error('[GET /api/events/:slug]', err)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
