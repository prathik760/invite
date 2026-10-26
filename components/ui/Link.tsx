'use client'

import { forwardRef, type ComponentProps } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'ref'>

/**
 * next/link, fetching a page in the background only when someone is about to
 * open it (the pointer comes over the link, or a finger lands on it) instead of
 * whenever a link scrolls into view. Viewport prefetching fetched 7 to 60 pages
 * on every visit, and the host meters each one (CDN requests, ISR reads, data
 * from the server); fetching on intent keeps a click quick for a fraction of that.
 * An explicit `prefetch` is passed through untouched.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ prefetch, onMouseEnter, onTouchStart, ...props }, ref) {
  const router = useRouter()
  const intent = () => {
    const href = typeof props.href === 'string' ? props.href : null
    if (prefetch === undefined && href?.startsWith('/') && !href.startsWith('//')) router.prefetch(href)
  }
  return (
    <NextLink
      ref={ref}
      prefetch={prefetch ?? false}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        intent()
      }}
      onTouchStart={(e) => {
        onTouchStart?.(e)
        intent()
      }}
      {...props}
    />
  )
})

export default Link
