'use client'

import { memo, useCallback, useRef, useState } from 'react'
import type { TemplateConfig, TemplateField } from '@/types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormEditorProps {
  config: TemplateConfig
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
  compact?: boolean
}

interface ScheduleRow { id: string; name: string; time: string }

// ─── Constants ───────────────────────────────────────────────────────────────

const WHEN_WHERE_KEYS = new Set(['date', 'time', 'venue', 'venueAddress', 'mapsUrl', 'dressCode', 'theme', 'pooja'])
const EXTRAS_KEYS = new Set(['message'])

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

function groupFields(fields: TemplateField[]) {
  const people: TemplateField[] = []
  const images: TemplateField[] = []
  const whenWhere: TemplateField[] = []
  let scheduleField: TemplateField | null = null
  let galleryField: TemplateField | null = null
  let musicField: TemplateField | null = null
  const extras: TemplateField[] = []

  for (const f of fields) {
    if (f.key === 'schedule') scheduleField = f
    else if (f.key === 'galleryImages') galleryField = f
    else if (f.key === 'musicUrl') musicField = f
    else if (f.type === 'image') images.push(f)
    else if (WHEN_WHERE_KEYS.has(f.key)) whenWhere.push(f)
    else if (EXTRAS_KEYS.has(f.key)) extras.push(f)
    else people.push(f)
  }
  return { people, images, whenWhere, scheduleField, galleryField, musicField, extras }
}

function getPeopleLabel(fields: TemplateField[]): string {
  const keys = fields.map(f => f.key)
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
  age: 'The age being celebrated',
  years: 'Number of years together',
  babyGender: 'Boy or Girl — affects the invite colour scheme',
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ number, label, hint, children }: { number: number; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white/80 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 flex items-start gap-3"
        style={{ background: 'linear-gradient(135deg,rgba(255,248,241,0.8),rgba(255,255,255,0.9))' }}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-body text-xs font-bold"
          style={{ background: 'rgba(217,164,65,0.16)', color: '#B87924' }}>
          {number}
        </div>
        <div>
          <p className="text-base font-bold text-ink leading-tight">{label}</p>
          {hint && <p className="mt-0.5 text-xs leading-5 text-muted">{hint}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  )
}

// ─── Generic field input ──────────────────────────────────────────────────────

