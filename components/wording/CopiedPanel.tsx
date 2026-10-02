'use client'

import TrackedLink from '@/components/ui/TrackedLink'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { templatePrice } from '@/lib/plans'
import { Price } from '@/components/price/Price'

/** The builder pre-fills its message field from `message`; longer text is cut. */
export const MESSAGE_LIMIT = 600

/**
 * Builder link that carries the copied words. Cut by code point, not UTF-16
 * unit: slicing through an emoji leaves a lone surrogate, which makes
 * encodeURIComponent throw.
 */
export function builderHref(templateId: string, text: string): string {
  const message = Array.from(text.trim()).slice(0, MESSAGE_LIMIT).join('')
  return `/create?template=${encodeURIComponent(templateId)}&message=${encodeURIComponent(message)}&src=wording_copy`
}

/**
 * Copy text to the clipboard. Resolves true only when the copy really happened,
 * so the panel never claims "Copied" after a silent failure.
 */
export async function copyText(text: string, fallbackEl: HTMLElement | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Insecure context or a browser without the async clipboard API.
    if (!fallbackEl) return false
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(fallbackEl)
    selection?.removeAllRanges()
    selection?.addRange(range)
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    selection?.removeAllRanges()
    return ok
  }
}

export function trackWordingCopy(templateId: string) {
  trackEvent(seoEvents.wordingCopy, { page_path: window.location.pathname, template_id: templateId })
}

/** Shown under a wording sample once it has been copied. */
export default function CopiedPanel({ templateId, text }: { templateId: string; text: string }) {
  const price = templatePrice(templateId)
  return (
    <div
      role="status"
      className="mt-2.5 flex flex-col gap-3 rounded-2xl border border-emerald-soft/25 bg-peach/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-[0.92rem] font-semibold leading-6 text-charcoal">
          Copied <span aria-hidden>✓</span> — or send these words as an animated invitation
        </p>
        <p className="mt-0.5 text-[0.78rem] leading-5 text-muted">
          Build and preview before you pay · <Price inr={price} /> once to publish
        </p>
      </div>
      {/* `!` because blog posts render this inside .prose-brand, whose
          unlayered link colour would otherwise beat the button's. */}
      <TrackedLink
        href={builderHref(templateId, text)}
        location="wording_copy_panel"
        meta={{ template_id: templateId, location: 'wording_copy_panel' }}
        className="btn-primary inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-[0.85rem] font-semibold !text-paper !no-underline"
      >
        Use these words →
      </TrackedLink>
    </div>
  )
}
