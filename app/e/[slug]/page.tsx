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
import FloatingShareBar from '@/components/ui/FloatingShareBar'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'

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
  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
    throw err
  })
  if (!event) return { title: 'Invitation Not Found' }

  const data = event.data as Record<string, string>
  const title = getEventTitle(data)
  const description = data.message || `You are cordially invited. Join us for a special celebration.`
  const url = `${APP_URL}/e/${params.slug}`

  return {
    title,
    description,
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
    isAccessibleForFree: false,
    inLanguage: 'en-IN',
  }

  return (
    <>
      <Script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Component data={data} eventId={event.id} />
      <FloatingShareBar url={shareUrl} names={names} />
    </>
  )
}
