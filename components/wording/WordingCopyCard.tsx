'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

interface WordingCopyCardProps {
  children: React.ReactNode
  ctaHref?: string
}

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
    <div className="rounded-xl border border-border bg-[#FFFBF5] p-5 my-4 relative group">
      <button
        onClick={handleCopy}
        aria-label="Copy message"
        className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 ${
          copied
            ? 'bg-[#2F766D]/15 text-[#2F766D]'
            : 'bg-[#D9A441]/15 text-[#7A5C1E] hover:bg-[#D9A441]/35 cursor-pointer'
        }`}
      >
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
      <p ref={textRef} className="text-sm text-foreground leading-7 pr-16 whitespace-pre-line">
        {children}
      </p>
      <Link
        href={ctaHref}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#2F766D] hover:text-[#246059] hover:underline transition-colors"
      >
        Send this as a beautiful digital invite →
      </Link>
    </div>
  )
}
