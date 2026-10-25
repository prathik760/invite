// Strip HTML tags from a string value to prevent stored XSS.
// Safe for all text fields: URLs (mapsUrl, musicUrl) are left intact since they pass URL validation.
function stripHtml(value: unknown): unknown {
  if (typeof value !== 'string') return value
  return value.replace(/<[^>]*>/g, '').trim()
}

/** An invitation's details as they are stored: every text value with HTML removed. Used when publishing and when editing. */
export function sanitizeData(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, stripHtml(v)]))
}