function FieldInput({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  const hint = FIELD_HINTS[field.key]
  const isUrl = field.type === 'url' || field.key === 'mapsUrl'

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {field.label}
        {field.required && <span className="ml-1" style={{ color: '#B87924' }}>*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
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
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
        </div>
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      )}

      {hint && field.type !== 'textarea' && field.type !== 'date' && field.type !== 'time' && (
        <p className="mt-1.5 text-xs text-muted/70 leading-4">{hint}</p>
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
            className="w-20 h-20 rounded-full object-cover ring-2 ring-[#D9A441]/40 ring-offset-2"
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
          className="text-[10px] font-medium px-2 py-1 rounded-lg border border-border hover:border-accent/40 text-muted hover:text-accent-strong transition-colors"
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
          borderColor: '#E8DCCD',
          background: 'rgba(255,248,241,0.5)',
          cursor: uploading ? 'wait' : 'pointer',
        }}
      >
        {uploading ? (
          <svg className="w-5 h-5 animate-spin" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24">
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
      {uploadError && <p className="text-[10px] font-medium" style={{ color: '#B96B70' }}>{uploadError}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])} />
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
              style={{ background: 'rgba(217,164,65,0.12)', color: '#B87924' }}>
              {idx + 1}
            </div>
            <input
              type="text"
              value={row.name}
              onChange={e => updateRow(row.id, 'name', e.target.value)}
              placeholder="e.g. Baraat Arrival"
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/45 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
            <input
              type="text"
              value={row.time}
              onChange={e => updateRow(row.id, 'time', e.target.value)}
              placeholder="6:30 PM"
              className="w-24 shrink-0 rounded-xl border border-border bg-surface px-3 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/45 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
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
        className="mt-3 flex items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-2.5 text-xs font-semibold text-muted hover:border-accent/40 hover:text-accent-strong transition-all w-full justify-center"
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
          borderColor: dragging ? '#D9A441' : '#E8DCCD',
          background: dragging ? 'rgba(217,164,65,0.06)' : 'rgba(255,248,241,0.5)',
          cursor: uploading ? 'wait' : 'pointer',
        }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(217,164,65,0.12)' }}>
          {uploading ? (
            <svg className="w-5 h-5 animate-spin" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">
            {uploading ? 'Uploading…' : dragging ? 'Drop photos here' : 'Upload photos'}
          </p>
          <p className="text-xs text-muted mt-0.5">Drag &amp; drop or click — JPG, PNG, WebP · max 5 MB each</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => addFiles(e.target.files)} />
      </div>

      {uploadError && (
        <p className="mt-2 text-xs font-medium" style={{ color: '#B96B70' }}>{uploadError}</p>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, idx) => (
            <div key={`${idx}-${src.slice(-8)}`} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeImage(idx) }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                title="Remove"
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
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(217,164,65,0.12)' }}>
            <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: '#B87924' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{filename || 'Background Music'}</p>
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
          borderColor: dragging ? '#D9A441' : '#E8DCCD',
          background: dragging ? 'rgba(217,164,65,0.06)' : 'rgba(255,248,241,0.5)',
          cursor: uploading ? 'wait' : 'pointer',
        }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(217,164,65,0.12)' }}>
          {uploading ? (
            <svg className="w-5 h-5 animate-spin" style={{ color: '#B87924' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" style={{ color: '#B87924' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">
            {uploading ? 'Uploading…' : dragging ? 'Drop audio here' : 'Upload background music'}
          </p>
          <p className="text-xs text-muted mt-0.5">MP3, AAC, WAV · max 15 MB · plays softly for guests</p>
        </div>
        <input ref={inputRef} type="file" accept="audio/*" className="hidden"
          onChange={e => handleFile(e.target.files?.[0])} />
      </div>
      {uploadError && (
        <p className="mt-2 text-xs font-medium" style={{ color: '#B96B70' }}>{uploadError}</p>
      )}
    </div>
  )
})

// ─── Main component ───────────────────────────────────────────────────────────

export default function FormEditor({ config, data, onChange, compact = false }: FormEditorProps) {
  const handleChange = useCallback((key: string, value: string) => {
    onChange({ ...data, [key]: value })
  }, [data, onChange])

  const grouped = groupFields(config.fields)
  const peopleLabel = getPeopleLabel(grouped.people)

  // Compute dynamic section numbers
  let sNum = 0
  const n = () => ++sNum

  return (
    <div className={compact ? 'space-y-4 p-4 sm:p-5' : 'space-y-5 p-5 sm:p-6'}>

      {!compact && (
      <div className="rounded-2xl border border-border/60 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(255,248,241,0.95),rgba(255,255,255,0.98))', boxShadow: '0 2px 16px rgba(60,36,20,0.07)' }}>
        <div className="h-[2px] bg-gradient-to-r from-[#B87924] via-[#D9A441] to-[#B96B70]" />
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#B87924' }}>Invitation Builder</p>
              <h2 className="text-2xl font-bold text-ink tracking-tight">Make it personal.</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Fill in your details — the invite updates live as you type.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"
              style={{ background: 'rgba(217,164,65,0.12)' }}>
              <span style={{ color: '#B87924', fontSize: '18px', lineHeight: 1 }}>♥</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-border/40">
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: '#2F766D', color: '#fff' }}>✓</div>
              <span className="text-[10px] font-medium text-muted/70">Choose style</span>
            </div>
            <div className="h-px flex-1 bg-border/60" />
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: '#B87924', color: '#fff' }}>2</div>
              <span className="text-[10px] font-semibold" style={{ color: '#B87924' }}>Fill details</span>
            </div>
            <div className="h-px flex-1 bg-border/60" />
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: 'rgba(44,32,28,0.08)', color: 'rgba(44,32,28,0.3)' }}>3</div>
              <span className="text-[10px] font-medium" style={{ color: 'rgba(44,32,28,0.3)' }}>Share link</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 1. People */}
      {(grouped.people.length > 0 || grouped.images.length > 0) && (
        <Section number={n()} label={peopleLabel}>
          {grouped.images.length > 0 && (
            <div className="flex justify-center gap-6 pb-3 border-b border-border/40 mb-1">
              {grouped.images.map(field => (
                <SingleImageUploader
                  key={field.key}
                  label={field.label}
                  value={data[field.key] ?? ''}
                  onChange={v => handleChange(field.key, v)}
                />
              ))}
            </div>
          )}
          <div className={grouped.people.length >= 2 ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
            {grouped.people.map(field => (
              <div key={field.key} className={grouped.people.length >= 2 && field.type === 'textarea' ? 'col-span-2' : ''}>
                <FieldInput field={field} value={data[field.key] ?? ''} onChange={v => handleChange(field.key, v)} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 2. When & Where */}
      {grouped.whenWhere.length > 0 && (
        <Section number={n()} label="When &amp; Where" hint="Date, time, location, and dress expectations.">
          <div className="space-y-4">
            {/* Date + Time side by side */}
            {(() => {
              const dateField = grouped.whenWhere.find(f => f.key === 'date')
              const timeField = grouped.whenWhere.find(f => f.key === 'time')
              const rest = grouped.whenWhere.filter(f => f.key !== 'date' && f.key !== 'time')
              return (
                <>
                  {(dateField || timeField) && (
                    <div className="grid grid-cols-2 gap-4">
                      {dateField && <FieldInput field={dateField} value={data['date'] ?? ''} onChange={v => handleChange('date', v)} />}
                      {timeField && <FieldInput field={timeField} value={data['time'] ?? ''} onChange={v => handleChange('time', v)} />}
                    </div>
                  )}
                  {rest.map(field => (
                    <FieldInput key={field.key} field={field} value={data[field.key] ?? ''} onChange={v => handleChange(field.key, v)} />
                  ))}
                </>
              )
            })()}
          </div>
        </Section>
      )}

      {/* 3. Event Schedule */}
      {grouped.scheduleField && (
        <Section number={n()} label="Event Schedule" hint="Build your event timeline — each row is one moment.">
          <ScheduleEditor initial={data['schedule'] ?? ''} onChange={v => handleChange('schedule', v)} />
        </Section>
      )}

      {/* 4. Photo Gallery */}
      {grouped.galleryField && (
        <Section number={n()} label="Photo Gallery" hint="Add beautiful photos that appear in the invitation slideshow.">
          <GalleryUploader initial={data['galleryImages'] ?? ''} onChange={v => handleChange('galleryImages', v)} />
        </Section>
      )}

      {/* 5. Background Music */}
      {grouped.musicField && (
        <Section number={n()} label="Background Music" hint="A song that plays softly as guests view the invite.">
          <MusicUploader initial={data['musicUrl'] ?? ''} onChange={v => handleChange('musicUrl', v)} />
        </Section>
      )}

      {/* 6. Personal Note */}
      {grouped.extras.map(field => (
        <Section key={field.key} number={n()} label="Personal Note" hint="A heartfelt message from you to your guests.">
          <div>
            <textarea
              value={data[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder || 'Write a warm message for your guests…'}
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
            <p className="mt-1.5 text-xs text-muted/60">
              {(data[field.key] ?? '').length > 0 ? `${(data[field.key] ?? '').length} characters` : 'e.g. "With joy in our hearts, we invite you to share in our happiness."'}
            </p>
          </div>
        </Section>
      ))}

      <div className="pb-6" />
    </div>
  )
}
