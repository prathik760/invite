'use client'

import { useEffect, useRef } from 'react'

/**
 * A bar docked to the bottom of the viewport that tells the rest of the page
 * how tall it is.
 *
 * The problem this solves: several pages pin a CTA bar to the bottom, and the
 * floating WhatsApp button used to clear it with a hard-coded `bottom-[88px]`.
 * That number was a guess against one bar's height. The homepage bar is ~92px,
 * the SEO bar ~62px, and the create-flow bar changes height when an error
 * message appears — so the button overlapped on some pages and floated in dead
 * space on others. Page content had the same problem in reverse: the last rows
 * of the footer sat underneath the bar with no padding to compensate.
 *
 * Every dock measures itself with a ResizeObserver and publishes the result to
 * `--bottom-dock-h` on the root element. Anything that needs to sit above the
 * dock — the floating button, page padding — reads that variable and stays
 * correct automatically, including when the bar grows or disappears.
 *
 * Safe-area inset is included in the published height, so callers do not need
 * to add it a second time.
 */
export default function BottomDock({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const publish = () => {
      document.documentElement.style.setProperty('--bottom-dock-h', `${el.offsetHeight}px`)
    }
    publish()

    // The bar's height is not fixed: an inline error, a second line of copy or
    // a font swap all change it after mount.
    const ro = new ResizeObserver(publish)
    ro.observe(el)

    return () => {
      ro.disconnect()
      // Reset on unmount, otherwise a page that had a dock leaves the offset
      // behind and the next page pads against a bar that is no longer there.
      document.documentElement.style.setProperty('--bottom-dock-h', '0px')
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`fixed inset-x-0 bottom-0 ${className}`}
      style={{ zIndex: 'var(--z-dock)' as unknown as number, ...style }}
    >
      {children}
    </div>
  )
}
