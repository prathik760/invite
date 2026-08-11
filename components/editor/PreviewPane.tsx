'use client'

import TemplateRenderer from '@/components/templates/TemplateRenderer'

interface PreviewPaneProps {
  templateId: string
  data: Record<string, string>
}

// The 3D experiences (greeting + interactive journey) are full-viewport, stage-based
// designs. In a bounded preview they must fill the container height (h-full) rather
// than flow at their natural 100svh height, which would blow out the phone shell.
function is3DExperience(templateId: string): boolean {
  return templateId === 'surprise-journey' || templateId.startsWith('greeting-')
}

export default function PreviewPane({ templateId, data }: PreviewPaneProps) {
  return (
    // No padding wrapper — template renders edge-to-edge inside the phone screen.
    // 3D experiences fill the container; 2D templates keep natural (scrolling) flow.
    <div className={is3DExperience(templateId) ? 'h-full' : undefined}>
      <TemplateRenderer templateId={templateId} data={data} isPreview eventId="__preview__" />
    </div>
  )
}
