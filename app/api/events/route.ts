import { NextRequest, NextResponse } from 'next/server'
import { FREE_LIMIT, freeInvitesUsed } from '@/lib/freeInvites'
import { isDeliverable, sendLater, sendMail } from '@/lib/mail'
import { invitationLiveEmail } from '@/lib/emails'
import { eventTitle, groomFirst } from '@/lib/inviteCardText'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateSlug, getAppUrl } from '@/lib/utils'
import { getTemplateData } from '@/modules/templates/data'
import { createLocalEvent, shouldUseLocalStore } from '@/lib/local-store'
import { owns, templatePrice, type Owned } from '@/lib/plans'
import { ownedBy } from '@/lib/entitlements'
import { sanitizeData } from '@/lib/eventData'
import { editKey, editUrl } from '@/lib/editKey'
import { updateRequest } from '@/lib/doneForYou'

/** The first word of the link for designs that name only their hosts. */
const OCCASION_SLUG: Record<string, string> = {
  'diwali-party': 'diwali', 'eid-milan': 'eid', 'ganesh-chaturthi': 'ganesh', 'pooja-invite': 'pooja',
  'dasara-ambari': 'dasara', 'christmas-evergreen': 'christmas', 'newyear-midnight': 'new-year',
  'baby-shower': 'baby-shower', retirement: 'retirement',
}

/** Designs that greet a guest by name from a ?to= link, with an example for the email. */
const PERSONAL_LINK_EXAMPLE: Record<string, string> = {
  'birthday-gala': 'Sarah+and+Tom', 'dasara-ambari': 'Shalini+and+family', 'christmas-evergreen': 'The+Thompsons', 'newyear-midnight': 'Jules+and+Sam', 'signature-saptapadi': 'Sharma+family',
  'signature-two-worlds': 'Mehra+family',
  'signature-royal-edit': 'Mehra+family',
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const templateId = body?.templateId
  const data = body?.data
  // "Publish free, with ShareInvite branding" (lib/freeInvites.ts). Ignored for a design already owned.
  const free = body?.free === true

  if (!templateId || typeof templateId !== 'string' || !data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const templateDef = getTemplateData(templateId)
  if (!templateDef) {
    // Return generic 400 — avoids leaking which templateIds are valid
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 })
  }

  const sanitizedData = sanitizeData(data as Record<string, unknown>)

  // An account is required to create an invitation (4 Nov 2026), checked here on the server and
  // not only by the builder's sign-in gate (middleware.ts). The guest "purchase pass" from
  // /api/payments/verify is no longer accepted on its own: whoever publishes must be signed in.
  const session = await getServerSession(authOptions).catch(() => null)
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Please sign in to publish your invitation.', code: 'AUTH_REQUIRED' }, { status: 401 })
  }

  // The designs this account owns (lib/entitlements.ts): each one bought, plus
  // an earlier customer's plan. A database error is not "owns nothing": that
  // would ask someone who has paid to pay again.
  let owned: Owned
  try {
    owned = await ownedBy(userId)
  } catch (err) {
    console.error('[POST /api/events] ownership check', err)
    return NextResponse.json({ error: 'We could not publish just now. Please try again in a moment.' }, { status: 503 })
  }

  // Entitlement is enforced here, not only in the UI. Previously the client
  // could reach this endpoint without paying — signing out, or choosing
  // "Continue without account" in the login prompt, skipped the upgrade modal
  // entirely and published a paid template for free.
  if (!owns(templateId, owned) && free) {
    // A free page is capped per account: free pages that can carry links attract spammers.
    let used = 0
    try {
      used = await freeInvitesUsed(userId)
    } catch (err) {
      console.error('[POST /api/events] free count', err)
      return NextResponse.json({ error: 'We could not publish just now. Please try again in a moment.' }, { status: 503 })
    }
    if (used >= FREE_LIMIT) {
      return NextResponse.json(
        {
          error: `You have ${FREE_LIMIT} free invitations already. Remove the branding from one of them, or pay once for this design to publish it without branding.`,
          code: 'FREE_LIMIT',
          limit: FREE_LIMIT,
        },
        { status: 429 },
      )
    }
  } else if (!owns(templateId, owned)) {
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

  // `isPaid` decides the ShareInvite branding on the published page (FreePlanBanner, FreeBranding):
  // false for a free publish, true whenever the account owns the design. Buying the design later
  // turns its free invitations paid (lib/freeInvites.ts unbrandDesign).
  const isPaid = owns(templateId, owned)

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
      d.brideName && d.groomName ? (groomFirst(templateId, d) ? `${d.groomName}-${d.brideName}` : `${d.brideName}-${d.groomName}`) :
      d.partner1Name && d.partner2Name ? `${d.partner1Name}-${d.partner2Name}` :
      d.celebrantName ? d.celebrantName :
      templateId.startsWith('confession-') && d.recipientName ? `for-${d.recipientName}` :
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

    // Congratulations, with the link and the edit link, once the invitation is live: free or paid.
    if (userId) {
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
            editUrl: editUrl(getAppUrl().replace(/\/$/, ''), event.slug, event.id),
            ...(isPaid ? {} : { freePrice: templatePrice(templateId) }),
          }),
        )
      })
    }

    // Published from a done-for-you link (lib/doneForYou.ts): the request is done, with the link to it.
    const requestToken = typeof body?.request === 'string' ? body.request : ''
    if (requestToken) sendLater(() => updateRequest(requestToken, (r) => ({ ...r, status: 'published', publishedSlug: event.slug })))

    // The publishing device keeps this key, so the host can change the invitation later without signing in.
    return NextResponse.json({ slug: event.slug, id: event.id, editKey: editKey(event.id), isPaid }, { status: 201 })
  } catch (err) {
    if (shouldUseLocalStore(err)) {
      const event = await createLocalEvent(templateId, sanitizedData as Record<string, string>)
      console.warn('[POST /api/events] Database unreachable, created local dev event instead.')
      return NextResponse.json(
        { slug: event.slug, id: event.id, editKey: editKey(event.id), storage: 'local-dev' },
        { status: 201 },
      )
    }
    console.error('[POST /api/events]', err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
