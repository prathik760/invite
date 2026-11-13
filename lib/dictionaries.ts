import type { Dict } from '@/lib/translate'
import hi from '@/content/i18n/hi.json'
import ta from '@/content/i18n/ta.json'
import te from '@/content/i18n/te.json'
import kn from '@/content/i18n/kn.json'
import ml from '@/content/i18n/ml.json'
import mr from '@/content/i18n/mr.json'
import bn from '@/content/i18n/bn.json'
import gu from '@/content/i18n/gu.json'
import CLIENT_KEYS from '@/content/i18n/client-keys.json'

/** The Indian-language dictionaries. Server only: client components receive theirs from I18nProvider. */
const DICTS: Record<string, Dict> = { hi, ta, te, kn, ml, mr, bn, gu }

export function dictionary(lang: string): Dict | null {
  return DICTS[lang] ?? null
}

/**
 * What a translated page sends to the browser (I18nProvider): only the sentences client components
 * ask for, listed in content/i18n/client-keys.json by `node scripts/i18n.mjs keys`. Everything else
 * is translated on the server and arrives as HTML, so pages do not carry the whole dictionary.
 */
const CLIENT = new Set<string>(CLIENT_KEYS as string[])
const CLIENT_DICTS = new Map<string, Dict>()

export function clientDictionary(lang: string): Dict | null {
  const d = DICTS[lang]
  if (!d) return null
  let c = CLIENT_DICTS.get(lang)
  if (!c) {
    c = Object.fromEntries(Object.entries(d).filter(([k]) => CLIENT.has(k)))
    CLIENT_DICTS.set(lang, c)
  }
  return c
}
