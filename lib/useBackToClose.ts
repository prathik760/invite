'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * While an overlay is open, the phone's Back button closes it instead of
 * leaving the page — on a full-screen preview, Back used to take visitors
 * straight off the site.
 *
 * Opening pushes one history entry for the same URL (a copy of the current
 * state, so Next's router treats going back to it as staying put); Back pops
 * it and the overlay closes. Closing any other way removes the entry again.
 * Before navigating to another page from inside the overlay, call `release()`
 * (and navigate with `replace`) so the entry isn't popped mid-navigation.
 */
export function useBackToClose(open: boolean, onClose: () => void) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const leaving = useRef(false)
  const markerRef = useRef<string | null>(null)
  const pendingBack = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return
    leaving.current = false
    // React may unmount and remount an effect at once (Strict Mode in
    // development). The removal is deferred, so a remount keeps the entry.
    if (pendingBack.current !== null) {
      window.clearTimeout(pendingBack.current)
      pendingBack.current = null
    }
    let marker = markerRef.current
    if (!marker || window.history.state?.__siOverlay !== marker) {
      marker = Math.random().toString(36).slice(2)
      markerRef.current = marker
      window.history.pushState({ ...window.history.state, __siOverlay: marker }, '')
    }
    const own = marker
    let popped = false
    const onPop = () => {
      if (window.history.state?.__siOverlay === own) return
      popped = true
      markerRef.current = null
      closeRef.current()
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      if (popped || leaving.current) {
        markerRef.current = null
        return
      }
      pendingBack.current = window.setTimeout(() => {
        pendingBack.current = null
        markerRef.current = null
        if (window.history.state?.__siOverlay === own) window.history.back()
      }, 0)
    }
  }, [open])

  return useCallback(() => {
    leaving.current = true
  }, [])
}
