import { ImageResponse } from 'next/og'
import { ogFonts, ogScriptFonts } from '@/lib/ogFonts'
import { cardFor } from '@/lib/inviteCardText'

export const INVITE_CARD_SIZE = { width: 1200, height: 630 }

/*
 * The card WhatsApp, iMessage and Instagram show when a host shares their
 * link: a printed invitation photographed on velvet. An ivory card, slightly
 * askew, with a second one peeking out behind it; a double gold rule and gold
 * flourishes in its corners; a wax seal with the host's initial; the names
 * written in a copperplate hand. The velvet, the seal and the card behind take
 * the palette of the design they chose. Everything on it is typeset from the
 * host's own details. (A screenshot of the design can't be used: it carries
 * sample names.)
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
  'save-the-date': LIGHT('#F8F3E8', '#27302A', '#A8472A', '#C7CBBA'),
  'birthday-mirrorball': DARK('#0D0A0B', '#F6EFE6', '#FF6A3D'),
  'birthday-martini': DARK('#27310F', '#F4EDDD', '#E9A79B'),
  'birthday-champagne': LIGHT('#F7F1E6', '#1D1A16', '#9E7A33', '#D9C08A'),
  'birthday-long-lunch': LIGHT('#FBF4E6', '#233047', '#E8602C', '#F2C230'),
  'birthday-gala': DARK('#0B2A23', '#F4ECD8', '#C9A04E'),
  'dasara-ambari': DARK('#1A0E45', '#FFF1D6', '#E9B949'),
  'christmas-evergreen': DARK('#0F3324', '#FBF3E4', '#D9A441'),
  'newyear-midnight': DARK('#07070C', '#F4EEDF', '#D8B25A'),
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

/* ── Colour helpers ─────────────────────────────────────────────────── */

