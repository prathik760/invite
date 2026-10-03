'use client'

import { memo, useCallback, useRef, useState } from 'react'
import type { TemplateConfig, TemplateField } from '@/types'
import { FIELD_ORDER } from '@/lib/fieldOrder'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormEditorProps {
  config: TemplateConfig
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
  compact?: boolean
  /** When provided, only the specified section groups are rendered */
  sections?: Array<'people' | 'details' | 'enrich'>
  /** The design being edited: its boxes follow the order its content appears in (lib/fieldOrder.ts). */
  templateId?: string
}

interface ScheduleRow { id: string; name: string; time: string }

// ─── Constants ───────────────────────────────────────────────────────────────

const WHEN_WHERE_KEYS = new Set(['date', 'time', 'venue', 'venueAddress', 'destination', 'mapsUrl', 'dressCode', 'theme', 'pooja', 'visarjanDate', 'visarjanTime', 'whatsappNumber'])
const EXTRAS_KEYS = new Set(['message'])
// Interactive "3D Surprise Journey" fields — routed to the right wizard steps.
const UNLOCK_KEYS = new Set(['pin', 'pinHint'])
const JOURNEY_EXTRA_KEYS = new Set(['balloonMessages', 'scratchMessage', 'letterBody', 'signature'])
// Animated-greeting "reasons / little notes" — revealed one at a time in the card.
const GREETING_EXTRA_KEYS = new Set(['reasons'])

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function uploadToR2(file: File, folder: 'gallery' | 'music' | 'portraits'): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, size: file.size, folder }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? 'Upload failed')
  }
  const { uploadUrl, publicUrl } = await res.json()
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!put.ok) throw new Error('Upload to storage failed')
  return publicUrl
}

function parseList(value?: string): string[] {
  if (!value?.trim()) return []
  return value.split(/\n|,/).map(s => s.trim()).filter(Boolean)
}

function parseSchedule(value?: string): ScheduleRow[] {
  if (!value?.trim()) return [{ id: '1', name: '', time: '' }]
  return value.split('\n').filter(Boolean).map((line, i) => {
    const idx = line.indexOf(' - ')
    return idx === -1
      ? { id: String(i + 1), name: line.trim(), time: '' }
      : { id: String(i + 1), name: line.slice(0, idx).trim(), time: line.slice(idx + 3).trim() }
  })
}

function serializeSchedule(rows: ScheduleRow[]): string {
  return rows
    .filter(r => r.name.trim() || r.time.trim())
    .map(r => `${r.name}${r.time ? ` - ${r.time}` : ''}`)
    .join('\n')
}

interface FieldGroup {
  title: string
  section: 'people' | 'details' | 'enrich'
  hint?: string
  fields: TemplateField[]
}

function groupFields(fields: TemplateField[]) {
  const people: TemplateField[] = []
  const images: TemplateField[] = []
  const whenWhere: TemplateField[] = []
  let scheduleField: TemplateField | null = null
  let galleryField: TemplateField | null = null
  let musicField: TemplateField | null = null
  const extras: TemplateField[] = []
  const unlock: TemplateField[] = []
  const journeyExtras: TemplateField[] = []
  const greetingExtras: TemplateField[] = []
  const groups: FieldGroup[] = []

  for (const f of fields) {
    if (f.group) {
      const existing = groups.find(g => g.title === f.group)
      if (existing) existing.fields.push(f)
      else groups.push({ title: f.group, section: f.section ?? 'details', hint: f.hint, fields: [f] })
    }
    else if (f.key === 'schedule') scheduleField = f
    else if (f.key === 'galleryImages') galleryField = f
    else if (f.key === 'musicUrl') musicField = f
    else if (UNLOCK_KEYS.has(f.key)) unlock.push(f)
    else if (JOURNEY_EXTRA_KEYS.has(f.key)) journeyExtras.push(f)
    else if (GREETING_EXTRA_KEYS.has(f.key)) greetingExtras.push(f)
    else if (f.type === 'image') images.push(f)
    else if (WHEN_WHERE_KEYS.has(f.key)) whenWhere.push(f)
    else if (EXTRAS_KEYS.has(f.key)) extras.push(f)
    else people.push(f)
  }
  return { people, images, whenWhere, scheduleField, galleryField, musicField, extras, unlock, journeyExtras, greetingExtras, groups }
}

