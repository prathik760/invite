/**
 * Whose name a wedding invitation puts first. Families differ (the groom's side often writes the
 * groom first, the bride's side the bride), so the host chooses in the builder, kept in the
 * invitation's data as NAME_ORDER_KEY: 'bride' or 'groom'. Without a choice each design keeps the
 * order its artwork was drawn in.
 *
 * Designs flip only what names the couple together (the names on the cover, the monogram, the
 * footer, the calendar title) and the pairs that stand side by side (two portraits, two families).
 * A label that says who is who ("The bride", her parents) stays with that person. Share cards,
 * page titles and the link's address follow the same order (lib/inviteCardText.ts).
 */
export const NAME_ORDER_KEY = 'nameOrder'

/** Designs drawn with the groom first, which keep that order until the host chooses. */
const DESIGN_GROOM_FIRST = new Set(['signature-two-worlds', 'kgf-wedding', 'royal-deco'])

export function groomFirst(templateId: string | undefined, data?: Record<string, string> | null): boolean {
  const chosen = data?.[NAME_ORDER_KEY]
  if (chosen === 'groom') return true
  if (chosen === 'bride') return false
  return Boolean(templateId && DESIGN_GROOM_FIRST.has(templateId))
}

/** The bride's thing and the groom's thing, in the invitation's order. */
export function inOrder<T>(data: Record<string, string> | null | undefined, templateId: string, bride: T, groom: T): [T, T] {
  return groomFirst(templateId, data) ? [groom, bride] : [bride, groom]
}
