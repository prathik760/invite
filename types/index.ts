export interface TemplateFieldColumn {
  key: string
  label: string
  type?: 'text' | 'date' | 'time' | 'tel' | 'textarea'
  placeholder?: string
}

export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'date' | 'time' | 'url' | 'textarea' | 'image'
  required?: boolean
  placeholder?: string
  /**
   * A repeatable list edited as rows ("Mehendi | 2026-12-12 | 16:00 | Lawns").
   * Stored as one line per row with columns joined by " | ", so templates read
   * it like any textarea.
   */
  columns?: TemplateFieldColumn[]
  /** Form placement. Fields with a `group` get their own titled section in that step. */
  section?: 'people' | 'details' | 'enrich'
  group?: string
  /** One line under the group title. */
  hint?: string
}

export interface TemplateConfig {
  fields: TemplateField[]
  defaultData: Record<string, string>
}

export interface TemplateDefinition {
  id: string
  name: string
  previewImage: string
  config: TemplateConfig
}

export interface EventRecord {
  id: string
  slug: string
  templateId: string
  data: Record<string, string>
  isPaid: boolean
  createdAt: string
  wishes?: WishRecord[]
}

export interface WishRecord {
  id: string
  eventId: string
  name: string
  message: string
  isApproved: boolean
  createdAt: string
}
