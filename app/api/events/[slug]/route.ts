import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { updateLocalEvent } from '@/lib/local-store'
import { editableEvent } from '@/lib/eventEdit'
import { sanitizeData } from '@/lib/eventData'

export const dynamic = 'force-dynamic'

/** Far more than any design's details; a guard against abuse, not a limit anyone meets. */
const MAX_DATA_CHARS = 200_000

/**
 * Saves changes to a published invitation. Its owner, signed in, or whoever
 * holds its edit key (lib/eventEdit.ts) may change its details while it is
 * live; the design, the link and what was paid stay the same. The invitation
 * page is cached, so saving clears it and guests see the change at once.
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
    // The invitation page is cached (app/e/[slug]); guests see the change now.
    revalidatePath(`/e/${check.event.slug}`)

    return NextResponse.json({ slug: check.event.slug })
  } catch (err) {
    console.error('[PATCH /api/events/:slug]', err)
    return NextResponse.json({ error: 'Your changes could not be saved. Please try again.' }, { status: 500 })
  }
}

/**
 * An invitation's stored record, for its owner only (4 Nov 2026). This used to return the whole
 * database row (the owner's account id included) to anyone who knew the link. Guests see the
 * invitation itself at /e/[slug]; this answers only the owner's session or the invitation's signed
 * edit link (lib/eventEdit), with the invitation's own details and nothing else.
 */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const check = await editableEvent(params.slug, req.headers.get('x-edit-key'))
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status })
    const { slug, templateId, data } = check.event
    return NextResponse.json({ slug, templateId, data })
  } catch (err) {
    console.error('[GET /api/events/:slug]', err)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
