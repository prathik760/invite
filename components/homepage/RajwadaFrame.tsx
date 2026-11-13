/**
 * One screen of the homepage's Rajwada showcase (public/landing/rj-*), as
 * AVIF where the browser takes it (about a quarter lighter) and WebP
 * otherwise. The hero fetches these first, so every later phone that shows
 * one (the walkthrough, the live invitation's cover) is served from the
 * browser's cache and is never left empty while something else loads.
 */
export type RajwadaScreen = 'closed' | 'open' | 'glow' | 'names' | 'reply'

export default function RajwadaFrame({
  name,
  alt = '',
  priority = 'auto',
  className = 'hv-fill',
}: {
  name: RajwadaScreen
  alt?: string
  priority?: 'high' | 'low' | 'auto'
  className?: string
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={`/landing/rj-${name}.avif`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/landing/rj-${name}.webp`} alt={alt} width={600} height={1298} decoding="async" fetchPriority={priority} className={className} />
    </picture>
  )
}
