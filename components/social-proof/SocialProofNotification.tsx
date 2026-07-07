'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  getRandomNotification,
  type SocialProofNotification,
} from '@/utils/getRandomNotification'

// Routes on which the notification must NOT appear
const EXCLUDED_PREFIXES = [
  '/dashboard',
  '/create',
  '/editor',
  '/login',
  '/signup',
  '/admin',
  '/checkout',
  '/auth',
]

const SHOW_DURATION   = 5500   // ms the toast stays visible
const RESUME_DELAY    = 2000   // ms after hover-out before auto-hide fires
const CYCLE_GAP_MIN   = 8000   // min ms between notifications
const CYCLE_GAP_MAX   = 12000  // max ms between notifications
const INITIAL_DELAY   = 3500   // ms after mount before first notification

export default function SocialProofNotification() {
  const pathname = usePathname()
  const [toast, setToast]       = useState<SocialProofNotification | null>(null)
  const [visible, setVisible]   = useState(false)
  const [noAnim, setNoAnim]     = useState(false)

  const hideTimerRef  = useRef<ReturnType<typeof setTimeout>>()
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const lastNameRef   = useRef<string>()

  // Detect prefers-reduced-motion once on mount
  useEffect(() => {
    setNoAnim(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const isExcluded = EXCLUDED_PREFIXES.some(p => pathname?.startsWith(p))

  // scheduleHide and showToast reference each other; function declarations
  // are hoisted within the same block scope so this is safe.
  function scheduleHide(delay: number) {
    clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setVisible(false)
      // Wait for the out-animation to finish, then schedule next notification
      const gap = CYCLE_GAP_MIN + Math.random() * (CYCLE_GAP_MAX - CYCLE_GAP_MIN)
      cycleTimerRef.current = setTimeout(showToast, 400 + gap)
    }, delay)
  }

  function showToast() {
    const next = getRandomNotification(lastNameRef.current)
    lastNameRef.current = next.name
    setToast(next)
    setVisible(true)
    scheduleHide(SHOW_DURATION)
  }

  useEffect(() => {
    if (isExcluded) return

    const init = setTimeout(showToast, INITIAL_DELAY)

    return () => {
      clearTimeout(init)
      clearTimeout(hideTimerRef.current)
      clearTimeout(cycleTimerRef.current)
    }
  }, [isExcluded]) // eslint-disable-line react-hooks/exhaustive-deps

  // Don't render anything when excluded or before first notification is ready
  if (isExcluded || !toast) return null

  return (
    <div
      // Outer wrapper: fixed position + animation state
      // pointer-events-none so the invisible card never blocks page clicks
      aria-live="polite"
      aria-atomic="true"
      role="status"
      className="pointer-events-none fixed bottom-5 left-4 z-50 w-72 sm:w-80"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: noAnim
          ? 'none'
          : 'opacity 0.32s ease, transform 0.32s ease',
      }}
    >
      {/* Inner card: pointer-events only when visible */}
      <div
        className="flex items-start gap-3 rounded-2xl p-3.5"
        style={{
          pointerEvents: visible ? 'auto' : 'none',
          cursor: 'default',
          background: 'rgba(255, 255, 255, 0.97)',
          border: '1px solid rgba(184,121,36,0.20)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        onMouseEnter={() => clearTimeout(hideTimerRef.current)}
        onMouseLeave={() => scheduleHide(RESUME_DELAY)}
      >
        {/* ── Avatar with verified badge ── */}
        <div className="relative mt-0.5 shrink-0">
          <div
            className="flex h-9 w-9 select-none items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: toast.avatarColor }}
            aria-hidden="true"
          >
            {toast.initials}
          </div>
          {/* Green verified check */}
          <div
            className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white shadow-sm"
            aria-hidden="true"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#2F766D">
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* ── Message + footer ── */}
        <div className="min-w-0 flex-1">
          <p
            className="text-[12px] font-medium leading-snug"
            style={{ color: '#221B17' }}
          >
            {toast.message}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {/* Brand mark */}
            <span
              className="flex items-center gap-1 text-[10px] font-semibold"
              style={{ color: '#B87924' }}
            >
              <svg
                className="h-2.5 w-2.5 shrink-0"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="6" cy="6" r="5.5" stroke="#B87924" strokeWidth="1" fill="rgba(184,121,36,0.12)" />
                <path
                  d="M3.5 6.25l1.75 1.75 3.25-3.5"
                  stroke="#B87924"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ShareInvite
            </span>
            {/* Relative timestamp */}
            <span
              className="shrink-0 text-[10px]"
              style={{ color: '#9B8A7A' }}
            >
              {toast.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
