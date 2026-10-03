'use client'

import { useEffect, type RefObject } from 'react'
import { FIELD_POSITION } from '@/lib/fieldOrder'

/**
 * Keeps a live preview on the part of the design being edited.
 *
 * When the host moves to another input box, each preview scrolls to where that
 * field shows on the invitation: to its own words when they can be found on
 * the page (what was typed, or the design's sample text), otherwise to the
 * position measured for it in lib/fieldOrder.ts — dates, times and photos are
 * rendered in ways their raw value cannot be matched against.
 */
export function usePreviewFollow(
  boxes: RefObject<HTMLElement | null>[],
  templateId: string,
  fieldKey: string | null,
  values: Record<string, string>,
  /** Changes when a preview appears (the full-screen one), so it starts in the right place too. */
  refresh?: unknown,
) {
  useEffect(() => {
    if (!fieldKey) return
    const raw = (values[fieldKey] ?? '').split('\n')[0].split('|')[0].trim()
    const words = /^https?:|^\/|^\d{4}-\d{2}-\d{2}$|^\d{1,2}:\d{2}$/.test(raw) || raw.length < 2 ? '' : raw.slice(0, 40).toLowerCase()
    const t = window.setTimeout(() => {
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
        }
        if (y !== null) box.scrollTo({ top: Math.max(0, y - box.clientHeight * 0.28), behavior: 'smooth' })
      }
    }, 60)
    return () => window.clearTimeout(t)
    // Follows the box in use, not every keystroke typed into it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldKey, templateId, refresh])
}
