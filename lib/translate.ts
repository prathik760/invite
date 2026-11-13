import { Fragment, createElement, type ReactNode } from 'react'

/**
 * Translation, shared by server and client. A dictionary maps the English sentence to its
 * translation (content/i18n/<lang>.json), so English needs no dictionary and anything not yet
 * translated simply stays in English.
 *
 * `{name}` in a sentence is replaced from `vars`: t('From {price}', { price: '₹99' }).
 */
export type Dict = Record<string, string>
export type Vars = Record<string, string | number>
export type T = (english: string, vars?: Vars) => string

export function fill(s: string, vars?: Vars): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}

/**
 * Capture mode, for building the dictionaries only (scripts/i18n.mjs collect): with
 * NEXT_PUBLIC_I18N_MARK=1, every sentence a translated page asks for comes back as ⟦sentence⟧,
 * so the rendered pages list exactly what needs translating, including sentences built from data
 * (occasion names, design descriptions). Never set in a real build.
 */
const MARK = process.env.NEXT_PUBLIC_I18N_MARK === '1'

/** Capture marks: server components ⟦…⟧, client components ⟪…⟫ (those are the sentences the browser needs). */
export const SERVER_MARK: [string, string] = ['⟦', '⟧']
export const CLIENT_MARK: [string, string] = ['⟪', '⟫']

export function translator(dict: Dict | null | undefined, mark: [string, string] = SERVER_MARK): T {
  if (MARK && dict) return (english) => `${mark[0]}${english}${mark[1]}`
  return (english, vars) => fill((dict && dict[english]) || english, vars)
}

/**
 * A translated sentence with parts that are elements (links, prices, emphasis):
 * rich(t('Read the {faq}.'), { faq: <Link …>FAQ</Link> }). Translate the sentence first, then the
 * parts, so each language can put them where its grammar needs.
 */
export function rich(translated: string, parts: Record<string, ReactNode>): ReactNode {
  const out: ReactNode[] = []
  let last = 0
  translated.replace(/\{(\w+)\}/g, (m, k: string, at: number) => {
    out.push(translated.slice(last, at))
    out.push(k in parts ? createElement(Fragment, { key: `${k}-${at}` }, parts[k]) : m)
    last = at + m.length
    return m
  })
  out.push(translated.slice(last))
  return createElement(Fragment, null, ...out)
}

/** A list in the reader's language: "a, b and c". `and` is the translated word. */
export function joinList(items: string[], and: string): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`
}
