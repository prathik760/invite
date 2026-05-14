import type { ComponentType } from 'react'
import { TEMPLATES, type TemplateData } from './data'
import type { TemplateConfig } from '@/types'

export interface TemplateEntry extends TemplateData {
  Component: ComponentType<{
    data: Record<string, string>
    eventId?: string
    isPreview?: boolean
  }>
  config: TemplateConfig
}

function buildRegistry(): Record<string, TemplateEntry> {
  // Dynamic requires are deferred so this module stays server-safe for config lookups.
  // Components are resolved lazily on the client.
  return {} as Record<string, TemplateEntry>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _registry = buildRegistry()

export function getTemplateIds(): string[] {
  return TEMPLATES.map((t) => t.id)
}

export function getTemplateConfig(id: string): TemplateData | undefined {
  return TEMPLATES.find((t) => t.id === id)
}
