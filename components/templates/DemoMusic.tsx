'use client'

import { useEffect } from 'react'

/**
 * Live demos only (/demo/<id> and the embed the live preview frames): the
 * visitor's first tap anywhere starts the design's song, so they hear that
 * music is part of the invitation without having to find the button.
 * Browsers allow sound only after a tap, so nothing plays before one.
 *
 * It presses the design's own "Play music" button, so the button's label stays
 * true. Designs with an opening (doors, a seal, an envelope) already start
 * their song on that tap and show the button only after it; then something is
 * already playing, or there is no button yet, and this does nothing. Taps on
 * links are skipped, and a first tap on the music button is left to the
 * button. Once only: a visitor who pauses is never overruled. Real invitations
 * are untouched.
 */
export default function DemoMusic() {
  useEffect(() => {
    const stop = () => document.removeEventListener('click', onClick, true)
    function onClick(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target : null
      // A link leads somewhere else (the banner's "Customize", directions): wait for a tap on the design.
      if (target?.closest('a[href]')) return
      stop()
      if (target?.closest('button[aria-label$="music"]')) return
      // After the tap's own handlers: an opening may have started the song already.
      window.setTimeout(() => {
        if (Array.from(document.querySelectorAll('audio')).some((a) => !a.paused)) return
        document.querySelector<HTMLButtonElement>('button[aria-label="Play music"]')?.click()
      }, 0)
    }
    document.addEventListener('click', onClick, true)
    return stop
  }, [])
  return null
}
