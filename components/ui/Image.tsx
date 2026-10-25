'use client'

import { forwardRef } from 'react'
import NextImage, { type ImageProps } from 'next/image'
import { SIZED_IMAGES } from '@/lib/sizedImages'

/**
 * The ready-made copy of one of the site's own pictures for a next/image width:
 * the narrowest at least that wide, or the widest. Null for any other image.
 * "/blog/x.jpg" at 700 -> "/blog/sized/x-960.webp"; a "?v=" version is kept.
 */
function sizedImage(src: string, width: number): string | null {
  const [path, version] = src.split('?')
  const widths = SIZED_IMAGES[path]
  if (!widths) return null
  const w = widths.find((s) => s >= width) ?? widths[widths.length - 1]
  const cut = path.lastIndexOf('/')
  return `${path.slice(0, cut)}/sized/${path.slice(cut + 1, -'.jpg'.length)}-${w}.webp${version ? `?${version}` : ''}`
}

/**
 * next/image for the whole site. The site's own pictures (design pictures,
 * blog and occasion photos, phone screens: lib/sizedImages.ts) come from their
 * ready-made sizes instead of Vercel's image optimiser, whose Hobby allowance
 * ran out in October 2026 and left every picture it had not made blank. Any
 * other image (an upload, a remote photo) is optimised as before.
 */
const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(props, ref) {
  const sized = typeof props.src === 'string' && !props.unoptimized && !props.loader && sizedImage(props.src, 0) !== null
  return <NextImage ref={ref} {...props} loader={sized ? ({ src, width }) => sizedImage(src, width) ?? src : props.loader} />
})

export default Image
