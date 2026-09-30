import { ImageResponse } from 'next/og'
import { ogFonts } from '@/lib/ogFonts'

export const INVITE_CARD_SIZE = { width: 1200, height: 630 }

/*
 * The card WhatsApp, iMessage and Instagram show when a host shares their
 * link. It is typeset from the host's own details — names, date, venue — in
 * the palette of the design they chose, like the front of a printed card.
 * (A screenshot of the design can't be used: it carries sample names.)
 */

interface Theme {
  bg: string
  ink: string
  soft: string
  accent: string
  frame: string
}

const LIGHT = (bg: string, ink: string, accent: string, frame: string): Theme => ({ bg, ink, soft: `${ink}B8`, accent, frame })
const DARK = (bg: string, ink: string, accent: string): Theme => ({ bg, ink, soft: `${ink}BD`, accent, frame: `${accent}55` })

const THEMES: Record<string, Theme> = {
  'elegant-wedding': LIGHT('#F5F0E6', '#2F2A25', '#6E7B5F', '#D8CDBB'),
  'cinematic-night': DARK('#0B0B0C', '#EFE8DC', '#E0A458'),
  'indian-wedding': LIGHT('#F2E4CC', '#5A1320', '#A52A1E', '#DA8A22'),
  'indian-engagement': LIGHT('#F5E7E1', '#3D1B38', '#B0705F', '#DDAE9F'),
  'indian-birthday': DARK('#1F2462', '#FFF4E0', '#F4A21C'),
  'griha-pravesh': LIGHT('#F5ECD9', '#3A2417', '#A5462A', '#DFCBAA'),
  namakaran: LIGHT('#F7F0E4', '#3D3932', '#B9704C', '#E3D6C1'),
  anniversary: DARK('#541327', '#F5ECDC', '#CFAE72'),
  'kgf-wedding': DARK('#0D0C0A', '#E8DFCC', '#C9A55C'),
  'royal-deco': DARK('#0F1B2E', '#F1E7D0', '#C9A961'),
  'luxury-wedding': DARK('#123B31', '#F0E7D4', '#D3B77C'),
  rakshabandhan: LIGHT('#F8F1E3', '#35251B', '#BD2A2B', '#E6D5B5'),
  'ganesh-chaturthi': LIGHT('#F9EFDD', '#46190F', '#B3261D', '#E8CDA3'),
  'surprise-journey': DARK('#24102A', '#FFFFFF', '#EBC37A'),
  'signature-rajwada': DARK('#6B1A1E', '#F5E7CD', '#D9B96C'),
  'signature-kalyanam': LIGHT('#FBF4E3', '#5A140E', '#9E2218', '#D89A1C'),
  'signature-nikah': DARK('#0F3B35', '#F4EBD7', '#E2C68C'),
  'signature-garden': LIGHT('#FBF8F1', '#2E3531', '#56684F', '#E9BDB2'),
  'baby-shower': LIGHT('#F7DED7', '#4A2744', '#A3405F', '#F1BDB6'),
  'first-birthday': LIGHT('#FFF6E6', '#23305A', '#C8543F', '#86C3E3'),
  'haldi-mehendi': LIGHT('#FBF2DC', '#3A2511', '#3E5A28', '#F2B226'),
  'sangeet-night': DARK('#130A1F', '#FBEFD8', '#F1C14F'),
  'pooja-invite': LIGHT('#FAF1E1', '#5A1712', '#A8231C', '#E9B535'),
  'diwali-party': DARK('#17113A', '#FCEFDA', '#F4C65C'),
  'eid-milan': LIGHT('#FBF6EA', '#1D3A33', '#0F5B4A', '#E2D5B6'),
  retirement: DARK('#1C2A45', '#F3EBDD', '#C9A55E'),
}
const GREETING = DARK('#2A0E22', '#FFFFFF', '#F0B7C4')

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDate(value?: string): string {
  if (!value) return ''
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return ''
  return `${DAYS[new Date(y, m - 1, d).getDay()]}, ${d} ${MONTHS[m - 1]} ${y}`
}

