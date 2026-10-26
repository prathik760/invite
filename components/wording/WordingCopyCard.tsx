'use client'

import { useRef, useState } from 'react'
import Link from '@/components/ui/Link'
import CopiedPanel, { builderHref, copyText, trackWordingCopy } from '@/components/wording/CopiedPanel'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { trackCta } from '@/lib/analytics'

interface WordingCopyCardProps {
  children: React.ReactNode
  /** Design the copied words are offered in (e.g. `indian-birthday`). */
  templateId: string
  ctaHref?: string
}

/** Placement of the card's own builder link: its cta_location, and its `src` in the builder. */
const SEND_LOCATION = 'wording_card_send'

/** A wording sample as a quote card, with one-tap copy and a way to send it as an invitation. */
export default function WordingCopyCard({ children, templateId, ctaHref }: WordingCopyCardProps) {
  // Straight into the builder, in this section's design, with these words in
  // it. It used to go to the occasion's landing page, whose button opened that
  // page's own design: a parent reading first-birthday wording ended up in an
  // adult party design.
  const href =
    typeof children === 'string' ? builderHref(templateId, children, SEND_LOCATION) : ctaHref ?? `/create?template=${encodeURIComponent(templateId)}`
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
      <figure className="relative rounded-3xl border border-line bg-paper p-6 pl-7 shadow-soft sm:p-7 sm:pl-8">
        <span aria-hidden className="absolute inset-y-6 left-0 w-1 rounded-r-full bg-gradient-to-b from-gold-soft to-burnished" />
        <p ref={textRef} className="whitespace-pre-line font-editorial text-[1.22rem] leading-[1.6] text-charcoal">
          {children}
        </p>
        {/* Copy, and right beside it the same words as an invitation. Under
            the message rather than over its corner: the words get the card's
            full width on a phone, and the panel that opens after a copy sits
            directly below the button that was tapped. */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy this wording'}
            className={`rounded-full border px-5 py-2.5 text-[0.8rem] font-semibold transition-colors ${
              copied ? 'border-emerald bg-emerald text-paper' : 'border-line bg-champagne text-charcoal hover:border-burnished'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          {/* Hidden once copied: the panel below then makes the same offer. */}
          {!copiedText && (
            // nofollow: hundreds of these builder URLs (one per message, each
            // canonical to /create) would otherwise take Google's crawl visits
            // away from the pages it should be indexing. No prefetch, for the
            // same reason: a long guide has dozens of these on screen.
            // `!` because blog posts render this card inside .prose-brand,
            // whose unlayered link styles would otherwise win.
            <Link
              href={href}
              rel="nofollow"
              prefetch={false}
              onClick={() =>
                trackCta('Send as an invitation', SEND_LOCATION, {
                  template_id: templateId,
                  destination: `/create?template=${templateId}`,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-soft/30 bg-peach/70 px-4 py-2.5 text-[0.8rem] font-semibold !text-emerald-soft !no-underline transition-colors hover:border-emerald-soft hover:bg-peach"
            >
              Send as an invitation
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </figure>
      {copiedText && <CopiedPanel templateId={templateId} text={copiedText} />}
    </div>
  )
}
