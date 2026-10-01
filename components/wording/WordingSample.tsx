'use client'

import { useRef, useState } from 'react'
import CopiedPanel, { copyText, trackWordingCopy } from '@/components/wording/CopiedPanel'

interface WordingSampleProps {
  title: React.ReactNode
  /** Design the copied words are offered in (e.g. `indian-engagement`). */
  templateId: string
  tag?: string
  /** One <p> per line of the wording. */
  children: React.ReactNode
}

/** A titled wording sample, one line per paragraph, with one-tap copy. */
export default function WordingSample({ title, templateId, tag, children }: WordingSampleProps) {
  const linesRef = useRef<HTMLQuoteElement>(null)
  const [copied, setCopied] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  async function handleCopy() {
    const el = linesRef.current
    if (!el) return
    // Join the lines ourselves: innerText puts a blank line after every <p>.
    const lines = Array.from(el.querySelectorAll('p'), (p) => p.innerText.trim())
    const text = lines.length ? lines.join('\n') : el.innerText.trim()
    const ok = await copyText(text, el)
    if (!ok) return
    setCopied(true)
    setCopiedText(text)
    trackWordingCopy(templateId)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div>
      <figure className="relative rounded-3xl border border-line bg-paper p-6 shadow-soft sm:p-7">
        <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-20">
          <h3 className="font-editorial text-[1.3rem] font-semibold leading-snug text-charcoal">{title}</h3>
          {tag && <span className="pill py-0.5 text-[0.72rem] text-burnished-deep">{tag}</span>}
        </figcaption>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy this wording'}
          className={`absolute right-3.5 top-3.5 rounded-full px-4 py-2.5 text-[0.72rem] font-semibold transition-colors ${
            copied ? 'bg-emerald text-paper' : 'border border-line bg-champagne text-charcoal hover:border-burnished'
          }`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <blockquote
          ref={linesRef}
          className="mt-4 border-l-2 border-burnished/60 pl-5 font-editorial text-[1.12rem] leading-[1.75] text-charcoal/80"
        >
          {children}
        </blockquote>
      </figure>
      {copiedText && <CopiedPanel templateId={templateId} text={copiedText} />}
    </div>
  )
}
