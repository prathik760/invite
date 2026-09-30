'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { seoEvents, trackEvent } from '@/lib/analytics'

const TemplatePreviewModal = dynamic(() => import('@/components/create/TemplatePreviewModal'), { ssr: false })

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

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        className={className}
        onClick={() => {
          trackEvent(seoEvents.previewOpen, { template_id: templateId, source })
          setArmed(true)
          setOpen(true)
        }}
      >
        {children}
      </button>
      {armed &&
        createPortal(
          <TemplatePreviewModal templateId={templateId} open={open} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  )
}
