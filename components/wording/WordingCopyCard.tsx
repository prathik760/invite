'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import CopiedPanel, { builderHref, copyText, trackWordingCopy } from '@/components/wording/CopiedPanel'

interface WordingCopyCardProps {
  children: React.ReactNode
  /** Design the copied words are offered in (e.g. `indian-birthday`). */
  templateId: string
  ctaHref?: string
}

/** A wording sample as a quote card, with one-tap copy. */
export default function WordingCopyCard({ children, templateId, ctaHref }: WordingCopyCardProps) {
  // Straight into the builder, in this section's design, with these words in
  // it. It used to go to the occasion's landing page, whose button opened that
  // page's own design — a parent reading first-birthday wording ended up in an
  // adult party design.
  const href = typeof children === 'string' ? builderHref(templateId, children) : ctaHref ?? `/create?template=${encodeURIComponent(templateId)}`
  const textRef = useRef<HTMLParagraphElement>(null)
  const [copied, setCopied] = useState(false)
  // Kept after the button resets, so the panel stays put while they decide.
  const [copiedText, setCopiedText] = useState<string | null>(null)

  async function handleCopy() {
    const text = textRef.current?.innerText.trim() ?? ''
    if (!text) return
    const ok = await copyText(text, textRef.current)
    if (!ok) return
    setCopied(true)
    setCopiedText(text)
    trackWordingCopy(templateId)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="my-5">
      <figure className="group relative rounded-3xl border border-line bg-paper p-6 pl-7 shadow-soft sm:p-7 sm:pl-8">
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
        {!copiedText && (
          <figcaption className="mt-4">
            <Link href={href} className="link inline-flex items-center gap-1 text-[0.85rem]">
              Use these words in a beautiful design →
            </Link>
          </figcaption>
        )}
      </figure>
      {copiedText && <CopiedPanel templateId={templateId} text={copiedText} />}
    </div>
  )
}
