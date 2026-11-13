import type { KeyboardEvent } from 'react'

/**
 * Arrow keys, Home and End for a role="tablist": moves to the next tab and
 * focuses it, as the ARIA tabs pattern expects. Works across and down.
 */
export function tabKeys(count: number, current: number, go: (i: number) => void, idOf: (i: number) => string) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key]
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? count - 1 : step === undefined ? -1 : (current + step + count) % count
    if (next < 0) return
    e.preventDefault()
    go(next)
    document.getElementById(idOf(next))?.focus()
  }
}
