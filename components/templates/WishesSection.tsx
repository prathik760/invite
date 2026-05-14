'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WishRecord } from '@/types'

interface WishesSectionProps {
  eventId: string
}

const BEZIER = [0.22, 1, 0.36, 1] as [number, number, number, number]
const MAX_MESSAGE = 320

function HeartBurst() {
  const hearts = ['♥', '♡', '♥', '♡', '♥']
  return (
    <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.6],
            x: [0, Math.cos((i / hearts.length) * 2 * Math.PI) * 32],
            y: [0, Math.sin((i / hearts.length) * 2 * Math.PI) * 32],
          }}
          transition={{ duration: 0.9, delay: i * 0.08, ease: BEZIER }}
          className="absolute text-sm select-none"
          style={{ color: `rgba(184,121,36,${0.28 + i * 0.1})` }}
          aria-hidden
        >
          {h}
        </motion.span>
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.15, ease: BEZIER }}
        className="text-3xl sm:text-4xl md:text-5xl select-none z-10"
        style={{ color: '#B87924' }}
        aria-hidden
      >
        ♥
      </motion.div>
    </div>
  )
}

const PREVIEW_WISHES: WishRecord[] = [
  { id: '1', name: 'Anjali & Vikram', message: 'Wishing you a lifetime of love, joy, and beautiful memories together! May your journey be filled with endless happiness.' },
  { id: '2', name: 'The Mehta Family', message: 'May your love story be the most beautiful one ever written. Congratulations on your special day!' },
]

export default function WishesSection({ eventId }: WishesSectionProps) {
  const isPreviewMode = eventId === '__preview__'
  const [wishes, setWishes] = useState<WishRecord[]>(isPreviewMode ? PREVIEW_WISHES : [])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isPreviewMode) return
    fetch(`/api/wishes?eventId=${eventId}`)
      .then((r) => r.json())
      .then((data) => setWishes(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [eventId, isPreviewMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    if (isPreviewMode) { setSubmitted(true); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      setName('')
      setMessage('')
    } catch {
      setError('Could not send your wish. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const charsLeft = MAX_MESSAGE - message.length
  const nearLimit = charsLeft <= 40

  return (
    <section className={`px-4 sm:px-6 md:px-8 ${isPreviewMode ? 'py-8 sm:py-10' : 'py-28'}`} style={{ background: '#FBF7F1' }}>
      <div className="max-w-xl mx-auto">

        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: BEZIER }}
          className="text-center mb-14"
        >
          <p
            className="font-body mb-4"
            style={{ fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B87924' }}
          >
            Leave a Message
          </p>
          <h2
            className="font-heading text-[2.4rem] sm:text-[3rem] leading-tight mb-6"
            style={{ color: '#221B17' }}
          >
            Heartfelt Wishes
          </h2>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(184,121,36,0.38))' }} />
            <span style={{ color: 'rgba(184,121,36,0.58)', fontSize: '12px' }}>✦</span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(270deg, transparent, rgba(184,121,36,0.38))' }} />
          </div>
        </motion.div>

        {/* ── Wish form ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, delay: 0.1, ease: BEZIER }}
          className="mb-14 rounded-lg sm:rounded-2xl p-5 sm:p-7 sm:p-6 sm:p-9"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8DCCD',
            boxShadow: '0 10px 34px rgba(60,36,20,0.08)',
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: BEZIER }}
                className="text-center py-8"
              >
                <HeartBurst />

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: BEZIER }}
                  className="font-heading text-2xl mb-3"
                  style={{ color: '#221B17' }}
                >
                  Thank You
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="font-body mb-7"
                  style={{ color: 'rgba(44,32,28,0.52)', fontSize: '13.5px', lineHeight: '1.85' }}
                >
                  Your wish has been received with love.<br />
                  It will appear here once approved.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.75 }}
                  onClick={() => setSubmitted(false)}
                  className="font-body transition-colors text-sm"
                  style={{ color: 'rgba(184,121,36,0.78)', letterSpacing: '0.04em' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#B87924')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(184,121,36,0.78)')}
                >
                  Send another wish →
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {/* Name input */}
                <div>
                  <label
                    className="block font-body mb-2"
                    style={{ fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(44,32,28,0.42)' }}
                  >
                    Your Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anjali & Rahul"
                    required
                    className="w-full bg-transparent border-0 border-b py-3 text-sm font-body focus:outline-none transition-all"
                    style={{
                      color: '#2C201C',
                      borderBottomColor: 'rgba(44,32,28,0.12)',
                      borderBottomWidth: '1px',
                      borderBottomStyle: 'solid',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(184,121,36,0.58)')}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(44,32,28,0.12)')}
                  />
                </div>

                {/* Message input */}
                <div>
                  <label
                    className="block font-body mb-2"
                    style={{ fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(44,32,28,0.42)' }}
                  >
                    Your Wish
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                    placeholder="Write something from the heart…"
                    required
                    rows={4}
                    className="w-full bg-transparent border-0 border-b py-3 text-sm font-body focus:outline-none transition-all resize-none"
                    style={{
                      color: '#2C201C',
                      borderBottomColor: 'rgba(44,32,28,0.12)',
                      borderBottomWidth: '1px',
                      borderBottomStyle: 'solid',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(184,121,36,0.58)')}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(44,32,28,0.12)')}
                  />
                  <div className="flex justify-end mt-1.5">
                    <span
                      className="font-body text-[10px] tabular-nums transition-colors"
                      style={{ color: nearLimit ? '#B87924' : 'rgba(44,32,28,0.28)' }}
                    >
                      {charsLeft} left
                    </span>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-body"
                    style={{ color: '#B96B70', fontSize: '12px' }}
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="w-full py-3.5 rounded-xl text-sm font-medium font-body transition-all disabled:opacity-60 relative overflow-hidden"
                  style={{
                    background: 'rgba(217,164,65,0.12)',
                    border: '1px solid rgba(184,121,36,0.32)',
                    color: '#2C201C',
                    letterSpacing: '0.06em',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center justify-center gap-2"
                      >
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending with love…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Send Wish ♥
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Approved wishes ── */}
        {wishes.length > 0 && (
          <div className="space-y-4">
            {wishes.map((wish, i) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: BEZIER }}
                className="relative rounded-lg sm:rounded-2xl px-7 py-7 overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8DCCD',
                  boxShadow: '0 10px 34px rgba(60,36,20,0.08)',
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 inset-x-0 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 15%, rgba(184,121,36,0.34) 50%, transparent 85%)',
                  }}
                />

                {/* Bottom blush glow */}
                <div
                  className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(217,164,65,0.05), transparent)' }}
                />

                {/* Decorative quote */}
                <div
                  className="font-heading leading-none select-none mb-2"
                  style={{ fontSize: '4rem', lineHeight: 1, marginTop: '-0.4rem', color: 'rgba(184,121,36,0.16)' }}
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* Message */}
                <p
                  className="font-body italic leading-relaxed mb-6"
                  style={{ color: 'rgba(44,32,28,0.64)', fontSize: '14.5px', lineHeight: '1.85' }}
                >
                  {wish.message}
                </p>

                {/* Author row */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(217,164,65,0.14)',
                      border: '1px solid rgba(184,121,36,0.24)',
                    }}
                  >
                    <span
                      className="font-body select-none"
                      style={{ fontSize: '10px', color: '#B87924' }}
                    >
                      {wish.name.trim().charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <p
                    className="font-body"
                    style={{ color: 'rgba(184,121,36,0.9)', fontSize: '12px', letterSpacing: '0.07em' }}
                  >
                    {wish.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
