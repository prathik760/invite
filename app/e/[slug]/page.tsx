import { cache } from 'react'
import FreeBranding from '@/components/e/FreeBranding'
import { notFound } from 'next/navigation'
import { coupleLine, eventTitle } from '@/lib/inviteCardText'
import type { Metadata } from 'next'
import Script from 'next/script'
import { prisma } from '@/lib/db'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { getTemplateData } from '@/modules/templates/data'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'
import ExpiredInvitation from '@/components/e/ExpiredInvitation'
import FreePlanBanner, { FREE_BANNER_PX } from '@/components/e/FreePlanBanner'
import { deletionDate, isEnded, isInternalSlug } from '@/lib/retention'
import { templateSeoSlug } from '@/lib/seo'
import { guestLink } from '@/lib/guestLink'

interface PageProps {
  params: { slug: string }
}

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

/**
 * Rendered when the first guest opens it, then served from the cache for a
 * day, instead of a server render for every guest. Saving an edit clears it
 * at once (PATCH /api/events/[slug]), and so does the daily cleanup when it
 * deletes an invitation; wishes load in the browser. An invitation turns to
 * its "ended" page within the day, which is days before it is deleted.
 */
export const revalidate = 86400
export function generateStaticParams() {
  return []
}

/** One database read per render, shared by the metadata and the page. */
const loadEvent = cache((slug: string) =>
  prisma.event.findUnique({ where: { slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(slug)
    throw err
  }),
)

/**
 * The share card's address carries a fingerprint of what is printed on it.
 * The card is cached by the CDN (./opengraph-image.tsx), so an edit has to
 * change the address for WhatsApp to be given the new card; this page is
 * re-rendered on every edit, so it always links the current one.
 */
function cardUrl(pageUrl: string, templateId: string, data: unknown): string {
  const text = `${templateId}|${JSON.stringify(data ?? {})}`
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193)
  return `${pageUrl}/opengraph-image?v=${(h >>> 0).toString(36)}`
}

function getEventNames(data: Record<string, string>, templateId: string): string | undefined {
  return data.brideName && data.groomName
    ? coupleLine(data, templateId)
    : data.partner1Name && data.partner2Name
    ? `${data.partner1Name} & ${data.partner2Name}`
    : data.coupleNames || data.celebrantName || data.hostNames || undefined
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Internal records (custom requests, done-for-you requests: slugs starting "__") are never pages.
  // The page component returns notFound() for them, so their robots meta is noindex too.
  if (isInternalSlug(params.slug)) {
    return { robots: { index: false, follow: false } }
  }

  const event = await loadEvent(params.slug)

  if (!event) return { title: 'Invitation Not Found' }

  const data = event.data as Record<string, string>
  const title = eventTitle(data, event.templateId)
  const description = data.message
    ?? `${title}${data.venue ? ` at ${data.venue}` : ''}${data.date ? ` on ${data.date}` : ''}. RSVP and view details on ShareInvite.`
  const url = `${APP_URL}/e/${params.slug}`
  const image = cardUrl(url, event.templateId, event.data)

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
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}


export default async function EventPage({ params }: PageProps) {
  // Internal records: custom requests and done-for-you requests (lib/doneForYou.ts).
  if (isInternalSlug(params.slug)) notFound()

  const event = await loadEvent(params.slug)

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
  const names = getEventNames(data, event.templateId)

  const startDate = data.date && data.time
    ? `${data.date}T${data.time}:00+05:30`
    : data.date || undefined

  const hostName = names || data.hostNames || data.parentNames || 'Event Host'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventTitle(data, event.templateId),
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
    image: [cardUrl(shareUrl, event.templateId, event.data)],
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
      {/* Published free: ShareInvite branding until the design is bought (lib/freeInvites.ts). The
          banner is pinned, so the page starts below it, and --invite-top moves the design's music
          button below it too. */}
      {!event.isPaid && (
        <>
          <FreePlanBanner pinned />
          <div aria-hidden style={{ height: FREE_BANNER_PX }} />
          <FreeBranding />
        </>
      )}
      {/* Recordings never load on a guest's first page here, but a host who
          opens their invitation from the dashboard carries one in; keep the
          invitation's details out of it. */}
      <div data-clarity-mask="true" style={{ display: 'contents', ...(!event.isPaid ? { ['--invite-top' as string]: `${FREE_BANNER_PX}px` } : {}) }}>
        <TemplateRenderer
          templateId={event.templateId}
          data={data}
          eventId={event.id}
          // Credited to invitations in GA4: each invitation bringing its next customer.
          designHref={`${APP_URL}${guestLink(`/templates/${templateSeoSlug(event.templateId)}?src=invite_footer`, 'make_one_like_this')}`}
        />
      </div>
    </>
  )
}
