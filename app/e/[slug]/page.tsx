import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import { prisma } from '@/lib/db'
import ElegantWedding from '@/components/templates/ElegantWedding'
import CinematicWedding from '@/components/templates/CinematicWedding'
import IndianWedding from '@/components/templates/IndianWedding'
import IndianEngagement from '@/components/templates/IndianEngagement'
import IndianBirthday from '@/components/templates/IndianBirthday'
import HouseWarming from '@/components/templates/HouseWarming'
import NamingCeremony from '@/components/templates/NamingCeremony'
import Anniversary from '@/components/templates/Anniversary'
import KGFWedding from '@/components/templates/KGFWedding'
import RoyalDeco from '@/components/templates/RoyalDeco'
import LuxuryWedding from '@/components/templates/LuxuryWedding'
import FloatingShareBar from '@/components/ui/FloatingShareBar'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'
import ExpiredInvitation from '@/components/e/ExpiredInvitation'
import FreePlanBanner from '@/components/e/FreePlanBanner'

// Invitation expires 3 days after the event date
function isExpired(data: Record<string, string>): boolean {
  if (!data.date) return false
  const [year, month, day] = data.date.split('-').map(Number)
  if (!year || !month || !day) return false
  const eventDate = new Date(year, month - 1, day)
  const gracePeriodMs = 3 * 24 * 60 * 60 * 1000
  return Date.now() > eventDate.getTime() + gracePeriodMs
}

interface PageProps {
  params: { slug: string }
}

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

function getEventTitle(data: Record<string, string>): string {
  if (data.brideName && data.groomName) return `${data.brideName} & ${data.groomName} — Wedding Invitation`
  if (data.partner1Name && data.partner2Name) return `${data.partner1Name} & ${data.partner2Name} — Engagement Invitation`
  if (data.celebrantName) return `${data.celebrantName}${data.age ? `'s ${data.age}th` : "'s"} Birthday Celebration`
  if (data.hostNames) return `${data.hostNames} — Griha Pravesh`
  if (data.babyName) return `Namakaran of ${data.babyName}`
  if (data.coupleNames) return `${data.coupleNames}${data.years ? ` — ${data.years} Years` : ''} Anniversary`
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
  const title = getEventTitle(data)
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

const TEMPLATE_COMPONENTS: Record<
  string,
  React.ComponentType<{ data: Record<string, string>; eventId?: string; isPreview?: boolean }>
> = {
  'elegant-wedding': ElegantWedding,
  'cinematic-night': CinematicWedding,
  'indian-wedding': IndianWedding,
  'indian-engagement': IndianEngagement,
  'indian-birthday': IndianBirthday,
  'griha-pravesh': HouseWarming,
  'namakaran': NamingCeremony,
  'anniversary': Anniversary,
  'kgf-wedding': KGFWedding,
  'royal-deco': RoyalDeco,
  'luxury-wedding': LuxuryWedding,
}

export default async function EventPage({ params }: PageProps) {
  // Block the internal sentinel slug used for custom template requests
  if (params.slug === '__custom-requests__') notFound()

  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
    throw err
  })

  if (!event) notFound()

  const Component = TEMPLATE_COMPONENTS[event.templateId]
  if (!Component) notFound()

  const data = event.data as Record<string, string>

  if (isExpired(data)) {
    return <ExpiredInvitation templateId={event.templateId} data={data} />
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
    name: getEventTitle(data),
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
      <Component data={data} eventId={event.id} />
      <FloatingShareBar url={shareUrl} names={names} />
    </>
  )
}
