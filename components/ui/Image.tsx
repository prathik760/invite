'use client'

import { forwardRef, version, type CSSProperties } from 'react'
import ReactDOM from 'react-dom'
import NextImage, { type ImageProps } from 'next/image'
import { SIZED_IMAGES } from '@/lib/sizedImages'

/** "/blog/x.jpg?v=2" at 960 -> "/blog/sized/x-960.webp?v=2" */
function sizedFile(src: string, width: number): string {
  const [path, v] = src.split('?')
  const cut = path.lastIndexOf('/')
  return `${path.slice(0, cut)}/sized/${path.slice(cut + 1, -'.jpg'.length)}-${width}.webp${v ? `?${v}` : ''}`
}

// React 18.3 and later know `fetchPriority`; earlier ones pass it through only in lower case (as next/image does).
const [major, minor] = version.split('.').map(Number)
const priorityProp = (p: 'high') => (major > 18 || (major === 18 && minor >= 3) ? { fetchPriority: p } : { fetchpriority: p })
const preload = (ReactDOM as unknown as { preload?: (href: string, options: Record<string, unknown>) => void }).preload

/**
 * next/image for the whole site. The site's own pictures (design pictures,
 * blog and occasion photos, phone screens: lib/sizedImages.ts) are drawn as a
 * plain <img> over their ready-made WebP sizes, each listed at its real width,
 * instead of going through Vercel's image optimiser, whose Hobby allowance ran
 * out in October 2026 and left every picture it had not made blank. Any other
 * image (an upload, a remote photo) goes through next/image as before.
 *
 * The plain <img> keeps what the site uses of next/image: `fill` (absolutely
 * placed over its parent), `sizes`, `width`/`height`, lazy loading, and for
 * `priority` an eager, high-priority load with a preload in the page's head.
 */
const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(props, ref) {
  const { src, alt, fill, sizes, priority, width, height, className, style, loading, unoptimized, loader } = props
  const widths = typeof src === 'string' && !unoptimized && !loader ? SIZED_IMAGES[src.split('?')[0]] : undefined
  if (!widths || typeof src !== 'string') return <NextImage ref={ref} {...props} />

  const srcSet = widths.map((w) => `${sizedFile(src, w)} ${w}w`).join(', ')
  const imageSizes = sizes ?? (fill ? '100vw' : `${Number(width) || widths[0]}px`)
  // For a browser that ignores srcset: the 640 copy, or the widest under it.
  const fallback = sizedFile(src, [...widths].reverse().find((w) => w <= 640) ?? widths[0])
  if (priority) preload?.(fallback, { as: 'image', imageSrcSet: srcSet, imageSizes, ...priorityProp('high') })

  const placed: CSSProperties = fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={fallback}
      srcSet={srcSet}
      sizes={imageSizes}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{ ...placed, color: 'transparent', ...style }}
      loading={priority ? 'eager' : loading ?? 'lazy'}
      decoding="async"
      {...(priority ? priorityProp('high') : {})}
    />
  )
})

export default Image
