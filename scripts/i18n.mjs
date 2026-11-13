#!/usr/bin/env node
/**
 * The Indian-language dictionaries (content/i18n/<lang>.json, keyed by the English sentence).
 *
 *   node scripts/i18n.mjs keys      Write content/i18n/keys.json: every sentence the site asks to
 *                                   translate, from the code (t('…') / tr('…') calls) plus those
 *                                   captured from rendered pages (content/i18n/collected.json).
 *   node scripts/i18n.mjs status    Per language: translated, missing, and problems (a {placeholder}
 *                                   lost or added, an em dash, a stale key).
 *   node scripts/i18n.mjs chrome    Write content/i18n/chrome.json: the few sentences of the offer
 *                                   bar, offer popup, WhatsApp bubble and language banner, which sit
 *                                   outside the translated pages' provider.
 *   node scripts/i18n.mjs missing <lang> [file]   The untranslated keys of one language, as JSON.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const DIR = path.join(ROOT, 'content/i18n')
const LANGS = ['hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu']
const SCAN = ['app', 'components', 'lib']
const CHROME_FILES = ['components/marketing/PromoBar.tsx', 'components/marketing/ScrollPromo.tsx', 'components/WhatsAppButton.tsx', 'components/i18n/LocaleSuggestion.tsx', 'lib/promo.ts']

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'))
const write = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 2) + '\n')

function files(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) files(p, out)
    else if (/\.(tsx?|mjs)$/.test(e.name)) out.push(p)
  }
  return out
}

/** Literal sentences passed to t( / tr( in one file. */
function literals(src) {
  const out = new Set()
  const re = /\b(?:t|tr)\(\s*(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g
  let m
  while ((m = re.exec(src))) {
    const key = m[2].replace(/\\(['"\\])/g, '$1')
    // content/translations uses dotted keys (t('nav.create', locale)): not sentences.
    if (/^[a-z]+(\.[a-zA-Z]+)+$/.test(key) || !key.trim()) continue
    out.add(key)
  }
  return out
}

function codeKeys() {
  const all = new Set()
  for (const d of SCAN) for (const f of files(path.join(ROOT, d))) for (const k of literals(fs.readFileSync(f, 'utf8'))) all.add(k)
  return all
}

const placeholders = (s) => (s.match(/\{\w+\}/g) || []).sort().join(',')

const cmd = process.argv[2]
if (cmd === 'keys') {
  const keys = codeKeys()
  const collectedFile = path.join(DIR, 'collected.json')
  const collected = fs.existsSync(collectedFile) ? read(collectedFile) : []
  for (const k of collected) keys.add(k)
  const list = [...keys].sort((a, b) => a.localeCompare(b))
  write(path.join(DIR, 'keys.json'), list)
  console.log(`${list.length} sentences (${collected.length} captured from pages)`)
  // The ones client components can ask for (lib/dictionaries clientDictionary): literals in client
  // files, and what capture mode saw them render (⟪…⟫, pw/i18n-collect → client-collected.json).
  const client = new Set()
  for (const d of SCAN) for (const f of files(path.join(ROOT, d))) {
    const src = fs.readFileSync(f, 'utf8')
    if (/^['"]use client['"]/m.test(src) || /\buseT\(/.test(src)) for (const k of literals(src)) client.add(k)
  }
  const clientFile = path.join(DIR, 'client-collected.json')
  for (const k of fs.existsSync(clientFile) ? read(clientFile) : []) client.add(k)
  write(path.join(DIR, 'client-keys.json'), [...client].sort((a, b) => a.localeCompare(b)))
  console.log(`${client.size} of them used by client components`)
} else if (cmd === 'status') {
  const keys = read(path.join(DIR, 'keys.json'))
  const set = new Set(keys)
  for (const l of LANGS) {
    const d = read(path.join(DIR, `${l}.json`))
    const done = keys.filter((k) => d[k])
    const bad = Object.entries(d).filter(([k, v]) => placeholders(k) !== placeholders(v) || /—/.test(v))
    const stale = Object.keys(d).filter((k) => !set.has(k))
    console.log(`${l}: ${done.length}/${keys.length} translated, ${keys.length - done.length} missing, ${bad.length} problems, ${stale.length} stale`)
    for (const [k, v] of bad.slice(0, 5)) console.log(`   problem: ${k.slice(0, 60)} → ${v.slice(0, 60)}`)
  }
} else if (cmd === 'chrome') {
  const keys = new Set()
  for (const f of CHROME_FILES) for (const k of literals(fs.readFileSync(path.join(ROOT, f), 'utf8'))) keys.add(k)
  // lib/promo.ts holds the offer's own words as plain strings (copy.eyebrow…): take every string there.
  const promo = fs.readFileSync(path.join(ROOT, 'lib/promo.ts'), 'utf8')
  for (const m of promo.matchAll(/^\s+(?:eyebrow|headline|body|cta|imageAlt|short|long): '((?:\\.|[^'\\])*)'/gm)) keys.add(m[1].replace(/\\'/g, "'"))
  for (const m of promo.matchAll(/features: \[([^\]]*)\]/g)) for (const f of m[1].matchAll(/'((?:\\.|[^'\\])*)'/g)) keys.add(f[1])
  const out = {}
  for (const l of LANGS) {
    const d = read(path.join(DIR, `${l}.json`))
    out[l] = Object.fromEntries([...keys].filter((k) => d[k]).map((k) => [k, d[k]]))
  }
  write(path.join(DIR, 'chrome.json'), out)
  console.log(`chrome: ${keys.size} sentences; ${LANGS.map((l) => `${l} ${Object.keys(out[l]).length}`).join(', ')}`)
} else if (cmd === 'missing') {
  const l = process.argv[3]
  const keys = read(path.join(DIR, 'keys.json'))
  const d = read(path.join(DIR, `${l}.json`))
  const miss = keys.filter((k) => !d[k])
  const outFile = process.argv[4]
  if (outFile) write(outFile, miss)
  else console.log(JSON.stringify(miss, null, 2))
  console.error(`${l}: ${miss.length} missing`)
} else {
  console.log('usage: node scripts/i18n.mjs keys | status | chrome | missing <lang> [file]')
}