function getPeopleLabel(fields: TemplateField[]): string {
  const keys = fields.map(f => f.key)
  if (keys.some(k => k === 'headline')) return 'Your Greeting'
  if (keys.some(k => k === 'recipientName' || k === 'senderName')) return 'Who is it for?'
  if (keys.includes('celebrantName') && keys.includes('parentNames')) return 'The Birthday Child'
  if (keys.some(k => k === 'motherName')) return 'The Mother-to-be'
  if (keys.some(k => k === 'honoreeName')) return 'The Guest of Honour'
  if (keys.some(k => k === 'poojaName')) return 'The Pooja'
  if (keys.some(k => k === 'brideParents')) return 'The Couple & Families'
  if (keys.some(k => k.includes('baby') || k.includes('parent'))) return 'About the Baby'
  if (keys.some(k => k.includes('host'))) return 'The Hosts'
  if (keys.some(k => k.includes('celebrant') || k === 'age' || k === 'theme')) return 'The Celebrant'
  if (keys.some(k => k.includes('bride') || k.includes('groom') || k.includes('partner') || k.includes('couple') || k.includes('years'))) return 'The Couple'
  return 'About You'
}

// ─── Field Hints ─────────────────────────────────────────────────────────────

const FIELD_HINTS: Record<string, string> = {
  mapsUrl: 'Paste a Google Maps or Apple Maps link',
  dressCode: 'e.g. Traditional Indian Attire, Black Tie, Smart Casual',
  theme: 'e.g. Bollywood Glam, Royal, Garden Party',
  pooja: 'e.g. Ganesh Pooja at 9:00 AM sharp',
  venueAddress: 'Full address helps guests find the venue easily',
  destination: 'The town or region your postcard is "from" — e.g. Lake Como, Udaipur, Goa',
  age: 'The age being celebrated',
  years: 'Number of years together',
  babyGender: 'Boy or Girl — affects the invite colour scheme',
  whatsappNumber: 'Guests tap RSVP and a WhatsApp message to this number opens, ready to send',
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ number, label, hint, children }: { number: number; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-paper shadow-soft">
      <div className="flex items-start gap-3.5 border-b border-line px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald font-editorial text-[1.05rem] font-semibold text-paper">
          {number}
        </div>
        <div>
          <p className="font-editorial text-[1.35rem] font-semibold leading-tight text-charcoal">{label}</p>
          {hint && <p className="mt-0.5 text-[0.82rem] leading-5 text-muted">{hint}</p>}
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  )
}

// ─── Generic field input ──────────────────────────────────────────────────────

function FieldInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  const hint = FIELD_HINTS[field.key]
  const isUrl = field.type === 'url' || field.key === 'mapsUrl'

  if (field.columns?.length) return <div data-field={field.key}><RowsEditor field={field} initial={value} onChange={onChange} /></div>

  return (
    <div data-field={field.key}>
      <label className="field-label">
        {field.label}
        {field.required && <span className="ml-1 text-burnished-deep" aria-hidden>*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
          rows={3}
          className="field-input resize-none"
        />
      ) : isUrl ? (
        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder || 'https://…'}
            className="field-input pl-10"
          />
        </div>
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
          className="field-input"
        />
      )}

      {hint && field.type !== 'textarea' && field.type !== 'date' && field.type !== 'time' && (
        <p className="field-hint">{hint}</p>
      )}
    </div>
  )
}

// ─── Single image uploader (portrait photos) ─────────────────────────────────

