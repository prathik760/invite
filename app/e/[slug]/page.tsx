import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import { prisma } from '@/lib/db'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { getTemplateData } from '@/modules/templates/data'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'
import ExpiredInvitation from '@/components/e/ExpiredInvitation'
import FreePlanBanner from '@/components/e/FreePlanBanner'
import { deletionDate, isEnded } from '@/lib/retention'

interface PageProps {
  params: { slug: string }
}

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

function getEventTitle(data: Record<string, string>, templateId?: string): string {
  if (templateId === 'save-the-date' && data.brideName && data.groomName) return `${data.brideName} & ${data.groomName} — Save the Date`
  if (data.headline && data.recipientName) return `${data.headline} — for ${data.recipientName}`
  if (data.recipientName) return `${data.occasion || 'A Surprise'} for ${data.recipientName} 🎁`
  if (data.brideName && data.groomName) return `${data.brideName} & ${data.groomName} — Wedding Invitation`
  if (data.partner1Name && data.partner2Name) return `${data.partner1Name} & ${data.partner2Name} — Engagement Invitation`
  if (data.celebrantName) {
    const age = Number((data.age || '').match(/^\s*(\d{1,3})/)?.[1])
    return `${data.celebrantName}'s ${age > 0 ? `${ordinal(age)} ` : ''}Birthday Celebration`
  }
  if (data.hostNames) return `${data.hostNames} — Griha Pravesh`
  if (data.babyName) return `Namakaran of ${data.babyName}`
  if (data.coupleNames) return `${data.coupleNames}${data.years ? ` — ${data.years} Years` : ''} Anniversary`
  if (data.sisterName && data.brotherName) return `${data.sisterName} & ${data.brotherName} — Raksha Bandhan`
  return 'You are Invited'
}

function getEventNames(data: Record<string, string>): string | undefined {
  return data.brideName && data.groomName
    ? `${data.brideName} & ${data.groomName}`
    : data.partner1Name && data.partner2Name
    ? `${data.partner1Name} & ${data.partner2Name}`
    : data.coupleNames || data.celebrantName || data.hostNames || undefined
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Block the sentinel slug before hitting the DB — the page component returns notFound()
  // for this slug, so its robots meta should also be noindex to prevent any mismatch.
  if (params.slug === '__custom-requests__') {
    return { robots: { index: false, follow: false } }
  }

  // Count only APPROVED wishes — raw submission count is not a quality signal because
  // anyone can submit wishes without host review. This must match the sitemap query.
  const event = await prisma.event
    .findUnique({
      where: { slug: params.slug },
      include: { _count: { select: { wishes: { where: { isApproved: true } } } } },
    })
    .catch(async (err: unknown) => {
      if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
      throw err
    })

  if (!event) return { title: 'Invitation Not Found' }

  const data = event.data as Record<string, string>
  const title = getEventTitle(data, event.templateId)
  const description = data.message
    ?? `${title}${data.venue ? ` at ${data.venue}` : ''}${data.date ? ` on ${data.date}` : ''}. RSVP and view details on ShareInvite.`
  const url = `${APP_URL}/e/${params.slug}`

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'ShareInvite',
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${url}/opengraph-image`],
    },
  }
}


export default async function EventPage({ params }: PageProps) {
  // Block the internal sentinel slug used for custom template requests
  if (params.slug === '__custom-requests__') notFound()

  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
    throw err
  })

  if (!event) notFound()

  // Validated against the plain template data, not the renderer: the renderer
  // is a client module, so its exports cannot be called during server render.
  if (!getTemplateData(event.templateId)) notFound()

  const data = event.data as Record<string, string>

  // Ends a few days after the celebration's last day; deleted later by the
  // daily cleanup (lib/retention.ts).
  if (isEnded(data)) {
    return <ExpiredInvitation templateId={event.templateId} data={data} deletesOn={deletionDate(data, event.createdAt).toISOString()} />
  }

  const shareUrl = `${APP_URL}/e/${event.slug}`
  const names = getEventNames(data)

  const startDate = data.date && data.time
    ? `${data.date}T${data.time}:00+05:30`
    : data.date || undefined

  const hostName = names || data.hostNames || data.parentNames || 'Event Host'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: getEventTitle(data, event.templateId),
    description: data.message || `You are cordially invited to join us for a special celebration.`,
    ...(startDate && { startDate }),
    ...(data.venue && {
      location: {
        '@type': 'Place',
        name: data.venue,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.venueAddress || data.venue,
          addressCountry: 'IN',
        },
      },
    }),
    organizer: {
      '@type': 'Person',
      name: hostName,
    },
    image: [`${shareUrl}/opengraph-image`],
    url: shareUrl,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    inLanguage: 'en-IN',
  }

  return (
    <>
      <Script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {!event.isPaid && <FreePlanBanner />}
      {/* Recordings never load on a guest's first page here, but a host who
          opens their invitation from the dashboard carries one in; keep the
          invitation's details out of it. */}
      <div data-clarity-mask="true" style={{ display: 'contents' }}>
        <TemplateRenderer templateId={event.templateId} data={data} eventId={event.id} />
      </div>
    </>
  )
}
