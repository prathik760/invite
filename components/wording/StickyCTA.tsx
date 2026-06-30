'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-background/95 backdrop-blur-md border-t border-border sm:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Link
        href={href}
        className="gold-button flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold"
      >
        {text}
      </Link>
      <p className="mt-1 text-center text-[10px] text-muted">
        Free · No credit card · WhatsApp-ready in 5 min
      </p>
    </div>
  )
}