const SingleImageUploader = memo(function SingleImageUploader({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFile = useCallback(async (file: File | null | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadToR2(file, 'portraits')
      onChange(url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally { setUploading(false) }
  }, [onChange])

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    await handleFile(e.dataTransfer.files?.[0])
  }

  if (value) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-burnished/40 ring-offset-2"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            title="Remove photo"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-muted/60 text-center">{label}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-[10px] font-medium px-2 py-1 rounded-lg border border-line hover:border-emerald-soft/40 text-muted hover:text-emerald-soft transition-colors"
        >
          Change photo
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files?.[0])} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center transition-all select-none"
        style={{
          borderColor: '#EADFD2',
          background: 'rgba(255,248,241,0.5)',
          cursor: uploading ? 'wait' : 'pointer',
        }}
      >
        {uploading ? (
          <svg className="w-5 h-5 animate-spin" style={{ color: '#0B4A34' }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" style={{ color: 'rgba(44,32,28,0.25)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        )}
      </div>
      <p className="text-[10px] text-muted/60 text-center leading-tight">{label}<br /><span className="text-[9px]">Tap to upload</span></p>
      {uploadError && <p className="text-[10px] font-medium" style={{ color: '#A33A3A' }}>{uploadError}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])} />
    </div>
  )
})

// ─── Rows editor (functions, story, FAQs, contacts…) ───────────────────────────

/** "a | b | c" per line ⇄ rows of cells. Pipes inside a cell become slashes. */
function parseRows(value: string, width: number): string[][] {
  const rows = (value || '').split('\n').filter(l => l.trim()).map(l => {
    const cells = l.split('|').map(c => c.trim())
    return Array.from({ length: width }, (_, i) => cells[i] ?? '')
  })
  return rows.length ? rows : [Array(width).fill('')]
}

function serializeRows(rows: string[][]): string {
  return rows
    .filter(r => r.some(c => c.trim()))
    .map(r => r.map(c => c.replace(/\|/g, '/').replace(/\n/g, ' ').trim()).join(' | ').replace(/(\s\|\s)+$/, ''))
    .join('\n')
}

