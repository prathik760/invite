'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { FIELD_POSITION } from '@/lib/fieldOrder'

/**
 * Keeps a live preview on the part of the design being edited.
 *
 * When the host moves to another input box, each preview scrolls to where that
 * field shows on the invitation: to its own words when they can be found on
 * the page (what was typed, or the design's sample text), otherwise to the
 * position measured for it in lib/fieldOrder.ts — dates, times and photos are
 * rendered in ways their raw value cannot be matched against.
 *
 * It looks again a moment later, for what appears only after the box is used
 * (a design's opening passed while it is edited, kit/ui useOpenWhileEditing),
 * and again when the host pauses typing, so a box that was empty when they
 * started ends up on the words they typed. A preview already showing the part
 * is left still, so it does not jump while they type.
 */
export function usePreviewFollow(
  boxes: RefObject<HTMLElement | null>[],
  templateId: string,
  fieldKey: string | null,
  values: Record<string, string>,
  /** Changes when a preview appears (the full-screen one), so it starts in the right place too. */
  refresh?: unknown,
) {
  const value = fieldKey ? values[fieldKey] ?? '' : ''
  const placed = useRef('')

  useEffect(() => {
    if (!fieldKey) return
    const where = `${templateId}|${fieldKey}|${String(refresh)}`
    const moved = placed.current !== where
    placed.current = where
    const raw = value.split('\n')[0].split('|')[0].trim()
    const words = /^https?:|^\/|^\d{4}-\d{2}-\d{2}$|^\d{1,2}:\d{2}$/.test(raw) || raw.length < 2 ? '' : raw.slice(0, 40).toLowerCase()

    const follow = () => {
      for (const ref of boxes) {
        const box = ref.current
        if (!box || box.clientHeight === 0) continue
        const top = box.getBoundingClientRect().top
        let y: number | null = null
        if (words) {
          const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT)
          while (walker.nextNode()) {
            const node = walker.currentNode
            if (!node.nodeValue?.toLowerCase().includes(words)) continue
            const r = node.parentElement?.getBoundingClientRect()
            if (r && (r.width > 0 || r.height > 0)) { y = r.top - top + box.scrollTop; break }
          }
        }
        if (y === null) {
          const f = FIELD_POSITION[templateId]?.[fieldKey]
          if (f !== undefined) y = f * box.scrollHeight
          // How the invitation opens, and its colours, show best at its very top.
          else if (fieldKey === 'introStyle' || (fieldKey === 'palette' && templateId === 'signature-royal-edit')) y = 0
        }
        if (y === null) continue
        // Already in view, in the upper two thirds: leave it still.
        const seen = y - box.scrollTop
        if (seen > box.clientHeight * 0.06 && seen < box.clientHeight * 0.7) continue
        box.scrollTo({ top: Math.max(0, y - box.clientHeight * 0.28), behavior: 'smooth' })
      }
    }

    // A new box: at once, and again once anything it reveals has drawn. More typing: after a pause.
    const timers = moved ? [window.setTimeout(follow, 60), window.setTimeout(follow, 550)] : [window.setTimeout(follow, 450)]
    return () => timers.forEach((t) => window.clearTimeout(t))
    // `boxes` are refs, read when the timers fire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldKey, templateId, refresh, value])
}
