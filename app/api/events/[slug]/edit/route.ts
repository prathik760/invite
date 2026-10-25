import { NextRequest, NextResponse } from 'next/server'
import { editableEvent } from '@/lib/eventEdit'

export const dynamic = 'force-dynamic'

/**
 * A published invitation's details, for its owner to change in the builder
 * (/create?edit=<slug>). The edit key, if any, comes in a header so it stays
 * out of URLs and logs. Changes are saved with PATCH /api/events/<slug>.
 */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const check = await editableEvent(params.slug, req.headers.get('x-edit-key'))
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status })
    const { slug, templateId, data } = check.event
    return NextResponse.json({ slug, templateId, data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[GET /api/events/:slug/edit]', err)
    return NextResponse.json({ error: 'Could not open this invitation. Please try again.' }, { status: 500 })
  }
}
