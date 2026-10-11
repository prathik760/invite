'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { seoEvents, trackEvent } from '@/lib/analytics'

type PreviewModal = typeof import('@/components/create/TemplatePreviewModal').default

/**
 * Once the modal's code is in, it is rendered directly. Through next/dynamic
 * it would suspend first even when already loaded, and React holds a revealed
 * Suspense boundary back for ~300 ms — the popup appeared a beat after the tap.
 */
let LoadedModal: PreviewModal | null = null
const loadModal = () =>
  import('@/components/create/TemplatePreviewModal').then((m) => {
    LoadedModal = m.default
    return m
  })
const TemplatePreviewModal = dynamic(loadModal, { ssr: false })

/**
 * The first Preview click used to wait for the modal's code to download, then
 * for the design's page. Now the modal's code (~14 KB) loads once the page is
 * idle, and the design's page starts downloading as soon as a visitor points
 * at, focuses or touches a Preview button.
 */
let modalWarm = false
function warmModal() {
  if (modalWarm) return
  modalWarm = true
  loadModal().catch(() => { modalWarm = false })
}

const prefetchedDemos = new Set<string>()
function prefetchDemo(templateId: string) {
  if (prefetchedDemos.has(templateId)) return
  prefetchedDemos.add(templateId)
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = `/demo/${templateId}/embed`
  document.head.appendChild(link)
}

/**
 * Opens the live template preview in a phone frame.
 *
 * The modal — and with it the template renderer — is mounted on first click,
 * not on page load. `DemoViewButton` mounts its modal as soon as the page
 * hydrates, so a gallery of twenty cards pulled the whole renderer chunk into
 * every visit, including the many that never press Preview.
 */
export default function PreviewButton({
  templateId,
  className,
  children,
  source,
  ariaLabel,
}: {
  templateId: string
  className?: string
  children: React.ReactNode
  source: string
  ariaLabel?: string
}) {
  const [armed, setArmed] = useState(false)
  const [open, setOpen] = useState(false)
  // Chosen once, at the first click, so a later re-render never swaps the
  // component (which would remount the modal and reload the design).
  const modal = useRef<ComponentType<{ templateId: string; open: boolean; onClose: () => void }> | null>(null)

  useEffect(() => {
    if (modalWarm) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void }
    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(warmModal, { timeout: 5000 })
      return () => w.cancelIdleCallback?.(handle)
    }
    const timer = setTimeout(warmModal, 3000)
    return () => clearTimeout(timer)
  }, [])

  const intent = () => {
    warmModal()
    prefetchDemo(templateId)
  }

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        className={className}
        onPointerEnter={intent}
        onFocus={intent}
        onTouchStart={intent}
        onClick={() => {
          trackEvent(seoEvents.previewOpen, { template_id: templateId, source })
          if (!modal.current) modal.current = LoadedModal ?? TemplatePreviewModal
          setArmed(true)
          setOpen(true)
        }}
      >
        {children}
      </button>
      {armed && modal.current &&
        createPortal(
          <modal.current templateId={templateId} open={open} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  )
}