const RowsEditor = memo(function RowsEditor({ field, initial, onChange }: { field: TemplateField; initial: string; onChange: (v: string) => void }) {
  const columns = field.columns ?? []
  const [rows, setRows] = useState<string[][]>(() => parseRows(initial, columns.length))

  const update = (next: string[][]) => {
    setRows(next)
    onChange(serializeRows(next))
  }
  const setCell = (r: number, c: number, v: string) => update(rows.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? v : cell)) : row)))
  const removeRow = (r: number) => {
    const next = rows.filter((_, i) => i !== r)
    update(next.length ? next : [Array(columns.length).fill('')])
  }
  const noun = field.label.replace(/s$/, '').toLowerCase()
  // Two cells per line; long fields (and any cell that would sit alone) span both.
  const wide = (() => {
    const flags = columns.map(c => c.type === 'textarea' || c.key === 'venue' || c.key === 'name' || c.key === 'title' || c.key === 'q')
    let open = -1
    flags.forEach((w, i) => {
      if (w) { if (open !== -1) flags[open] = true; open = -1 }
      else if (open === -1) open = i
      else open = -1
    })
    if (open !== -1) flags[open] = true
    return flags
  })()

  return (
    <div>
      <p className="field-label">{field.label}</p>
      {/* The remove button sits on the first label's line (the first column is
          always full-width), so the fields keep the card's whole width —
          reserving a right gutter for it clipped the date and time inputs on
          phones. Below 360px paired cells stack. */}
      <div className="space-y-3">
        {rows.map((row, r) => (
          <div key={r} className="relative rounded-2xl border border-line bg-champagne/60 p-3.5">
            {/* The only paired cells are date + time, and a date needs the
                wider half: at 360px an even split cut "dd/mm/yyyy" short. */}
            <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-2.5">
              {columns.map((col, c) => {
                const common = {
                  value: row[c] ?? '',
                  placeholder: col.placeholder || col.label,
                  'aria-label': `${col.label}, row ${r + 1}`,
                  className: 'field-input px-3',
                }
                return (
                  <label key={col.key} className={wide[c] ? 'col-span-2' : 'max-[359px]:col-span-2'}>
                    <span className={`mb-1.5 block text-[0.72rem] font-medium text-muted ${c === 0 ? 'pr-10' : ''}`}>{col.label}</span>
                    {col.type === 'textarea' ? (
                      <textarea {...common} rows={2} className="field-input resize-none px-3" onChange={e => setCell(r, c, e.target.value)} />
                    ) : (
                      <input {...common} type={col.type ?? 'text'} onChange={e => setCell(r, c, e.target.value)} />
                    )}
                  </label>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => removeRow(r)}
              aria-label={`Remove row ${r + 1}`}
              className="absolute right-1.5 top-1.5 flex h-8 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-paper hover:text-charcoal"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => update([...rows, Array(columns.length).fill('')])}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-2.5 text-xs font-semibold text-muted transition-all hover:border-emerald-soft/40 hover:text-emerald-soft"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add another {noun}
      </button>
    </div>
  )
})

// ─── Schedule editor ──────────────────────────────────────────────────────────

const ScheduleEditor = memo(function ScheduleEditor({ initial, onChange }: { initial: string; onChange: (v: string) => void }) {
  const [rows, setRows] = useState<ScheduleRow[]>(() => parseSchedule(initial))
  const nextId = useRef(rows.length + 1)

  const update = useCallback((newRows: ScheduleRow[]) => {
    setRows(newRows)
    onChange(serializeSchedule(newRows))
  }, [onChange])

  const addRow = () => {
    const id = String(++nextId.current)
    update([...rows, { id, name: '', time: '' }])
  }

  const updateRow = (id: string, field: 'name' | 'time', val: string) =>
    update(rows.map(r => r.id === id ? { ...r, [field]: val } : r))

  const removeRow = (id: string) => {
    const filtered = rows.filter(r => r.id !== id)
    update(filtered.length ? filtered : [{ id: '1', name: '', time: '' }])
  }

  return (
    <div>
      <p className="text-xs text-muted/70 mb-3 leading-4">
        Add each event on its own row — name and time. Guests will see these as a timeline.
      </p>
      <div className="space-y-2.5">
        {rows.map((row, idx) => (
          <div key={row.id} className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(11,74,52,0.08)', color: '#0B4A34' }}>
              {idx + 1}
            </div>
            <input
              type="text"
              value={row.name}
              onChange={e => updateRow(row.id, 'name', e.target.value)}
              placeholder="e.g. Baraat Arrival"
              className="field-input flex-1 px-3"
            />
            <input
              type="text"
              value={row.time}
              onChange={e => updateRow(row.id, 'time', e.target.value)}
              placeholder="6:30 PM"
              className="field-input w-24 shrink-0 px-3"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="shrink-0 h-9 w-9 flex items-center justify-center rounded-xl text-muted hover:text-rose hover:bg-rose/8 transition-all border border-transparent hover:border-rose/20"
              title="Remove"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-3 flex items-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-2.5 text-xs font-semibold text-muted hover:border-emerald-soft/40 hover:text-emerald-soft transition-all w-full justify-center"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add another event
      </button>
    </div>
  )
})

// ─── Gallery uploader ─────────────────────────────────────────────────────────

const GalleryUploader = memo(function GalleryUploader({ initial, onChange }: { initial: string; onChange: (v: string) => void }) {
  const [images, setImages] = useState<string[]>(() => parseList(initial))
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const commit = useCallback((imgs: string[]) => {
    setImages(imgs)
    onChange(imgs.join('\n'))
  }, [onChange])

  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    setUploadError('')
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      try {
        uploaded.push(await uploadToR2(file, 'gallery'))
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed')
      }
    }
    if (uploaded.length) commit([...images, ...uploaded])
    setUploading(false)
  }, [images, commit])

  const removeImage = (idx: number) => commit(images.filter((_, i) => i !== idx))

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    await addFiles(e.dataTransfer.files)
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-8 px-4 text-center select-none"
        style={{
          borderColor: dragging ? '#A47945' : '#EADFD2',
          background: dragging ? 'rgba(164,121,69,0.06)' : 'rgba(255,248,241,0.5)',
          cursor: uploading ? 'wait' : 'pointer',
        }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(11,74,52,0.08)' }}>
          {uploading ? (
            <svg className="w-5 h-5 animate-spin" style={{ color: '#0B4A34' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" style={{ color: '#0B4A34' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal">
            {uploading ? 'Uploading…' : dragging ? 'Drop photos here' : 'Upload photos'}
          </p>
          <p className="text-xs text-muted mt-0.5">Drag &amp; drop or click — JPG, PNG, WebP · max 5 MB each</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => addFiles(e.target.files)} />
      </div>

      {uploadError && (
        <p className="mt-2 text-xs font-medium" style={{ color: '#A33A3A' }}>{uploadError}</p>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, idx) => (
            <div key={`${idx}-${src.slice(-8)}`} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-champagne">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeImage(idx) }}
                // Always visible on touch screens, which have no hover to reveal it —
                // there it was an invisible 20px target.
                className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 [@media(hover:hover)]:h-6 [@media(hover:hover)]:w-6 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
                title="Remove"
                aria-label={`Remove photo ${idx + 1}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="mt-2 text-xs text-muted/60">{images.length} photo{images.length !== 1 ? 's' : ''} added</p>
      )}
    </div>
  )
})

// ─── Music uploader ───────────────────────────────────────────────────────────

const MusicUploader = memo(function MusicUploader({ initial, onChange }: { initial: string; onChange: (v: string) => void }) {
  const [value, setValue] = useState(initial)
  const [filename, setFilename] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File | null | undefined) => {
    if (!file || !file.type.startsWith('audio/')) return
    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadToR2(file, 'music')
      setValue(url)
      setFilename(file.name)
      onChange(url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const clear = () => { setValue(''); setFilename(''); setUploadError(''); onChange('') }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    await handleFile(e.dataTransfer.files?.[0])
  }

  if (value) {
    return (
      <div className="rounded-2xl border border-line bg-champagne p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(11,74,52,0.08)' }}>
            <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: '#0B4A34' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-charcoal truncate">{filename || 'Background Music'}</p>
            <p className="text-xs text-muted">Ready to play for your guests</p>
          </div>
          <button onClick={clear} className="shrink-0 text-xs text-muted hover:text-rose transition-colors px-2 py-1 rounded-lg hover:bg-rose/8">
            Remove
          </button>
        </div>
        <audio src={value} controls className="w-full h-9 rounded-lg" />
      </div>
    )
  }

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-8 px-4 text-center select-none"
        style={{
          borderColor: dragging ? '#A47945' : '#EADFD2',
          background: dragging ? 'rgba(164,121,69,0.06)' : 'rgba(255,248,241,0.5)',
          cursor: uploading ? 'wait' : 'pointer',
        }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(11,74,52,0.08)' }}>
          {uploading ? (
            <svg className="w-5 h-5 animate-spin" style={{ color: '#0B4A34' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" style={{ color: '#0B4A34' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal">
            {uploading ? 'Uploading…' : dragging ? 'Drop audio here' : 'Upload background music'}
          </p>
          <p className="text-xs text-muted mt-0.5">MP3, AAC, WAV · max 15 MB · plays softly for guests</p>
        </div>
        <input ref={inputRef} type="file" accept="audio/*" className="hidden"
          onChange={e => handleFile(e.target.files?.[0])} />
      </div>
      {uploadError && (
        <p className="mt-2 text-xs font-medium" style={{ color: '#A33A3A' }}>{uploadError}</p>
      )}
    </div>
  )
})

// ─── Main component ───────────────────────────────────────────────────────────

/** A titled block of the form, placed by where its first field shows on the design. */
interface Block { rank: number; key: string; render: (number: number) => React.ReactNode }

export default function FormEditor({ config, data, onChange, compact = false, sections, templateId }: FormEditorProps) {
  const show = (group: 'people' | 'details' | 'enrich') => !sections || sections.includes(group)
  const handleChange = useCallback((key: string, value: string) => {
    onChange({ ...data, [key]: value })
  }, [data, onChange])

  // Boxes follow the design: the field shown highest on the page comes first.
  // Designs without a measured order keep their field definition order.
  const measured = templateId ? FIELD_ORDER[templateId] : undefined
  const rank = (key: string) => {
    const i = measured ? measured.indexOf(key) : -1
    return i >= 0 ? i : 1000 + config.fields.findIndex((f) => f.key === key)
  }
  const byRank = (a: TemplateField, b: TemplateField) => rank(a.key) - rank(b.key)
  const first = (fields: TemplateField[]) => Math.min(...fields.map((f) => rank(f.key)))

  const grouped = groupFields(config.fields)
  const peopleLabel = getPeopleLabel(grouped.people)
  const input = (field: TemplateField) => (
    <FieldInput key={field.key} field={field} value={data[field.key] ?? ''} onChange={v => handleChange(field.key, v)} />
  )
  const groupBlock = (g: ReturnType<typeof groupFields>['groups'][number]): Block => ({
    rank: first(g.fields),
    key: `group-${g.title}`,
    render: (n) => (
      <Section key={g.title} number={n} label={g.title} hint={g.hint}>
        <div className="space-y-4">{[...g.fields].sort(byRank).map(input)}</div>
      </Section>
    ),
  })

  // ── Step 2: who it is for ─────────────────────────────────────────────────
  const people: Block[] = []
  if (grouped.people.length > 0 || grouped.images.length > 0) {
    // Names and photos in the order the design shows them; photos that sit
    // together on the design sit together here, side by side.
    const ordered = [...grouped.people, ...grouped.images].sort(byRank)
    const runs: TemplateField[][] = []
    for (const f of ordered) {
      const last = runs[runs.length - 1]
      if (last && f.type === 'image' && last[0].type === 'image') last.push(f)
      else if (last && f.type !== 'image' && last[0].type !== 'image') last.push(f)
      else runs.push([f])
    }
    people.push({
      rank: first(ordered),
      key: 'people',
      render: (n) => (
        <Section key="people" number={n} label={peopleLabel}>
          <div className="space-y-4">
            {runs.map((run, i) =>
              run[0].type === 'image' ? (
                <div key={`img-${i}`} className="flex justify-center gap-6">
                  {run.map(field => (
                    <div key={field.key} data-field={field.key}>
                      <SingleImageUploader label={field.label} value={data[field.key] ?? ''} onChange={v => handleChange(field.key, v)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div key={`txt-${i}`} className={run.length >= 2 ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : 'space-y-4'}>
                  {run.map(field => (
                    <div key={field.key} className={run.length >= 2 && field.type === 'textarea' ? 'sm:col-span-2' : ''}>{input(field)}</div>
                  ))}
                </div>
              ),
            )}
          </div>
        </Section>
      ),
    })
  }
  people.push(...grouped.groups.filter(g => g.section === 'people').map(groupBlock))

  // ── Step 3: when and where ────────────────────────────────────────────────
  const details: Block[] = []
  if (grouped.whenWhere.length > 0) {
    const ordered = [...grouped.whenWhere].sort(byRank)
    details.push({
      rank: first(ordered),
      key: 'when-where',
      render: (n) => (
        <Section key="when-where" number={n} label="When &amp; Where" hint="Date, time, location, and dress expectations.">
          <div className="space-y-4">
            {ordered.map((field, i) => {
              // Date and time share a row when the design shows them together.
              const next = ordered[i + 1]
              const prev = ordered[i - 1]
              const pair = (a?: TemplateField, b?: TemplateField) => a?.key === 'date' && b?.key === 'time'
              if (pair(prev, field)) return null
              if (pair(field, next)) {
                return (
                  <div key="date-time" className="grid grid-cols-2 gap-4">
                    {input(field)}
                    {input(next as TemplateField)}
                  </div>
                )
              }
              return input(field)
            })}
          </div>
        </Section>
      ),
    })
  }
  if (grouped.unlock.length > 0) {
    details.push({
      rank: first(grouped.unlock),
      key: 'unlock',
      render: (n) => (
        <Section key="unlock" number={n} label="The Secret Unlock" hint="They'll enter this PIN to open the surprise. Pick something only they would know.">
          <div className="space-y-4">{[...grouped.unlock].sort(byRank).map(input)}</div>
        </Section>
      ),
    })
  }
  if (grouped.scheduleField) {
    details.push({
      rank: rank('schedule'),
      key: 'schedule',
      render: (n) => (
        <Section key="schedule" number={n} label="Event Schedule" hint="Build your event timeline — each row is one moment.">
          <div data-field="schedule">
            <ScheduleEditor initial={data['schedule'] ?? ''} onChange={v => handleChange('schedule', v)} />
          </div>
        </Section>
      ),
    })
  }
  details.push(...grouped.groups.filter(g => g.section === 'details').map(groupBlock))

  // ── Step 4: photos, music and the personal touches ────────────────────────
  const enrich: Block[] = []
  if (grouped.galleryField) {
    enrich.push({
      rank: rank('galleryImages'),
      key: 'gallery',
      render: (n) => (
        <Section key="gallery" number={n} label="Photo Gallery" hint="Add beautiful photos that appear in the invitation slideshow.">
          <div data-field="galleryImages">
            <GalleryUploader initial={data['galleryImages'] ?? ''} onChange={v => handleChange('galleryImages', v)} />
          </div>
        </Section>
      ),
    })
  }
  if (grouped.musicField) {
    enrich.push({
      // The music has no place on the page; it comes last.
      rank: 10000,
      key: 'music',
      render: (n) => (
        <Section key="music" number={n} label="Background Music" hint="A song that plays softly as guests view the invite.">
          <div data-field="musicUrl">
            <MusicUploader initial={data['musicUrl'] ?? ''} onChange={v => handleChange('musicUrl', v)} />
          </div>
        </Section>
      ),
    })
  }
  for (const field of grouped.extras) {
    enrich.push({
      rank: rank(field.key),
      key: `extra-${field.key}`,
      render: (n) => (
        <Section key={field.key} number={n} label="Personal Note" hint="A heartfelt message from you to your guests.">
          <div data-field={field.key}>
            <textarea
              value={data[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder || 'Write a warm message for your guests…'}
              rows={4}
              className="field-input resize-none"
            />
            <p className="mt-1.5 text-xs text-muted/60">
              {(data[field.key] ?? '').length > 0 ? `${(data[field.key] ?? '').length} characters` : 'e.g. "With joy in our hearts, we invite you to share in our happiness."'}
            </p>
          </div>
        </Section>
      ),
    })
  }
  enrich.push(...grouped.groups.filter(g => g.section === 'enrich').map(groupBlock))
  for (const field of grouped.greetingExtras) {
    enrich.push({
      rank: rank(field.key),
      key: `greeting-${field.key}`,
      render: (n) => (
        <Section key={field.key} number={n} label="Reasons You Love Them" hint="One per line — they'll be revealed one at a time, building to your message.">
          <div data-field={field.key}>
            <textarea
              value={data[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder || 'One reason per line…'}
              rows={5}
              className="field-input resize-none"
            />
            <p className="mt-1.5 text-xs text-muted/60">Each line becomes a reveal card in the greeting.</p>
          </div>
        </Section>
      ),
    })
  }
  if (grouped.journeyExtras.length > 0) {
    enrich.push({
      rank: first(grouped.journeyExtras),
      key: 'journey',
      render: (n) => (
        <Section key="journey" number={n} label="Personal Touches" hint="Balloon wishes, the scratch-card secret, and your handwritten letter.">
          <div className="space-y-4">{[...grouped.journeyExtras].sort(byRank).map(input)}</div>
        </Section>
      ),
    })
  }

  const blocks = [
    ...(show('people') ? [...people].sort((a, b) => a.rank - b.rank) : []),
    ...(show('details') ? [...details].sort((a, b) => a.rank - b.rank) : []),
    ...(show('enrich') ? [...enrich].sort((a, b) => a.rank - b.rank) : []),
  ]

  return (
    <div className={compact ? 'space-y-4 p-4 sm:p-5' : 'space-y-5 p-5 sm:p-6'}>
      {blocks.map((b, i) => b.render(i + 1))}
      <div className="pb-6" />
    </div>
  )
}
