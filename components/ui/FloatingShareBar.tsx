'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareBar from './ShareBar'

interface FloatingShareBarProps {
  url: string
  names?: string
}

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function FloatingShareBar({ url, names }: FloatingShareBarProps) {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.55, ease: BEZIER }}
          className="fixed bottom-0 inset-x-0 z-50 px-4 pb-5 sm:px-6 pointer-events-none"
        >
          <div
            className="max-w-lg mx-auto rounded-2xl overflow-hidden pointer-events-auto"
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid rgba(232,220,205,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 -4px 44px rgba(34,27,23,0.14), 0 1px 0 rgba(255,255,255,0.8) inset',
            }}
          >
            <AnimatePresence mode="wait">
              {!open ? (
                <motion.button
                  key="trigger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(true)}
                  className="group flex w-full items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full text-lg select-none" style={{ color: '#B87924', background: 'rgba(217,164,65,0.13)' }} aria-hidden>♥</span>
                    <span
                      className="font-body text-sm"
                      style={{ color: 'rgba(44,32,28,0.72)', letterSpacing: '0.02em' }}
                    >
                      Share this invitation
                    </span>
                  </div>
                  <span
                    className="font-body text-xs transition-colors"
                    style={{ color: 'rgba(184,121,36,0.84)', letterSpacing: '0.08em' }}
                  >
                    Open
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: BEZIER }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pt-4 pb-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p
                          className="font-body text-xs mb-0.5"
                          style={{ color: 'rgba(184,121,36,0.86)', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                        >
                          Share Invitation
                        </p>
                        {names && (
                          <p className="font-heading text-sm" style={{ color: '#2C201C' }}>
                            {names}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setOpen(false)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(44,32,28,0.06)', color: 'rgba(44,32,28,0.48)' }}
                        aria-label="Close"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* URL pill */}
                    <div
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-4 overflow-hidden"
                      style={{ background: 'rgba(44,32,28,0.04)', border: '1px solid rgba(44,32,28,0.07)' }}
                    >
                      <span
                        className="font-body text-xs truncate flex-1"
                        style={{ color: 'rgba(44,32,28,0.42)', letterSpacing: '0.01em' }}
                      >
                        {url}
                      </span>
                    </div>

                    <ShareBar url={url} names={names} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
