'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div
        className="border-t border-[#D9A441]/30 px-4 py-3"
        style={{ background: 'rgba(255, 252, 247, 0.97)', backdropFilter: 'blur(16px)' }}
      >
        <Link
          href="/create"
          className="gold-button flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold"
        >
          Create Free Invitation →
        </Link>
        <p className="mt-1.5 text-center text-[10px] text-muted">Free forever · No credit card needed</p>
      </div>
    </div>
  )
}
