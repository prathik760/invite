'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

interface WordingCopyCardProps {
  children: React.ReactNode
  ctaHref?: string
}

/** A wording sample as a quote card, with one-tap copy. */
export default function WordingCopyCard({ children, ctaHref = '/create' }: WordingCopyCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const text = textRef.current?.innerText ?? ''
    navigator.clipboard.writeText(text).catch(() => {
      const range = document.createRange()
      if (textRef.current) {
        range.selectNode(textRef.current)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
        document.execCommand('copy')
        window.getSelection()?.removeAllRanges()
      }
    }).finally(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <figure className="group relative my-5 rounded-3xl border border-line bg-paper p-6 pl-7 shadow-soft sm:p-7 sm:pl-8">
      <span aria-hidden className="absolute inset-y-6 left-0 w-1 rounded-r-full bg-gradient-to-b from-gold-soft to-burnished" />
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy this wording'}
        className={`absolute right-3 top-3 rounded-full px-4 py-2.5 text-[0.72rem] font-semibold transition-colors ${
          copied ? 'bg-emerald text-paper' : 'border border-line bg-champagne text-charcoal hover:border-burnished'
        }`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <p ref={textRef} className="whitespace-pre-line pr-16 font-editorial text-[1.22rem] leading-[1.6] text-charcoal">
        {children}
      </p>
      <figcaption className="mt-4">
        <Link href={ctaHref} className="link inline-flex items-center gap-1 text-[0.85rem]">
          Use these words in a beautiful design →
        </Link>
      </figcaption>
    </figure>
  )
}
