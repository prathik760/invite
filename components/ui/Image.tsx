'use client'

import { forwardRef } from 'react'
import NextImage, { type ImageProps } from 'next/image'
import { sizedTemplateImage } from '@/lib/templateMedia'

/**
 * next/image for the whole site. Design pictures (public/templates/<id>.jpg)
 * come from their ready-made sizes instead of Vercel's image optimiser (see
 * sizedTemplateImage); every other image is optimised as before.
 */
const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(props, ref) {
  const sized = typeof props.src === 'string' && !props.unoptimized && !props.loader && sizedTemplateImage(props.src, 0) !== null
  return <NextImage ref={ref} {...props} loader={sized ? ({ src, width }) => sizedTemplateImage(src, width) ?? src : props.loader} />
})

export default Image
