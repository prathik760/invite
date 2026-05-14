import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { getTemplateData } from '@/modules/templates/data'
import { createLocalEvent, shouldUseLocalStore } from '@/lib/local-store'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const templateId = body?.templateId
  const data = body?.data

  if (!templateId || !data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const templateDef = getTemplateData(templateId)
  if (!templateDef) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

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

    const prefix =
      data.brideName && data.groomName ? `${data.brideName}-${data.groomName}` :
      data.partner1Name && data.partner2Name ? `${data.partner1Name}-${data.partner2Name}` :
      data.celebrantName ? data.celebrantName :
      data.hostNames ? 'griha' :
      data.babyName ? data.babyName :
      data.coupleNames ? 'anniversary' :
      undefined

    const slug = generateSlug(prefix)

    const event = await prisma.event.create({
      data: {
        slug,
        templateId,
        data: data as object,
        ...(userId ? { userId } : {}),
      },
    })

    return NextResponse.json({ slug: event.slug, id: event.id }, { status: 201 })
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      const event = await createLocalEvent(templateId, data as Record<string, string>)
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
