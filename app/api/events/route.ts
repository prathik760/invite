import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { getTemplateData } from '@/modules/templates/data'
import { createLocalEvent, shouldUseLocalStore } from '@/lib/local-store'

// Strip HTML tags from a string value to prevent stored XSS.
// Safe for all text fields — URLs (mapsUrl, musicUrl) are left intact since they pass URL validation.
function stripHtml(value: unknown): unknown {
  if (typeof value !== 'string') return value
  return value.replace(/<[^>]*>/g, '').trim()
}

function sanitizeData(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, stripHtml(v)]))
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const templateId = body?.templateId
  const data = body?.data

  if (!templateId || typeof templateId !== 'string' || !data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const templateDef = getTemplateData(templateId)
  if (!templateDef) {
    // Return generic 400 — avoids leaking which templateIds are valid
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 })
  }

  const sanitizedData = sanitizeData(data as Record<string, unknown>)

  // Attach userId if authenticated
  const session = await getServerSession(authOptions).catch(() => null)
  const userId = session?.user?.id ?? undefined

  try {
    await prisma.template.upsert({
      where: { id: templateId },
      update: {},
      create: {
        id: templateId,
        name: templateDef.name,
        previewImage: '',
        config: templateDef.config as object,
      },
    })

    const d = sanitizedData as Record<string, string>
    const prefix =
      d.brideName && d.groomName ? `${d.brideName}-${d.groomName}` :
      d.partner1Name && d.partner2Name ? `${d.partner1Name}-${d.partner2Name}` :
      d.celebrantName ? d.celebrantName :
      d.hostNames ? 'griha' :
      d.babyName ? d.babyName :
      d.coupleNames ? 'anniversary' :
      undefined

    const slug = generateSlug(prefix)

    const event = await prisma.event.create({
      data: {
        slug,
        templateId,
        data: sanitizedData as object,
        ...(userId ? { userId } : {}),
      },
    })

    return NextResponse.json({ slug: event.slug, id: event.id }, { status: 201 })
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      const event = await createLocalEvent(templateId, sanitizedData as Record<string, string>)
      console.warn('[POST /api/events] Database unreachable, created local dev event instead.')
      return NextResponse.json(
        { slug: event.slug, id: event.id, storage: 'local-dev' },
        { status: 201 },
      )
    }
    console.error('[POST /api/events]', err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
