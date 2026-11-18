import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTemplateData } from '@/modules/templates/data'
import { cleanBuilderData, findRequest, sameSecret, updateRequest } from '@/lib/doneForYou'

/**
 * One done-for-you request (lib/doneForYou.ts).
 *
 * GET: the invitation, for the builder (app/create, ?request=<token>). Anyone with the link: it is
 * the customer's link to their finished invitation, so it carries only the design and its boxes.
 * With the team key (x-team-key) it also returns who asked and how to reach them.
 *
 * PUT: the team saves the finished invitation into the request (team key required). The customer's
 * link shows it from then on.
 */

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const found = await findRequest(params.token).catch(() => null)
  if (!found) return NextResponse.json({ error: 'This link is not valid any more. Message us on WhatsApp and we will send a new one.' }, { status: 404 })
  const { event, rec } = found
  const key = req.headers.get('x-team-key') ?? ''
  const team = Boolean(key) && sameSecret(key, rec.teamKey)
  return NextResponse.json(
    {
      templateId: event.templateId,
      fields: rec.fields,
      ref: rec.ref,
      status: rec.status,
      firstName: rec.contact.name.split(/\s+/)[0],
      ...(team ? { team: true, contact: rec.contact, extras: rec.extras, notes: rec.notes } : {}),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function PUT(req: NextRequest, { params }: { params: { token: string } }) {
  const found = await findRequest(params.token).catch(() => null)
  if (!found) return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  const key = req.headers.get('x-team-key') ?? ''
  if (!key || !sameSecret(key, found.rec.teamKey)) return NextResponse.json({ error: 'Only the team can save this request.' }, { status: 403 })
  const body = (await req.json().catch(() => null)) as { templateId?: unknown; data?: unknown } | null
  // The team may switch the customer to another design while finishing it.
  const templateId = typeof body?.templateId === 'string' ? body.templateId : found.event.templateId
  const data = cleanBuilderData(templateId, body?.data)
  if (!data) return NextResponse.json({ error: 'That invitation could not be saved.' }, { status: 400 })
  try {
    if (templateId !== found.event.templateId) {
      const t = getTemplateData(templateId)!
      await prisma.template.upsert({ where: { id: templateId }, update: {}, create: { id: templateId, name: t.name, previewImage: '', config: t.config as object } })
      await prisma.event.update({ where: { id: found.event.id }, data: { templateId } })
    }
    const rec = await updateRequest(params.token, (r) => ({ ...r, fields: data, status: r.status === 'published' ? r.status : 'ready', savedAt: new Date().toISOString() }))
    return NextResponse.json({ ok: true, status: rec?.status })
  } catch (err) {
    console.error('[PUT /api/done-for-you]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 })
  }
}
