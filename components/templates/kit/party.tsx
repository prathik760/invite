'use client'

import { useState } from 'react'
import { dateParts } from './core'

/*
 * Shared by the adult birthday designs (Mirrorball, Dirty Martini, Champagne,
 * Long Lunch): the age as an ordinal, and an RSVP a guest can actually send.
 *
 * There is no headcount on the server, so an RSVP here is a message to the
 * host — the guest picks "coming" or "can't make it", then WhatsApp, a text or
 * an email opens with that answer already written. The host's phone and email
 * come from the builder; whichever are filled decide which buttons appear.
 */

/** 1 -> "1st", 22 -> "22nd", 13 -> "13th". */
export function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

/** "30", "30th", " 40 " -> 30; anything else -> null. */
export function ageOf(value?: string): number | null {
  const m = (value || '').match(/^\s*(\d{1,3})/)
  const n = m ? Number(m[1]) : NaN
  return Number.isFinite(n) && n > 0 && n < 130 ? n : null
}

export type RsvpAnswer = 'yes' | 'no'

export interface RsvpChannel {
  kind: 'whatsapp' | 'sms' | 'email'
  label: string
  href: string
}

function digitsOf(phone?: string): string {
  const raw = (phone || '').trim()
  const digits = raw.replace(/\D/g, '')
  return digits.length >= 8 ? digits : ''
}

function emailOf(value?: string): string {
  const v = (value || '').trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : ''
}

/**
 * The guest's answer and the links that send it. `what` is how the party is
 * named in the message: "Maya's 30th", "Jules's birthday".
 */
export function useRsvp({ phone, email, what, date, formal = false }: { phone?: string; email?: string; what: string; date?: string; formal?: boolean }) {
  const [answer, setAnswer] = useState<RsvpAnswer | null>(null)
  const digits = digitsOf(phone)
  const mail = emailOf(email)
  const day = dateParts(date)
  const on = day ? ` on ${day.weekday} ${day.day} ${day.month}` : ''

  // A formal card ("joyfully accepts") gets a reply in the same register.
  const text = formal
    ? answer === 'no'
      ? `With regret, I’m unable to join you for ${what}${on}. Wishing you all a wonderful evening.`
      : `Joyfully accepting — I’d be delighted to celebrate ${what}${on}.`
    : answer === 'no'
      ? `So sorry — I can’t make ${what}${on}. Have the best time, and save me some cake.`
      : `Count me in for ${what}${on}! See you there.`

  const subject = answer === 'no' ? `Can’t make ${what}` : `RSVP — ${what}`
  const channels = rsvpChannels({ phone: digits, email: mail, text, subject })
  return { answer, setAnswer, channels, available: channels.length > 0 }
}

/** WhatsApp, text and email links that send `text` to the host, for whichever contacts are filled. */
export function rsvpChannels({ phone, email, text, subject }: { phone?: string; email?: string; text: string; subject: string }): RsvpChannel[] {
  const digits = digitsOf(phone)
  const mail = emailOf(email)
  const channels: RsvpChannel[] = []
  if (digits) {
    channels.push({ kind: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${digits}?text=${encodeURIComponent(text)}` })
    // `?&body=` is read by both iOS and Android messaging apps.
    channels.push({ kind: 'sms', label: 'Text message', href: `sms:+${digits}?&body=${encodeURIComponent(text)}` })
  }
  if (mail) {
    channels.push({ kind: 'email', label: 'Email', href: `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}` })
  }
  return channels
}

/** Whether a phone number or an email is usable for replies. */
export function canReply(phone?: string, email?: string): boolean {
  return Boolean(digitsOf(phone) || emailOf(email))
}

/** "Maya's 30th" / "Jules's birthday" — the party, in the words a guest would use. */
export function partyName(name: string, age: number | null): string {
  return `${name}’s ${age ? ordinal(age) : 'birthday'}`
}

/** Small line icons for the RSVP channels, drawn to sit on any background. */
export function ChannelIcon({ kind, className = 'h-[18px] w-[18px]' }: { kind: RsvpChannel['kind']; className?: string }) {
  if (kind === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path strokeLinejoin="round" d="M4.6 19.4 5.7 16A8 8 0 1 1 8.4 18.6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.3 8.6c-.3 1.6.9 3.6 2.4 4.8 1.4 1.1 2.9 1.6 3.7 1l.6-.9-1.6-1-.8.6c-.8-.3-1.9-1.2-2.3-2.2l.5-.8-1-1.6Z" />
      </svg>
    )
  }
  if (kind === 'sms') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path strokeLinejoin="round" d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5Z" />
        <path strokeLinecap="round" d="M8.5 9h7M8.5 12h4.5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  )
}
