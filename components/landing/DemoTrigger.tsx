'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import TemplatePreviewModal from '@/components/create/TemplatePreviewModal'

// ─── Preview area wrapper ─────────────────────────────────────────────────────

interface PreviewAreaProps {
  templateId: string
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
  children: React.ReactNode
}

export function DemoPreviewArea({ templateId, className, style, ariaLabel, children }: PreviewAreaProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true) }}
        className={className}
        style={{ ...style, cursor: 'pointer' }}
        aria-label={ariaLabel}
      >
        {children}
      </div>
      {mounted && createPortal(
        <TemplatePreviewModal templateId={templateId} open={open} onClose={() => setOpen(false)} />,
        document.body
      )}
    </>
  )
}

// ─── View demo button ─────────────────────────────────────────────────────────

interface ViewButtonProps {
  templateId: string
  accent: string
  className?: string
  style?: React.CSSProperties
}

export function DemoViewButton({ templateId, accent, className, style }: ViewButtonProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const defaultClassName = "flex items-center justify-center gap-1 rounded-xl py-2.5 text-[11px] font-semibold transition-all hover:opacity-85"
  const defaultStyle: React.CSSProperties = { background: `${accent}12`, border: `1px solid ${accent}30`, color: accent }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? defaultClassName}
        style={style ?? defaultStyle}
      >
        <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        View demo
      </button>
      {mounted && createPortal(
        <TemplatePreviewModal templateId={templateId} open={open} onClose={() => setOpen(false)} />,
        document.body
      )}
    </>
  )
}
