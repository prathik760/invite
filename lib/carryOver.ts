import type { TemplateConfig } from '@/types'
import { HIDE_KEY, WISHES, hiddenSet } from '@/lib/hiddenParts'
import { NAME_ORDER_KEY } from '@/lib/nameOrder'

type TemplateLike = { config: TemplateConfig }

/**
 * The same piece of information stored under different keys by different
 * templates. Deliberately conservative: only pairs that mean the same thing to
 * the person filling the form. A wrong mapping is worse than none — it puts a
 * value into a field the user never chose it for.
 */
const ALIASES: string[][] = [
  ['brideName', 'partner1Name'],
  ['groomName', 'partner2Name'],
  ['bridePhoto', 'partner1Photo'],
  ['groomPhoto', 'partner2Photo'],
  ['celebrantName', 'recipientName'],
  ['hostNames', 'parentNames'],
]

function aliasesOf(key: string): string[] {
  return ALIASES.find((group) => group.includes(key))?.filter((k) => k !== key) ?? []
}

/**
 * Data for `next` when the user switches away from `prev` mid-edit.
 *
 * Starts from the new template's own sample data, then copies across every
 * value the user actually typed — "typed" meaning non-empty and different from
 * `prev`'s sample value. Untouched sample text ("Emily & James") is not carried,
 * so switching before editing anything still shows each design's own example.
 *
 * Without this, choosing a different design silently discarded everything the
 * user had entered, which made comparing designs with real names impossible.
 */
export function carryOverDetails(
  prev: TemplateLike | undefined,
  prevData: Record<string, string>,
  next: TemplateLike,
): Record<string, string> {
  // The builder's form holds only what was typed (sample text lives in the
  // preview), so a switch starts the new design empty too.
  const out: Record<string, string> = {}
  if (!prev) return out

  const prevDefaults = prev.config.defaultData
  const typed = (key: string) => {
    const v = prevData[key]
    return typeof v === 'string' && v.trim() !== '' && v !== (prevDefaults[key] ?? '')
  }

  const nextKeys = new Set(next.config.fields.map((f) => f.key))
  // A choice carries only to a design that offers the same option (a pink dinosaur's "pink" to the
  // pink galaxy, never to a design with no pink).
  const choices = new Map(next.config.fields.filter((f) => f.type === 'choice').map((f) => [f.key, new Set((f.options ?? []).map((o) => o.value))]))
  nextKeys.forEach((key) => {
    const source = [key, ...aliasesOf(key)].find(typed)
    if (!source) return
    if (choices.has(key) && !choices.get(key)!.has(prevData[source])) return
    out[key] = prevData[source]
  })

  // Wedding and engagement designs store two names; the anniversary design
  // stores one combined field. Join them rather than lose them.
  if (nextKeys.has('coupleNames') && !typed('coupleNames')) {
    const a = ['brideName', 'partner1Name'].find(typed)
    const b = ['groomName', 'partner2Name'].find(typed)
    if (a && b) out.coupleNames = `${prevData[a]} & ${prevData[b]}`
  }

  // What the host removed stays removed in the new design, where it has the same part.
  const removed = Array.from(hiddenSet(prevData)).filter((k) => k === WISHES || nextKeys.has(k))
  if (removed.length) out[HIDE_KEY] = removed.sort().join(',')
  // Whose name comes first stays the host's choice in any design with both names.
  if (prevData[NAME_ORDER_KEY] && nextKeys.has('brideName') && nextKeys.has('groomName')) out[NAME_ORDER_KEY] = prevData[NAME_ORDER_KEY]

  return out
}
