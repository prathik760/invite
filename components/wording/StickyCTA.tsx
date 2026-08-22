'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import BottomDock from '@/components/ui/BottomDock'

interface StickyCTAProps {
  href: string
  text: string
}

export default function StickyCTA({ href, text }: StickyCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 420)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <BottomDock
      className={`px-4 pt-2 bg-background/95 backdrop-blur-md border-t border-border sm:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <Link
        href={href}
        className="gold-button flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold"
      >
        {text}
      </Link>
      <p className="mt-1 text-center text-[10px] text-muted">
        Free to build · No credit card · WhatsApp-ready in 5 min
      </p>
    </BottomDock>
  )
}
