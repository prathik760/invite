import type { TemplateConfig } from '@/types'

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
  nextKeys.forEach((key) => {
    const source = [key, ...aliasesOf(key)].find(typed)
    if (source) out[key] = prevData[source]
  })

  // Wedding and engagement designs store two names; the anniversary design
  // stores one combined field. Join them rather than lose them.
  if (nextKeys.has('coupleNames') && !typed('coupleNames')) {
    const a = ['brideName', 'partner1Name'].find(typed)
    const b = ['groomName', 'partner2Name'].find(typed)
    if (a && b) out.coupleNames = `${prevData[a]} & ${prevData[b]}`
  }

  return out
}