function formatTime(value?: string): string {
  if (!value) return ''
  const [h, m] = value.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return ''
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

/** 21 -> "21st", 12 -> "12th" */
function ordinal(n: number): string {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

interface Card {
  label: string
  names: [string] | [string, string]
  /** Small italic line under the names. */
  sub?: string
}

function cardFor(templateId: string, d: Record<string, string>): Card {
  const t = (v?: string) => (v || '').trim()
  const age = Number(t(d.age))
  const years = Number(t(d.years))
  if (templateId.startsWith('greeting-')) {
    return { label: t(d.headline) || 'A message for you', names: [`For ${t(d.recipientName) || 'you'}`], sub: t(d.senderName) ? `with love, ${t(d.senderName)}` : undefined }
  }
  if (templateId === 'surprise-journey') {
    return { label: t(d.occasion) || 'A surprise for you', names: [`For ${t(d.recipientName) || 'you'}`], sub: t(d.senderName) ? `from ${t(d.senderName)}` : undefined }
  }
  if (t(d.brideName) && t(d.groomName)) {
    const label = templateId === 'haldi-mehendi' ? 'Haldi & Mehendi'
      : templateId === 'sangeet-night' ? 'Sangeet'
      : templateId === 'signature-nikah' ? 'Nikah'
      : 'Wedding invitation'
    return { label, names: [t(d.brideName), t(d.groomName)] }
  }
  if (t(d.motherName)) return { label: 'Baby shower', names: [t(d.motherName)], sub: t(d.hostNames) ? `hosted by ${t(d.hostNames)}` : undefined }
  if (t(d.honoreeName)) return { label: 'Retirement celebration', names: [t(d.honoreeName)], sub: t(d.milestone) || undefined }
  if (t(d.poojaName)) return { label: t(d.poojaName), names: [t(d.hostNames) || 'You are invited'] }
  if (t(d.partner1Name) && t(d.partner2Name)) return { label: 'Engagement', names: [t(d.partner1Name), t(d.partner2Name)] }
  if (t(d.sisterName) && t(d.brotherName)) return { label: t(d.title) || 'Raksha Bandhan', names: [t(d.sisterName), t(d.brotherName)] }
  if (t(d.coupleNames)) {
    const parts = t(d.coupleNames).split(/\s*&\s*|\s+and\s+/i).filter(Boolean)
    const label = Number.isFinite(years) && years > 0 ? `${ordinal(years)} wedding anniversary` : 'Anniversary celebration'
    return parts.length === 2 ? { label, names: [parts[0], parts[1]] } : { label, names: [t(d.coupleNames)] }
  }
  if (t(d.celebrantName)) {
    return { label: Number.isFinite(age) && age > 0 ? `${ordinal(age)} birthday` : 'Birthday celebration', names: [t(d.celebrantName)] }
  }
  if (t(d.babyName)) return { label: 'Naming ceremony', names: [t(d.babyName)], sub: t(d.parentNames) ? `with ${t(d.parentNames)}` : undefined }
  if (templateId === 'ganesh-chaturthi') return { label: t(d.title) || 'Ganesh Chaturthi', names: [t(d.hostNames) || 'You are invited'] }
  if (templateId === 'diwali-party') return { label: t(d.title) || 'Diwali Milan', names: [t(d.hostNames) || 'You are invited'] }
  if (templateId === 'eid-milan') return { label: t(d.title) || 'Eid Milan', names: [t(d.hostNames) || 'You are invited'] }
  if (t(d.hostNames)) return { label: 'Griha Pravesh', names: [t(d.hostNames)] }
  return { label: 'You are invited', names: ['You are invited'] }
}

function nameSize(longest: number, pair: boolean): number {
  const base = pair ? 104 : 96
  if (longest <= 8) return base
  if (longest <= 12) return base - 14
  if (longest <= 16) return base - 28
  if (longest <= 22) return base - 40
  return base - 50
}

/** The share card for one invitation, from its template id and the host's data. */
export async function renderInviteCard(templateId: string, data: Record<string, string>) {
  const theme = templateId.startsWith('greeting-') ? GREETING : THEMES[templateId] ?? THEMES['elegant-wedding']
  const card = cardFor(templateId, data)

  const when = [formatDate(data.date), formatTime(data.time)].filter(Boolean).join('  ·  ')
  const rawVenue = (data.venue || data.venueAddress || '').trim()
  const venue = rawVenue.length > 52 ? `${rawVenue.slice(0, 51)}…` : rawVenue
  const pair = card.names.length === 2
  const longest = Math.max(...card.names.map((n) => n.length))
  const fontSize = nameSize(longest, pair)
  // Short couples sit on one line ("Priya & Arjun"); longer ones stack.
  const oneLine = pair && card.names[0].length + (card.names[1] ?? '').length <= 16

  const rule = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, marginBottom: 26 }}>
      <div style={{ display: 'flex', width: 72, height: 0, borderTop: `1.5px solid ${theme.accent}` }} />
      <div style={{ width: 8, height: 8, background: theme.accent, transform: 'rotate(45deg)' }} />
      <div style={{ display: 'flex', width: 72, height: 0, borderTop: `1.5px solid ${theme.accent}` }} />
    </div>
  )

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.bg,
          color: theme.ink,
          fontFamily: 'Cormorant, Mukta',
        }}
      >
        <div style={{ position: 'absolute', top: 26, left: 26, right: 26, bottom: 26, border: `1px solid ${theme.frame}`, display: 'flex' }} />
        <div style={{ position: 'absolute', top: 32, left: 32, right: 32, bottom: 32, border: `1px solid ${theme.frame}`, opacity: 0.5, display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 110px' }}>
          <div style={{ fontFamily: 'Jost, Mukta', fontWeight: 500, fontSize: 22, letterSpacing: 6, textTransform: 'uppercase', color: theme.accent }}>
            {card.label}
          </div>

          {pair && oneLine ? (
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 26, fontSize, fontWeight: 600, lineHeight: 1 }}>
              <span>{card.names[0]}</span>
              <span style={{ fontStyle: 'italic', fontWeight: 500, color: theme.accent, fontSize: fontSize * 0.7, margin: '0 22px' }}>&amp;</span>
              <span>{card.names[1]}</span>
            </div>
          ) : pair ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 22, fontSize: fontSize * 0.86, fontWeight: 600, lineHeight: 1.02 }}>
              <span>{card.names[0]}</span>
              <span style={{ fontStyle: 'italic', fontWeight: 500, color: theme.accent, fontSize: fontSize * 0.5, margin: '4px 0' }}>&amp;</span>
              <span>{card.names[1]}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', marginTop: 24, fontSize, fontWeight: 600, lineHeight: 1.04, maxWidth: 960 }}>{card.names[0]}</div>
          )}

          {card.sub && (
            <div style={{ display: 'flex', marginTop: 16, fontSize: 34, fontStyle: 'italic', color: theme.soft }}>{card.sub}</div>
          )}

          {(when || venue) && rule}

          {when && (
            <div style={{ display: 'flex', fontFamily: 'Jost, Mukta', fontSize: 28, fontWeight: 500, letterSpacing: 0.5 }}>{when}</div>
          )}
          {venue && (
            <div style={{ display: 'flex', marginTop: 10, fontSize: 34, fontStyle: 'italic', color: theme.soft }}>{venue}</div>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: 48, display: 'flex', fontFamily: 'Jost', fontSize: 17, letterSpacing: 2, color: theme.soft, opacity: 0.8 }}>
          shareinvite.in
        </div>
      </div>
    ),
    { ...INVITE_CARD_SIZE, fonts: await ogFonts() },
  )
}