const rgb = (hex: string) => {
  const h = hex.replace('#', '').slice(0, 6)
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const toHex = (c: number[]) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`
/** Mix `hex` towards `to` by `t` (0–1). */
const mix = (hex: string, to: string, t: number) => {
  const a = rgb(hex)
  const b = rgb(to)
  return toHex(a.map((v, i) => v + (b[i] - v) * t))
}
const luminance = (hex: string) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const IVORY = '#FBF6EC'
const INK = '#2B2118'
const INK_SOFT = '#5B4C3E'
const GOLD = '#A27B2E'
const GOLD_LIGHT = '#D9B566'

/** Copperplate size for the longest name: script runs wide, so it steps down early. */
function scriptSize(longest: number, stacked: boolean): number {
  const base = stacked ? 84 : 98
  if (longest <= 7) return base
  if (longest <= 10) return base - 10
  if (longest <= 14) return base - 22
  if (longest <= 18) return base - 32
  if (longest <= 24) return base - 40
  return base - 48
}

/** A gold flourish for a corner of the card: two rules on a quarter curve, with leaves. */
function Flourish({ rotate, color }: { rotate: number; color: string }) {
  return (
    <svg width="118" height="118" viewBox="0 0 118 118" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M8 110 C8 52 52 8 110 8" stroke={color} strokeWidth="1.6" fill="none" />
      <path d="M17 110 C17 60 60 17 110 17" stroke={color} strokeWidth="0.8" fill="none" opacity="0.7" />
      <path d="M8 8 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0" fill={color} />
      <path d="M30 52 C24 44 26 34 34 30 C36 40 36 46 30 52 Z" fill={color} opacity="0.85" />
      <path d="M52 30 C44 24 34 26 30 34 C40 36 46 36 52 30 Z" fill={color} opacity="0.85" />
      <path d="M22 78 C14 74 12 66 16 60 C22 66 24 70 22 78 Z" fill={color} opacity="0.7" />
      <path d="M78 22 C74 14 66 12 60 16 C66 22 70 24 78 22 Z" fill={color} opacity="0.7" />
      <path d="M40 40 C48 48 58 50 66 46" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M40 40 C48 48 50 58 46 66" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
    </svg>
  )
}

/** The share card for one invitation, from its template id and the host's data. */
export async function renderInviteCard(templateId: string, data: Record<string, string>) {
  const theme = templateId.startsWith('greeting-') ? GREETING : THEMES[templateId] ?? THEMES['elegant-wedding']
  const card = cardFor(templateId, data)

  // The velvet is the design's deepest colour: its background when that is
  // dark, its ink when the design is a light one.
  const velvet = luminance(theme.bg) < 0.2 ? theme.bg : luminance(theme.ink) < 0.2 ? theme.ink : mix(theme.ink, '#000000', 0.5)
  const accent = theme.accent
  // The seal is the design's accent, deepened so it reads as wax on ivory.
  const seal = luminance(accent) > 0.35 ? mix(accent, '#5A3A10', 0.35) : accent
  const behind = mix(accent, velvet, 0.45)

  const when = [formatDate(data.date), formatTime(data.time)].filter(Boolean).join('  ·  ')
  // A save-the-date names the town (and maybe the venue), not an address.
  const rawVenue = (templateId === 'save-the-date' ? [data.venue, data.city].filter(Boolean).join(', ') : data.venue || data.venueAddress || '').trim()
  const venue = rawVenue.length > 48 ? `${rawVenue.slice(0, 47)}…` : rawVenue
  const pair = card.names.length === 2
  const longest = Math.max(...card.names.map((n) => n.length))
  // Short couples sit on one line ("Priya & Arjun"); longer ones stack.
  const oneLine = !pair || card.names[0].length + (card.names[1] ?? '').length <= 15
  const size = scriptSize(pair && oneLine ? card.names[0].length + (card.names[1] ?? '').length + 3 : longest, pair && !oneLine)
  const initial = (card.names[0] === 'You are invited' ? card.label : card.names[0]).replace(/^(for|the)\s+/i, '').trim().charAt(0).toUpperCase() || 'S'

  const ornament = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', width: 64, height: 1, background: `linear-gradient(90deg, rgba(162,123,46,0), ${GOLD})` }} />
      <div style={{ display: 'flex', width: 7, height: 7, background: GOLD, transform: 'rotate(45deg)' }} />
      <div style={{ display: 'flex', width: 64, height: 1, background: `linear-gradient(90deg, ${GOLD}, rgba(162,123,46,0))` }} />
    </div>
  )

  // A few flecks of gold on the velvet, always in the same places.
  const flecks = [
    [64, 70, 4], [140, 520, 3], [1110, 96, 5], [1050, 560, 3], [210, 140, 2], [990, 470, 2], [92, 330, 3], [1150, 300, 2], [600, 30, 2], [430, 600, 2],
  ]

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
          backgroundColor: velvet,
          backgroundImage: `radial-gradient(circle at 50% 42%, ${mix(velvet, '#FFFFFF', 0.16)} 0%, ${velvet} 55%, ${mix(velvet, '#000000', 0.45)} 100%)`,
          fontFamily: 'Cormorant, Mukta',
          color: INK,
        }}
      >
        {flecks.map(([x, y, r], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: GOLD_LIGHT, opacity: 0.55, display: 'flex' }} />
        ))}

        {/* the card behind */}
        <div
          style={{
            position: 'absolute',
            left: 196,
            top: 76,
            width: 820,
            height: 478,
            display: 'flex',
            background: behind,
            border: `1px solid ${mix(accent, '#FFFFFF', 0.3)}`,
            transform: 'rotate(3.2deg)',
            boxShadow: '0 24px 50px rgba(0,0,0,0.35)',
          }}
        />

        {/* the invitation */}
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 70,
            width: 840,
            height: 490,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: IVORY,
            backgroundImage: 'radial-gradient(circle at 30% 20%, #FFFDF8 0%, #FBF6EC 55%, #F1E7D3 100%)',
            transform: 'rotate(-1.4deg)',
            boxShadow: '0 34px 70px rgba(0,0,0,0.5), 0 2px 0 rgba(255,255,255,0.6) inset',
          }}
        >
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, bottom: 16, border: `1.5px solid ${GOLD}`, display: 'flex' }} />
          <div style={{ position: 'absolute', top: 23, left: 23, right: 23, bottom: 23, border: `0.75px solid ${GOLD}`, opacity: 0.6, display: 'flex' }} />
          {/* flourishes in three corners; the seal takes the fourth */}
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex' }}><Flourish rotate={0} color={GOLD} /></div>
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex' }}><Flourish rotate={90} color={GOLD} /></div>
          <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex' }}><Flourish rotate={270} color={GOLD} /></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 96px', marginTop: 6 }}>
            <div style={{ display: 'flex', fontFamily: 'Jost, Mukta', fontWeight: 500, fontSize: 17, letterSpacing: 6, textTransform: 'uppercase', color: GOLD }}>
              {card.label}
            </div>

            {pair && oneLine ? (
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, fontFamily: 'Pinyon, Mukta', fontSize: size, lineHeight: 1.25, color: INK }}>
                <span>{card.names[0]}</span>
                <span style={{ fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 500, color: GOLD, fontSize: size * 0.56, margin: '0 18px' }}>&amp;</span>
                <span>{card.names[1]}</span>
              </div>
            ) : pair ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 6, fontFamily: 'Pinyon, Mukta', fontSize: size, lineHeight: 1.12, color: INK }}>
                <span>{card.names[0]}</span>
                <span style={{ fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 500, color: GOLD, fontSize: Math.max(32, size * 0.6), lineHeight: 1 }}>&amp;</span>
                <span>{card.names[1]}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', marginTop: 10, fontFamily: 'Pinyon, Mukta', fontSize: size, lineHeight: 1.25, color: INK, maxWidth: 660, textAlign: 'center' }}>{card.names[0]}</div>
            )}

            {card.sub && <div style={{ display: 'flex', marginTop: 2, fontSize: 26, fontStyle: 'italic', color: INK_SOFT }}>{card.sub}</div>}

            {(when || venue) && ornament}

            {when && <div style={{ display: 'flex', fontSize: 27, fontWeight: 600, letterSpacing: 0.6, color: INK }}>{when}</div>}
            {venue && <div style={{ display: 'flex', marginTop: 4, fontSize: 26, fontStyle: 'italic', color: INK_SOFT }}>{venue}</div>}
          </div>
        </div>

        {/* the wax seal */}
        <div
          style={{
            position: 'absolute',
            left: 930,
            top: 470,
            width: 104,
            height: 104,
            borderRadius: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `radial-gradient(circle at 36% 32%, ${mix(seal, '#FFFFFF', 0.35)} 0%, ${seal} 48%, ${mix(seal, '#000000', 0.45)} 100%)`,
            boxShadow: '0 10px 22px rgba(0,0,0,0.45)',
            transform: 'rotate(-8deg)',
          }}
        >
          <div style={{ display: 'flex', width: 80, height: 80, borderRadius: 40, border: `1.5px solid ${mix(seal, '#FFFFFF', 0.4)}`, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', fontFamily: 'Pinyon', fontSize: 52, lineHeight: 1, color: mix(seal, '#FFFFFF', 0.72), marginTop: 6 }}>{initial}</div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, display: 'flex', justifyContent: 'center', fontFamily: 'Jost', fontSize: 15, letterSpacing: 3, color: mix(velvet, '#FFFFFF', 0.6) }}>
          shareinvite.in
        </div>
      </div>
    ),
    { ...INVITE_CARD_SIZE, fonts: [...(await ogFonts()), ...(await ogScriptFonts())] },
  )
}
