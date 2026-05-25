'use client'

import { memo } from 'react'

interface PortraitRowProps {
  data: Record<string, string>
  dark?: boolean
}

export const PortraitRow = memo(function PortraitRow({ data, dark = false }: PortraitRowProps) {
  // Determine which photo keys to use
  const photos: { url: string; name: string }[] = []

  if (data.bridePhoto || data.groomPhoto) {
    if (data.bridePhoto) photos.push({ url: data.bridePhoto, name: data.brideName || 'Bride' })
    if (data.groomPhoto) photos.push({ url: data.groomPhoto, name: data.groomName || 'Groom' })
  } else if (data.partner1Photo || data.partner2Photo) {
    if (data.partner1Photo) photos.push({ url: data.partner1Photo, name: data.partner1Name || '' })
    if (data.partner2Photo) photos.push({ url: data.partner2Photo, name: data.partner2Name || '' })
  } else if (data.celebrantPhoto) {
    photos.push({ url: data.celebrantPhoto, name: data.celebrantName || '' })
  } else if (data.babyPhoto) {
    photos.push({ url: data.babyPhoto, name: data.babyName || '' })
  } else if (data.hostPhoto) {
    photos.push({ url: data.hostPhoto, name: data.hostNames || '' })
  } else if (data.couplePhoto) {
    photos.push({ url: data.couplePhoto, name: data.coupleNames || '' })
  }

  if (photos.length === 0) return null

  const ringColor = dark ? 'rgba(200,144,40,0.55)' : 'rgba(184,121,36,0.45)'
  const nameColor = dark ? 'rgba(237,224,188,0.70)' : 'rgba(44,32,28,0.55)'

  return (
    <div className="flex items-end justify-center gap-8 py-4" aria-hidden={photos.every(p => !p.url)}>
      {photos.map((p, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.url}
            alt={p.name}
            className="rounded-full object-cover"
            style={{
              width: '80px',
              height: '80px',
              border: `2.5px solid ${ringColor}`,
              boxShadow: `0 0 0 4px ${dark ? 'rgba(200,144,40,0.12)' : 'rgba(184,121,36,0.10)'}, 0 8px 24px rgba(0,0,0,0.18)`,
            }}
          />
          {p.name && (
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', color: nameColor, textTransform: 'uppercase' }}>
              {p.name}
            </p>
          )}
        </div>
      ))}
    </div>
  )
})
