'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

// Before paint on the client; the server never runs either.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Designs a visitor has saved for later (the heart on a template card), newest
 * first. Kept on this device only, like lib/recentDesigns: nothing is sent or
 * stored on the server, so it needs no account and no database. Every open
 * card and list stays in step through a window event.
 *
 * If saved designs should follow a signed-in host across devices, the smallest
 * step is a SavedDesign (userId, templateId, createdAt) table that this file
 * merges with on sign-in; nothing here would need to change for visitors.
 */
const KEY = 'si-saved-designs'
const MAX = 30
const EVENT = 'si-saved-designs'

export function savedDesigns(): string[] {
  try {
    const v: unknown = JSON.parse(window.localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Saves or un-saves a design; returns whether it is now saved. */
export function toggleSaved(id: string): boolean {
  const list = savedDesigns()
  const on = !list.includes(id)
  const next = on ? [id, ...list].slice(0, MAX) : list.filter((x) => x !== id)
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* private mode: the heart still toggles for this page */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }))
  return on
}

/** The saved ids, kept current across every component and other tabs. */
export function useSavedDesigns(): string[] {
  const [ids, setIds] = useState<string[]>([])
  // Read before the first paint, so hearts and the returning shelf (whose size depends on it) never jump.
  useIsoLayoutEffect(() => setIds(savedDesigns()), [])
  useEffect(() => {
    const onChange = (e: Event) => setIds((e as CustomEvent<string[]>).detail ?? savedDesigns())
    const onStorage = (e: StorageEvent) => e.key === KEY && setIds(savedDesigns())
    window.addEventListener(EVENT, onChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT, onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return ids
}
