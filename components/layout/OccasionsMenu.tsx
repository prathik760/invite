'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDownIcon } from '@/components/ui/Icons'

/**
 * The navbar's Occasions menu. Opens on click or tap, on hover with a mouse, and stays open
 * while it holds keyboard focus; Escape, a click outside or moving focus away closes it.
 *
 * The panel (server-rendered links passed as children) is always in the HTML, only hidden from
 * view when closed, so crawlers still read every occasion link from the navbar.
 */
export default function OccasionsMenu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement | null>(null)
  const button = useRef<HTMLButtonElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  // A mouse opens it on hover, with a short grace period so crossing the gap does not close it.
  const hover = (next: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(next), next ? 60 : 160)
  }

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="nav-occasions"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-[0.95rem] font-semibold text-charcoal transition-colors hover:bg-peach ${open ? 'bg-peach' : ''}`}
      >
        {label}
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        id="nav-occasions"
        className={`absolute left-0 top-full pt-2 transition-[opacity,visibility] duration-150 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}
      >
        {children}
      </div>
    </div>
  )
}
