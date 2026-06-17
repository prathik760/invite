import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Create Your Digital Invitation'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #7A3E4A 0%, #D9A441 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />
        <div style={{ fontSize: 24, opacity: 0.75, marginBottom: 28, letterSpacing: 2, display: 'flex' }}>
          ShareInvite.in
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.25,
            maxWidth: 900,
            display: 'flex',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 22, opacity: 0.8, marginTop: 32, textAlign: 'center', display: 'flex' }}>
          Free Digital Invitations · WhatsApp Ready · Online RSVP
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
