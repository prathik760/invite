export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'date' | 'time' | 'url' | 'textarea'
  required?: boolean
  placeholder?: string
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
