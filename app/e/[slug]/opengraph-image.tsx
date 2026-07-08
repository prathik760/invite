import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/db'
import { getLocalEventBySlug, shouldUseLocalStore } from '@/lib/local-store'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: { slug: string } }

// ── Per-template color palette ─────────────────────────────────────────────
type Theme = {
  bg: string
  bgAccent: string
  accent: string
  nameColor: string
  labelColor: string
  infoColor: string
  brandColor: string
  dividerColor: string
  frameColor: string
}

const THEMES: Record<string, Theme> = {
  'elegant-wedding':   { bg: '#FFF8EE', bgAccent: '#F5E4CC', accent: '#D4A843', nameColor: '#1F1209', labelColor: '#B87924', infoColor: '#6B5540', brandColor: '#7A3E4A', dividerColor: 'rgba(212,168,67,0.55)', frameColor: 'rgba(212,168,67,0.28)' },
  'luxury-wedding':    { bg: '#FFFAF2', bgAccent: '#F8EDD8', accent: '#D9A441', nameColor: '#150D04', labelColor: '#B87924', infoColor: '#5A4820', brandColor: '#7A3E4A', dividerColor: 'rgba(217,164,65,0.55)', frameColor: 'rgba(217,164,65,0.25)' },
  'indian-wedding':    { bg: '#FFF3E8', bgAccent: '#FCEBD8', accent: '#E2A735', nameColor: '#1A0500', labelColor: '#C44000', infoColor: '#6B3A20', brandColor: '#C44000', dividerColor: 'rgba(226,167,53,0.6)',  frameColor: 'rgba(196,64,0,0.22)' },
  'royal-deco':        { bg: '#F8F0E8', bgAccent: '#EFE0D0', accent: '#C9912A', nameColor: '#1A0D04', labelColor: '#9B6820', infoColor: '#5A4020', brandColor: '#9B6820', dividerColor: 'rgba(201,145,42,0.55)', frameColor: 'rgba(201,145,42,0.24)' },
  'cinematic-night':   { bg: '#07080F', bgAccent: '#0E0E1C', accent: '#C9A84C', nameColor: '#F2EEE6', labelColor: '#C9A84C', infoColor: 'rgba(242,238,230,0.62)', brandColor: '#C9A84C', dividerColor: 'rgba(201,168,76,0.42)', frameColor: 'rgba(201,168,76,0.18)' },
  'kgf-wedding':       { bg: '#060509', bgAccent: '#0C0A12', accent: '#C9A84C', nameColor: '#F0EAD6', labelColor: '#C9A84C', infoColor: 'rgba(240,234,214,0.58)', brandColor: '#C9A84C', dividerColor: 'rgba(201,168,76,0.38)', frameColor: 'rgba(201,168,76,0.16)' },
  'indian-engagement': { bg: '#FFF0F8', bgAccent: '#F8E0EE', accent: '#D4508C', nameColor: '#1A0012', labelColor: '#C0407A', infoColor: '#7A3060', brandColor: '#C0407A', dividerColor: 'rgba(212,80,140,0.5)',  frameColor: 'rgba(212,80,140,0.22)' },
  'indian-birthday':   { bg: '#FFF8E8', bgAccent: '#FFF0D0', accent: '#F59E0B', nameColor: '#1A0D00', labelColor: '#D97706', infoColor: '#6B4820', brandColor: '#D97706', dividerColor: 'rgba(245,158,11,0.55)', frameColor: 'rgba(245,158,11,0.24)' },
  'griha-pravesh':     { bg: '#FFFBF0', bgAccent: '#FFF5D8', accent: '#F5A623', nameColor: '#1A0E00', labelColor: '#D4820F', infoColor: '#6B5025', brandColor: '#B87924', dividerColor: 'rgba(245,166,35,0.5)',  frameColor: 'rgba(245,166,35,0.22)' },
  'namakaran':         { bg: '#F0F8FF', bgAccent: '#DCF0FF', accent: '#4A9FD4', nameColor: '#04102A', labelColor: '#2E7AB0', infoColor: '#3A5870', brandColor: '#2E7AB0', dividerColor: 'rgba(74,159,212,0.5)',  frameColor: 'rgba(74,159,212,0.22)' },
  'anniversary':       { bg: '#FBF0FF', bgAccent: '#F5E0FF', accent: '#C77DFF', nameColor: '#0F0020', labelColor: '#9B4DCF', infoColor: '#6B3890', brandColor: '#9B4DCF', dividerColor: 'rgba(199,125,255,0.5)',  frameColor: 'rgba(199,125,255,0.22)' },
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getEventTypeLabel(data: Record<string, string>): string {
  if (data.brideName && data.groomName)         return 'Wedding Invitation'
  if (data.partner1Name && data.partner2Name)   return 'Engagement Invitation'
  if (data.celebrantName)                        return data.age ? `${data.age}th Birthday Celebration` : 'Birthday Celebration'
  if (data.hostNames)                            return 'Griha Pravesh'
  if (data.babyName)                             return 'Namakaran Ceremony'
  if (data.coupleNames)                          return data.years ? `${data.years} Years Together` : 'Anniversary Celebration'
  return 'You Are Invited'
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return dateStr
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return `${day} ${months[month - 1]} ${year}`
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h)) return timeStr
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12  = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}

