'use client'

import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import { seoEvents, trackEvent } from '@/lib/analytics'
import { templatePrice } from '@/lib/plans'
import { Price } from '@/components/price/Price'
import { useWordingDesigns } from '@/components/wording/WordingDesigns'

/** The builder pre-fills its message field from `message`; longer text is cut. */
export const MESSAGE_LIMIT = 600

/**
 * Builder link that carries the copied words. Cut by code point, not UTF-16
 * unit: slicing through an emoji leaves a lone surrogate, which makes
 * encodeURIComponent throw.
 *
 * `src` becomes the `source` of the builder's create_start event, so each
 * placement (this panel, the card's own "Send as an invitation") can be told
 * apart in the funnel.
 */
export function builderHref(templateId: string, text: string, src = 'wording_copy'): string {
  const message = Array.from(text.trim()).slice(0, MESSAGE_LIMIT).join('')
  return `/create?template=${encodeURIComponent(templateId)}&message=${encodeURIComponent(message)}&src=${encodeURIComponent(src)}`
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

/**
 * `method`: "button" for the Copy button, "select" for words the reader selected
 * and copied themselves (a long press on a phone). Most copy that way, and
 * before 14 Nov 2026 none of them were counted or shown the panel below.
 */
export function trackWordingCopy(templateId: string, method: 'button' | 'select' = 'button') {
  trackEvent(seoEvents.wordingCopy, { page_path: window.location.pathname, template_id: templateId, method })
}

/** Fewer characters than this selected is a name or a date being copied, not a message. */
export const MIN_SELECTED_MESSAGE = 24

/**
 * The words of a copy the reader made themselves inside `el`, or null when the
 * selection is too short to be a message or lies outside it.
 */
export function selectedMessage(el: HTMLElement | null): string | null {
  const selection = window.getSelection()
  if (!el || !selection || selection.isCollapsed || !el.contains(selection.anchorNode)) return null
  const text = selection.toString().trim()
  return text.length >= MIN_SELECTED_MESSAGE ? text : null
}

/**
 * Shown under a wording sample once it has been copied.
 *
 * On a guide wrapped in <WordingDesigns> (birthday, wedding) it shows the
 * section's design and two others that suit the same words, each opening the
 * builder with the message already in it: the reader sees what the words look
 * like as an invitation, and picks. Elsewhere (other guides, blog posts) it
 * offers the one design.
 */
export default function CopiedPanel({ templateId, text }: { templateId: string; text: string }) {
  const designs = useWordingDesigns(templateId)
  const price = templatePrice(templateId)
  // `!` on link colours because blog posts render this inside .prose-brand, whose
  // unlayered link colour would otherwise beat the button's.
  const button = (
    <TrackedLink
      href={builderHref(templateId, text)}
      // The message rides in the address: not a page for search engines to follow (app/create is noindex).
      rel="nofollow"
      prefetch={false}
      location="wording_copy_panel"
      meta={{ template_id: templateId, location: 'wording_copy_panel' }}
      className="btn-primary inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-[0.85rem] font-semibold !text-paper !no-underline"
    >
      {designs.length > 1 ? `Use these words in ${designs[0].name} →` : 'Use these words →'}
    </TrackedLink>
  )

  if (designs.length > 1) {
    return (
      <div role="status" className="mt-2.5 rounded-2xl border border-emerald-soft/25 bg-peach/60 px-4 py-4 sm:px-5">
        <p className="text-[0.92rem] font-semibold leading-6 text-charcoal">
          Copied <span aria-hidden>✓</span>. Now see your words as an invitation
        </p>
        <p className="mt-0.5 text-[0.78rem] leading-5 text-muted">
          Tap a design to see your message in it. Preview free, pay only when you publish.
        </p>
        <ul className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-[repeat(3,minmax(0,8.5rem))] sm:gap-3.5">
          {designs.map((d, i) => (
            <li key={d.id} className="min-w-0">
              <TrackedLink
                href={builderHref(d.id, text, 'wording_copy_design')}
                rel="nofollow"
                prefetch={false}
                location="wording_copy_design"
                meta={{ template_id: d.id, position: i + 1, price: d.price }}
                className="group block !no-underline"
              >
                <span className="relative block aspect-[4/5] overflow-hidden rounded-xl border border-line bg-paper shadow-soft">
                  <Image
                    src={d.image}
                    alt={`${d.name} invitation design`}
                    fill
                    sizes="(max-width: 640px) 30vw, 136px"
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-1.5 block truncate text-[0.8rem] font-semibold leading-5 !text-charcoal">{d.name}</span>
                <span className="block text-[0.74rem] leading-4 !text-muted">
                  <Price inr={d.price} />
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>
        <div className="mt-3.5 flex [&>a]:w-full sm:[&>a]:w-auto">{button}</div>
      </div>
    )
  }

  return (
    <div
      role="status"
      className="mt-2.5 flex flex-col gap-3 rounded-2xl border border-emerald-soft/25 bg-peach/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-[0.92rem] font-semibold leading-6 text-charcoal">
          Copied <span aria-hidden>✓</span>. Or send these words as an animated invitation
        </p>
        <p className="mt-0.5 text-[0.78rem] leading-5 text-muted">
          Build and preview before you pay · <Price inr={price} /> once to publish
        </p>
      </div>
      {button}
    </div>
  )
}
