import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getLocalEventBySlug, shouldUseLocalStore, updateLocalEvent } from '@/lib/local-store'
import { editableEvent } from '@/lib/eventEdit'
import { sanitizeData } from '@/lib/eventData'

export const dynamic = 'force-dynamic'

/** Far more than any design's details; a guard against abuse, not a limit anyone meets. */
const MAX_DATA_CHARS = 200_000

/**
 * Saves changes to a published invitation. Its owner, signed in, or whoever
 * holds its edit key (lib/eventEdit.ts) may change its details while it is
 * live; the design, the link and what was paid stay the same. The invitation
 * page is rendered on every visit, so guests see the change at once.
 */
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const body = await req.json().catch(() => null)
  const data = body?.data
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return NextResponse.json({ error: 'Missing invitation details.' }, { status: 400 })
  }
  if (JSON.stringify(data).length > MAX_DATA_CHARS) {
    return NextResponse.json({ error: 'These details are too long to save.' }, { status: 413 })
  }

  try {
    const check = await editableEvent(params.slug, body?.key)
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status })
    const clean = sanitizeData(data as Record<string, unknown>) as Record<string, string>

    if (check.event.local) await updateLocalEvent(check.event.slug, clean)
    else await prisma.event.update({ where: { id: check.event.id }, data: { data: clean as object } })

    return NextResponse.json({ slug: check.event.slug })
  } catch (err) {
    console.error('[PATCH /api/events/:slug]', err)
    return NextResponse.json({ error: 'Your changes could not be saved. Please try again.' }, { status: 500 })
  }
}

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
