'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BottomDock from '@/components/ui/BottomDock'
import { LOWEST_PAID_PRICE } from '@/lib/plans'
import { Price } from '@/components/price/Price'

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <BottomDock className="sm:hidden">
      <div
        className="border-t border-[#A47945]/30 px-4 pt-3"
        style={{
          background: 'rgba(255, 252, 247, 0.97)',
          backdropFilter: 'blur(16px)',
          // Clears the iOS home indicator; without it the button's lower half
          // is unreachable on notched phones.
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <Link
          href="/create"
          className="btn-primary flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold"
        >
          Create your invitation
        </Link>
        <p className="mt-1.5 text-center text-[10px] text-muted">Preview before you pay · From <Price inr={LOWEST_PAID_PRICE} />, one-time</p>
      </div>
    </BottomDock>
  )
}
