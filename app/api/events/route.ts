import { NextRequest, NextResponse } from 'next/server'
import { isDeliverable, sendLater, sendMail } from '@/lib/mail'
import { invitationLiveEmail } from '@/lib/emails'
import { eventTitle } from '@/lib/inviteCardText'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { getTemplateData } from '@/modules/templates/data'
import { createLocalEvent, shouldUseLocalStore } from '@/lib/local-store'
import { canAccess, templatePrice, type PlanId } from '@/lib/plans'
import { readPass } from '@/lib/purchasePass'

// Strip HTML tags from a string value to prevent stored XSS.
// Safe for all text fields — URLs (mapsUrl, musicUrl) are left intact since they pass URL validation.
function stripHtml(value: unknown): unknown {
  if (typeof value !== 'string') return value
  return value.replace(/<[^>]*>/g, '').trim()
}

function sanitizeData(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, stripHtml(v)]))
}

/** The first word of the link for designs that name only their hosts. */
const OCCASION_SLUG: Record<string, string> = {
  'diwali-party': 'diwali', 'eid-milan': 'eid', 'ganesh-chaturthi': 'ganesh', 'pooja-invite': 'pooja',
  'dasara-ambari': 'dasara', 'christmas-evergreen': 'christmas', 'newyear-midnight': 'new-year',
  'baby-shower': 'baby-shower', retirement: 'retirement',
}

/** Designs that greet a guest by name from a ?to= link, with an example for the email. */
const PERSONAL_LINK_EXAMPLE: Record<string, string> = {
  'birthday-gala': 'Sarah+and+Tom', 'dasara-ambari': 'Shalini+and+family', 'christmas-evergreen': 'The+Thompsons', 'newyear-midnight': 'Jules+and+Sam',
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

  // Attach userId if authenticated, and resolve the plan actually purchased.
  // A signed-out buyer who has just paid sends the purchase pass from
  // /api/payments/verify instead; it names the account the purchase is on.
  const session = await getServerSession(authOptions).catch(() => null)
  const userId = session?.user?.id ?? readPass(body?.pass) ?? undefined

  let userPlan: PlanId = 'free'
  if (userId) {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: 'active', NOT: { plan: 'free' } },
      select: { plan: true },
      orderBy: { createdAt: 'desc' },
    }).catch(() => null)
    if (sub?.plan) userPlan = sub.plan as PlanId
  }

  // Entitlement is enforced here, not only in the UI. Previously the client
  // could reach this endpoint without paying — signing out, or choosing
  // "Continue without account" in the login prompt, skipped the upgrade modal
  // entirely and published a paid template for free.
  if (!canAccess(templateId, userPlan)) {
    return NextResponse.json(
      {
        error: 'This template requires a one-time purchase before publishing.',
        code: 'PAYMENT_REQUIRED',
        templateId,
        price: templatePrice(templateId),
      },
      { status: 402 },
    )
  }

  // `isPaid` drives the "Made with ShareInvite" banner on the published page.
  // Every template is now a purchase, so reaching this line already means the
  // author holds a plan covering it — the check is kept explicit rather than
  // hard-coded to `true` so the banner logic stays honest if a free tier ever
  // returns. Legacy events published under the old free tier keep isPaid=false
  // and continue to show the banner.
  const isPaid = userPlan !== 'free'

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
      // Designs that name only their hosts say what the occasion is; they all
      // used to start "griha-", so a Christmas party's link read like a housewarming.
      OCCASION_SLUG[templateId] ? OCCASION_SLUG[templateId] :
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
        isPaid,
        ...(userId ? { userId } : {}),
      },
    })

    // Congratulations, with the link, once the invitation is live.
    if (isPaid && userId) {
      const owner = userId
      sendLater(async () => {
        const user = await prisma.user.findUnique({ where: { id: owner }, select: { email: true, name: true } })
        if (!isDeliverable(user?.email)) return
        await sendMail(
          invitationLiveEmail({
            to: user.email,
            name: user.name || d.hostNames || d.celebrantName || d.brideName || d.partner1Name || '',
            slug: event.slug,
            title: eventTitle(d, templateId),
            designName: templateDef.name,
            dateLabel: d.date || undefined,
            personalLinks: templateId in PERSONAL_LINK_EXAMPLE,
            example: PERSONAL_LINK_EXAMPLE[templateId],
          }),
        )
      })
    }

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
