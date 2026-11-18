/**
 * Parts of an invitation its host removed in the builder ("Remove" on a box or a section, or the
 * guest wishes switch), kept in the invitation's own data as a comma list under HIDE_KEY, so a
 * draft, a published invitation reopened for editing and a design switch all remember them.
 *
 * A removed field is published blank (app/create toPublish), and every design already leaves out
 * whatever is blank. So removing needs no change in the designs: it stops the builder's preview
 * filling the box with sample text, and keeps what the host had typed out of the live page.
 * WISHES is the one part that is not a field: TemplateRenderer withholds the invitation's id, which
 * is what every design shows its wishes wall (and the menu link to it) for.
 */
export const HIDE_KEY = '_hide'
export const WISHES = 'wishes'

export function hiddenSet(data: Record<string, string> | undefined | null): Set<string> {
  const raw = data?.[HIDE_KEY]
  return new Set(typeof raw === 'string' ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [])
}

/** `data` with `keys` removed (hide) or added back, as one new object. */
export function withHidden(data: Record<string, string>, keys: string[], hide: boolean): Record<string, string> {
  const set = hiddenSet(data)
  for (const k of keys) {
    if (hide) set.add(k)
    else set.delete(k)
  }
  const next = { ...data }
  if (set.size) next[HIDE_KEY] = Array.from(set).sort().join(',')
  else delete next[HIDE_KEY]
  return next
}

/** What a design is given: every removed field blank. The data itself is left as it was. */
export function blankHidden(data: Record<string, string>): Record<string, string> {
  const set = hiddenSet(data)
  if (!set.size) return data
  const out = { ...data }
  for (const k of Array.from(set)) if (k !== WISHES && k in out) out[k] = ''
  return out
}
