import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/db'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: { slug: string } }

function eventTitle(data: Record<string, string>) {
  if (data.brideName && data.groomName) return `${data.brideName} & ${data.groomName}`
  if (data.partner1Name && data.partner2Name) return `${data.partner1Name} & ${data.partner2Name}`
  if (data.celebrantName) return `${data.celebrantName}'s Birthday`
  if (data.hostNames) return data.hostNames
  if (data.babyName) return `Namakaran of ${data.babyName}`
  if (data.coupleNames) return data.coupleNames
  return 'You are Invited'
}

export default async function Image({ params }: Props) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
    return null
  })
  const data = (event?.data || {}) as Record<string, string>
  const title = eventTitle(data)
  const venue = data.venue || data.venueAddress || 'Digital invitation by ShareInvite'
  const date = data.date || 'Open invitation'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#FFF8F1',
          color: '#221B17',
          padding: 72,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ fontSize: 26, color: '#B87924', letterSpacing: 4, textTransform: 'uppercase' }}>
          ShareInvite
        </div>
        <div style={{ marginTop: 24, maxWidth: 900, fontSize: 84, lineHeight: 1.02 }}>
          {title}
        </div>
        <div style={{ marginTop: 30, maxWidth: 760, fontSize: 32, lineHeight: 1.35, color: '#7E716B' }}>
          {date} - {venue}
        </div>
        <div style={{ marginTop: 46, fontSize: 26, color: '#2F766D' }}>
          Open invitation, view venue, and send wishes
        </div>
      </div>
    ),
    size,
  )
}