function nameFontSize(len: number): number {
  if (len <= 10) return 82
  if (len <= 14) return 72
  if (len <= 18) return 62
  if (len <= 22) return 52
  return 44
}

// ── OG Image ───────────────────────────────────────────────────────────────
export default async function Image({ params }: Props) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(async (err: unknown) => {
    if (shouldUseLocalStore(err)) return getLocalEventBySlug(params.slug)
    return null
  })

  const data       = (event?.data || {}) as Record<string, string>
  const templateId = (event as { templateId?: string | null } | null)?.templateId ?? ''
  const theme      = THEMES[templateId] ?? THEMES['elegant-wedding']

  const eventTypeLabel = getEventTypeLabel(data)
  const formattedDate  = formatDate(data.date)
  const formattedTime  = formatTime(data.time)
  const rawVenue       = data.venue || data.venueAddress || ''
  const venue          = rawVenue.length > 55 ? rawVenue.slice(0, 55) + '…' : rawVenue

  // Resolve display names
  let name1 = '', name2 = '', singleName = '', subtitle = ''
  let isCoupleDisplay = false

  if (data.brideName && data.groomName) {
    isCoupleDisplay = true; name1 = data.brideName; name2 = data.groomName
  } else if (data.partner1Name && data.partner2Name) {
    isCoupleDisplay = true; name1 = data.partner1Name; name2 = data.partner2Name
  } else if (data.coupleNames) {
    const parts = data.coupleNames.split(/\s*&\s*/)
    if (parts.length >= 2 && parts[0] && parts[1]) {
      isCoupleDisplay = true; name1 = parts[0]; name2 = parts[1]
    } else {
      singleName = data.coupleNames
    }
  } else if (data.celebrantName) {
    singleName = data.celebrantName
    if (data.age) subtitle = `${data.age} Years Old`
  } else if (data.hostNames) {
    singleName = data.hostNames
  } else if (data.babyName) {
    singleName = data.babyName
  } else {
    singleName = 'You Are Invited'
  }

  const maxNameLen = isCoupleDisplay
    ? Math.max(name1.length, name2.length)
    : singleName.length
  const fontSize = nameFontSize(maxNameLen)
  const ampSize  = Math.round(fontSize * 0.46)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          background: theme.bg,
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Radial warm-glow background */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(ellipse 72% 58% at 50% 48%, ${theme.bgAccent} 0%, transparent 78%)`,
          }}
        />

        {/* Inset decorative frame */}
        <div
          style={{
            position: 'absolute',
            top: 30, left: 30, right: 30, bottom: 30,
            border: `1px solid ${theme.frameColor}`,
          }}
        />

        {/* Corner sparkles */}
        <div style={{ position: 'absolute', top: 18, left: 18,  fontSize: 17, color: theme.accent, lineHeight: 1 }}>✦</div>
        <div style={{ position: 'absolute', top: 18, right: 18, fontSize: 17, color: theme.accent, lineHeight: 1 }}>✦</div>
        <div style={{ position: 'absolute', bottom: 18, left: 18,  fontSize: 17, color: theme.accent, lineHeight: 1 }}>✦</div>
        <div style={{ position: 'absolute', bottom: 18, right: 18, fontSize: 17, color: theme.accent, lineHeight: 1 }}>✦</div>

        {/* ShareInvite brand — top left */}
        <div
          style={{
            position: 'absolute',
            top: 56, left: 68,
            display: 'flex', alignItems: 'center', gap: 9,
          }}
        >
          <div
            style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: theme.accent,
            }}
          />
          <span
            style={{
              fontSize: 16,
              color: theme.brandColor,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            ShareInvite
          </span>
        </div>

        {/* Main centred content column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '88px 100px',
          }}
        >
          {/* Event type label */}
          <div
            style={{
              fontSize: 18,
              color: theme.labelColor,
              letterSpacing: 6,
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            {eventTypeLabel}
          </div>

          {/* Top divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: 640 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${theme.dividerColor})` }} />
            <div style={{ fontSize: 18, color: theme.accent, lineHeight: 1 }}>✦</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${theme.dividerColor})` }} />
          </div>

          {/* Name(s) block */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 28,
              marginBottom: 28,
            }}
          >
            {isCoupleDisplay ? (
              <>
                <span style={{ fontSize, color: theme.nameColor, lineHeight: 1.08 }}>
                  {name1}
                </span>
                <span
                  style={{
                    fontSize: ampSize,
                    color: theme.accent,
                    fontStyle: 'italic',
                    lineHeight: 1.35,
                  }}
                >
                  {'&'}
                </span>
                <span style={{ fontSize, color: theme.nameColor, lineHeight: 1.08 }}>
                  {name2}
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontSize,
                    color: theme.nameColor,
                    lineHeight: 1.08,
                    textAlign: 'center',
                    display: 'flex',
                  }}
                >
                  {singleName}
                </span>
                {subtitle ? (
                  <span
                    style={{
                      fontSize: Math.round(fontSize * 0.32),
                      color: theme.accent,
                      letterSpacing: 4,
                      textTransform: 'uppercase',
                      marginTop: 10,
                      display: 'flex',
                    }}
                  >
                    {subtitle}
                  </span>
                ) : null}
              </>
            )}
          </div>

          {/* Bottom divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: 640 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${theme.dividerColor})` }} />
            <div style={{ fontSize: 18, color: theme.accent, lineHeight: 1 }}>✦</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${theme.dividerColor})` }} />
          </div>

          {/* Date · Time · Venue */}
          {(formattedDate || venue) ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 9,
                marginTop: 22,
              }}
            >
              {formattedDate ? (
                <span style={{ fontSize: 23, color: theme.infoColor, letterSpacing: 0.5, display: 'flex' }}>
                  {formattedDate}{formattedTime ? ` · ${formattedTime}` : ''}
                </span>
              ) : null}
              {venue ? (
                <span style={{ fontSize: 20, color: theme.infoColor, letterSpacing: 0.3, display: 'flex' }}>
                  {venue}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Bottom-right URL watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            right: 68,
            fontSize: 14,
            color: theme.brandColor,
            letterSpacing: 1.5,
            opacity: 0.55,
            display: 'flex',
          }}
        >
          shareinvite.in
        </div>
      </div>
    ),
    size,
  )
}
