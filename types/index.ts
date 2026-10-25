export interface TemplateFieldColumn {
  key: string
  label: string
  type?: 'text' | 'date' | 'time' | 'tel' | 'textarea'
  placeholder?: string
}

/** One choice of a 'choice' field. The first one is what an empty value means. */
export interface TemplateFieldOption {
  value: string
  label: string
  hint?: string
  /** A CSS background for the little colour chip beside it. */
  swatch?: string
}

export interface TemplateField {
  key: string
  label: string
  /**
   * 'gallery' is a second set of uploaded photos (one URL per line), beside the design's `galleryImages`.
   * 'choice' is one of `options`, picked from cards.
   */
  type: 'text' | 'date' | 'time' | 'url' | 'textarea' | 'image' | 'video' | 'gallery' | 'choice'
  options?: TemplateFieldOption[]
  /** Left out of the form while the field `key` holds `is` (a choice that makes this one moot). */
  hideWhen?: { key: string; is: string }
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
