import { ImageResponse } from 'next/og'
import { ogFonts } from '@/lib/ogFonts'

export const runtime = 'nodejs'

export const alt = 'ShareInvite — beautiful digital invitations for every celebration'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The site-wide link-preview card, in the brand: emerald, the gold seal mark,
// and the offer in one line. Shown wherever a ShareInvite page (not a
// customer's invitation — those have their own image) is shared.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #052E20 0%, #0B4A34 60%, #052E20 100%)',
          color: '#FFFDF9',
          padding: 72,
          fontFamily: 'Cormorant',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="76" height="76" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="23" fill="#03190F" />
            <circle cx="24" cy="24" r="19.6" fill="none" stroke="#E8C866" strokeOpacity="0.35" strokeWidth="0.9" />
            <rect x="16.4" y="11.4" width="15.2" height="20.5" rx="1.6" fill="#E8C866" />
            <path d="M24 14.6l1 2.45 2.45 1-2.45 1L24 21.5l-1-2.45-2.45-1 2.45-1z" fill="#03190F" />
            <path
              d="M12.4 22.4 24 30.4 35.6 22.4V32.9a2.5 2.5 0 0 1-2.5 2.5H14.9a2.5 2.5 0 0 1-2.5-2.5Z"
              fill="#03190F"
              stroke="#E8C866"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', fontSize: 44 }}>
            Share<span style={{ color: '#E8C866', fontStyle: 'italic' }}>Invite</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 80, lineHeight: 1.02, maxWidth: 940 }}>
            Beautiful digital invitations for every celebration
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: 'rgba(255,253,249,0.72)' }}>
            One design. One price. Everything included.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, fontSize: 24, color: '#E8C866', fontFamily: 'Jost' }}>
          <span>Free to build &amp; preview</span>
          <span>·</span>
          <span>Share on WhatsApp</span>
          <span>·</span>
          <span>No app for guests</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: await ogFonts(),
    },
  )
}
