import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ShareInvite - Digital Wedding Invitation Maker & Online RSVP Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#F8F5F0',
          color: '#1F1A17',
          padding: 72,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#7A3E4A', letterSpacing: 4, textTransform: 'uppercase' }}>
          ShareInvite
        </div>
        <div style={{ marginTop: 26, maxWidth: 880, fontSize: 76, lineHeight: 1.04 }}>
          Digital Invitation Maker for Indian Events
        </div>
        <div style={{ marginTop: 28, maxWidth: 820, fontSize: 30, lineHeight: 1.35, color: '#706861' }}>
          Wedding invitations, WhatsApp invite pages, RSVP tracking, venue maps, gallery, music, and guest wishes.
        </div>
        <div style={{ marginTop: 44, display: 'flex', gap: 18, fontSize: 24, color: '#2E6F64' }}>
          <span>Start Free</span>
          <span>WhatsApp Ready</span>
          <span>Online RSVP</span>
        </div>
      </div>
    ),
    size,
  )
}
