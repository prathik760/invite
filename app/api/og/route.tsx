import { ImageResponse } from 'next/og'
import { ogFonts } from '@/lib/ogFonts'

export const runtime = 'nodejs'


// Generic titled share card (`/api/og?title=…`), in the brand. The strapline
// used to read "Free Digital Invitations", but publishing is a one-time
// payment — only building and previewing are free.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Create your digital invitation'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #052E20 0%, #0B4A34 60%, #052E20 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'Cormorant',
          color: '#FFFDF9',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', fontSize: 40 }}>
          Share<span style={{ color: '#E8C866', fontStyle: 'italic' }}>Invite</span>
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.08, maxWidth: 980, display: 'flex' }}>{title}</div>
        <div style={{ display: 'flex', gap: 24, fontSize: 24, color: '#E8C866', fontFamily: 'Jost' }}>
          <span>Preview before you pay</span>
          <span>·</span>
          <span>One design, one price</span>
          <span>·</span>
          <span>Share on WhatsApp</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await ogFonts(),
    },
  )
}
