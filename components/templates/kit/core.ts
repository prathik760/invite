'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { formatTime } from '@/lib/utils'

/** Props every invitation template receives from TemplateRenderer. */
export interface InviteProps {
  data: Record<string, string>
  eventId?: string
  isPreview?: boolean
}

/** Lines (or comma-separated items) of a textarea field, trimmed, empties dropped. */
export function parseList(value?: string): string[] {
  if (!value) return []
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/** Lines of a textarea field — commas are kept, because prose uses them. */
export function parseLines(value?: string): string[] {
  if (!value) return []
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export interface ScheduleItem {
  title: string
  time?: string
  note?: string
}

/**
 * The builder asks for "Baraat - 6:00 PM" per line; Raksha Bandhan uses
 * "Title | Time | Note". Both are accepted. The split is on the *last* " - "
 * so titles that contain a hyphen survive.
 */
export function parseSchedule(value?: string): ScheduleItem[] {
  return parseLines(value).map((line) => {
    if (line.includes('|')) {
      const [title, time, note] = line.split('|').map((p) => p.trim())
      return { title, time: time || undefined, note: note || undefined }
    }
    const m = line.match(/^(.*\S)\s+[-–—]\s+(.+)$/)
    return m ? { title: m[1].trim(), time: m[2].trim() } : { title: line }
  })
}

export interface DateParts {
  weekday: string
  day: number
  dayPadded: string
  month: string
  monthShort: string
  year: number
  /** "Saturday, 12 December 2026" */
  long: string
}

/** Split a yyyy-mm-dd field into typographic parts. Local time, no TZ shift. */
export function dateParts(value?: string): DateParts | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  if (Number.isNaN(date.getTime())) return null
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' })
  const month = date.toLocaleDateString('en-GB', { month: 'long' })
  return {
    weekday,
    day: d,
    dayPadded: String(d).padStart(2, '0'),
    month,
    monthShort: month.slice(0, 3),
    year: y,
    long: `${weekday}, ${d} ${month} ${y}`,
  }
}

/** "18:30" -> "6:30 PM"; empty string when missing. */
export function timeLabel(value?: string): string {
  return value ? formatTime(value) : ''
}

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Live countdown to date + time. Returns null when there is no date, the moment
 * has passed, or `enabled` is false (builder previews, so the preview doesn't
 * tick and re-render on every keystroke's second).
 *
 * The first render returns null on both server and client, so hydration never
 * mismatches; the numbers appear after mount.
 */
export function useCountdown(date?: string, time?: string, enabled = true): Countdown | null {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    if (!enabled || !date) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [enabled, date])

  if (!enabled || !date || now === null) return null
  const target = new Date(`${date}T${time || '00:00'}:00`)
  if (Number.isNaN(target.getTime())) return null
  const diff = target.getTime() - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

/**
 * Directions link. Hosts often skip the Maps field but type the venue and
 * address, so fall back to a Maps search for those rather than showing no
 * directions at all.
 */
export function mapsHref(mapsUrl?: string, ...place: (string | undefined)[]): string | null {
  if (mapsUrl && /^https?:\/\//i.test(mapsUrl)) return mapsUrl
  const q = place.filter(Boolean).join(', ').trim()
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null
}

/** Only http(s) image URLs are rendered; anything else is ignored. */
export function galleryImages(value?: string, max = 8): string[] {
  return parseLines(value)
    .flatMap((l) => l.split(/\s+/))
    .filter((u) => /^https?:\/\//i.test(u) || u.startsWith('/'))
    .slice(0, max)
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Subtle paper grain as a CSS background-image value. */
export function grain(opacity = 0.06, size = 180): CSSProperties {
  return {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${opacity} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: `${size}px ${size}px`,
  }
}

/**
 * Google Calendar "add event" link. Times are floating (no zone), which is what
 * a guest expects: 6:30 PM at the venue, whatever their phone's zone.
 */
export function calendarHref(title: string, date?: string, time?: string, place?: string, hours = 3): string | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const [h, m] = (time && /^\d{1,2}:\d{2}/.test(time) ? time : '10:00').split(':').map(Number)
  const start = new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)), h, m)
  const end = new Date(start.getTime() + hours * 3600000)
  const f = (d: Date) =>
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${f(start)}/${f(end)}` })
  if (place) q.set('location', place)
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}

/**
 * Google Calendar link for an all-day event — a save-the-date has a day but no
 * time yet. Google's end date is exclusive, so a one-day event ends the next day.
 */
export function calendarDayHref(title: string, date?: string, place?: string, details?: string): string | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const [y, m, d] = date.split('-').map(Number)
  const f = (x: Date) => `${x.getFullYear()}${pad2(x.getMonth() + 1)}${pad2(x.getDate())}`
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${f(new Date(y, m - 1, d))}/${f(new Date(y, m - 1, d + 1))}` })
  if (place) q.set('location', place)
  if (details) q.set('details', details)
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}

/** wa.me link to the host, or null when no usable number was given. */
export function whatsappHref(number?: string, text?: string): string | null {
  const digits = (number || '').replace(/\D/g, '')
  if (digits.length < 8) return null
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

/**
 * Rows edited with the builder's row editor ("a | b | c" per line) as objects:
 *   parseRows(data.events, ['name', 'date', 'time', 'venue', 'dress'])
 * Missing trailing cells come back as ''. Rows whose first cell is empty are
 * dropped, since the first column is always the thing being listed.
 */
export function parseRows<K extends string>(value: string | undefined, keys: readonly K[]): Record<K, string>[] {
  return parseLines(value)
    .map((line) => {
      const cells = line.split('|').map((c) => c.trim())
      return Object.fromEntries(keys.map((k, i) => [k, cells[i] ?? ''])) as Record<K, string>
    })
    .filter((row) => row[keys[0]])
}

/** "+91 98765 43210" -> "tel:+919876543210"; null when there is no usable number. */
export function telHref(number?: string): string | null {
  const digits = (number || '').replace(/[^\d+]/g, '')
  return digits.replace(/\D/g, '').length >= 8 ? `tel:${digits}` : null
}
