'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import BottomDock from '@/components/ui/BottomDock'

interface StickyCTAProps {
  href: string
  text: string
}

/** Mobile-only bottom bar that appears once the reader is into the guide. */
export default function StickyCTA({ href, text }: StickyCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 420)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <BottomDock
      className={`border-t border-line bg-paper/95 px-4 pt-2.5 backdrop-blur-md transition-transform duration-300 sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <Link href={href} className="btn-primary flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold">
        {text.replace(/\s*→$/, '')}
      </Link>
      <p className="mt-1.5 text-center text-[0.72rem] text-muted">Free to build & preview · Pay once when you publish</p>
    </BottomDock>
  )
}
