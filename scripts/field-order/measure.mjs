/**
 * Measures where every builder field shows on its design and writes
 * lib/fieldOrder.ts (the order of the builder's input boxes, and where the
 * preview scrolls for each one).
 *
 *   npm i --no-save playwright-core          # once
 *   npm run dev                              # in another terminal
 *   node scripts/field-order/measure.mjs     # all designs (or name some ids)
 *
 * Env: BASE_URL (default http://localhost:3000), CHROME_PATH (default: the
 * macOS Google Chrome). Results are cached in field-positions.json beside this
 * script; delete it to measure everything again.
 */
import { chromium } from 'playwright-core'
import { createRequire } from 'module'
import { writeFileSync, existsSync, readFileSync } from 'fs'
const require = createRequire(import.meta.url)
const ROOT = new URL('../../', import.meta.url).pathname
const TEMPLATES = (() => {
  // modules/templates/data.ts imports only types, so a plain transpile runs it.
  const ts = require(ROOT + 'node_modules/typescript')
  const src = readFileSync(ROOT + 'modules/templates/data.ts', 'utf8')
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  const m = { exports: {} }
  new Function('module', 'exports', 'require', js)(m, m.exports, (p) => { throw new Error('unexpected import ' + p) })
  return m.exports.TEMPLATES
})()
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const only = process.argv.slice(2)
const SKIP = (id) => id.startsWith('greeting-') || id === 'surprise-journey'
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const L = 'abcdefghijklmnopqrstuvwxyz'
const token = (i) => `zqx${L[Math.floor(i / 26)]}${L[i % 26]}`
const NUMERIC = { age: '47', years: '23' }

/** Marker data for a template, and how to find each field in the rendered page. */
function markers(tpl) {
  const data = {}, find = {}
  let t = 0, month = 0, minute = 0
  const nextDate = () => { const m = [6, 2, 7, 0, 1, 3, 4, 8, 9, 10, 11, 5][month++ % 12]; return { iso: `2031-${String(m + 1).padStart(2, '0')}-${String(10 + month).padStart(2, '0')}`, re: `\\b(${MONTHS[m]}|${MONTHS[m].slice(0, 3)})\\b` } }
  // minutes whose words are distinctive, so "at five eleven in the evening" is found too
  const MIN = [[11, 'eleven'], [13, 'thirteen'], [29, 'twenty-nine'], [31, 'thirty-one'], [37, 'thirty-seven'], [41, 'forty-one'], [53, 'fifty-three'], [59, 'fifty-nine']]
  const nextTime = () => { const [m, w] = MIN[minute++ % MIN.length]; return { v: `17:${m}`, re: `\\b5:${m}|17:${m}|five ${w}|${w} minutes past five` } }
  for (const f of tpl.config.fields) {
    const k = f.key
    if (NUMERIC[k]) { data[k] = NUMERIC[k]; find[k] = { text: `\\b${NUMERIC[k]}|forty-seven|twenty-three` }; continue }
    if (f.columns) {
      const cells = f.columns.map((c, ci) => {
        if (c.type === 'date') return nextDate().iso
        if (c.type === 'time') return nextTime().v
        if (c.type === 'tel') return '+44 7700 900' + (100 + t)
        return ci === 0 ? token(t++) : token(t++)
      })
      data[k] = cells.join(' | ')
      find[k] = { text: cells[0] }
      continue
    }
    if (k === 'schedule') { const tk = token(t++); data[k] = `${tk} - 6:00 PM`; find[k] = { text: tk }; continue }
    if (k === 'galleryImages') { data[k] = `/mk/gallery-a.jpg\n/mk/gallery-b.jpg`; find[k] = { attr: '/mk/gallery-' }; continue }
    switch (f.type) {
      case 'date': { const d = nextDate(); data[k] = d.iso; find[k] = { text: d.re }; break }
      case 'time': { const tm = nextTime(); data[k] = tm.v; find[k] = { text: tm.re }; break }
      case 'image': data[k] = `/mk/${k}.jpg`; find[k] = { attr: `/mk/${k}.jpg` }; break
      case 'url': data[k] = `https://mk.example/${k}`; find[k] = { attr: `mk.example/${k}` }; break
      default: {
        if (/phone|whatsapp|number/i.test(k)) { data[k] = '+44 7700 900' + (200 + t); find[k] = { attr: '447700900' + (200 + t), text: '7700 900' + (200 + t) }; t++; break }
        if (/email/i.test(k)) { const tk = token(t++); data[k] = `${tk}@example.com`; find[k] = { text: tk, attr: tk }; break }
        const tk = token(t++); data[k] = tk; find[k] = { text: tk }
      }
    }
  }
  return { data, find }
}

const measure = (page, find) => page.evaluate((find) => {
    const root = document.querySelector('section [data-clarity-mask]')
    if (!root) return { error: 'no preview' }
    const r0 = root.getBoundingClientRect()
    const height = Math.max(root.scrollHeight, r0.height)
    const out = {}
    const visible = (el) => { const r = el.getBoundingClientRect(); return (r.width > 0 || r.height > 0) ? r : null }
    const texts = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) { const n = walker.currentNode; if (n.nodeValue && n.nodeValue.trim()) texts.push(n) }
    const attrEls = [...root.querySelectorAll('[src], [href], [style], image')]
    for (const [key, how] of Object.entries(find)) {
      let best = null, via = ''
      if (how.text) {
        const re = new RegExp(how.text, 'i')
        for (const n of texts) {
          if (!re.test(n.nodeValue)) continue
          const r = n.parentElement && visible(n.parentElement)
          if (r && (best === null || r.top < best)) { best = r.top; via = 'text' }
        }
      }
      if (how.attr) {
        for (const el of attrEls) {
          const v = (el.getAttribute('src') || '') + ' ' + (el.getAttribute('href') || '') + ' ' + (el.getAttribute('style') || '') + ' ' + (el.getAttribute('xlink:href') || '')
          if (!v.includes(how.attr)) continue
          const r = visible(el)
          if (r && (best === null || r.top < best)) { best = r.top; via = 'attr' }
        }
      }
      out[key] = best === null ? null : { y: Math.round(best - r0.top), via }
    }
    return { height: Math.round(height), out }
}, find)

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const OUT = new URL('./field-positions.json', import.meta.url)
const results = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
for (const tpl of TEMPLATES) {
  if (SKIP(tpl.id) || (only.length && !only.includes(tpl.id)) || (!only.length && results[tpl.id])) continue
  const { data, find } = markers(tpl)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/terms`, { waitUntil: 'load', timeout: 240000 })
  await page.evaluate(([id, d]) => localStorage.setItem('invitely-draft', JSON.stringify({ templateId: id, data: d, step: 2 })), [tpl.id, data])
  await page.goto(`${BASE}/create`, { waitUntil: 'load', timeout: 240000 })
  await page.locator('section [data-clarity-mask]').first().waitFor({ timeout: 120000 }).catch(() => {})
  await page.waitForTimeout(3000)
  const before = await measure(page, find)
  // tap-to-open designs: open them first
  const opened = await page.evaluate(() => {
    const root = document.querySelector('section [data-clarity-mask]')
    if (!root) return 'no-root'
    const cands = [...root.querySelectorAll('button, [role="button"]')].filter((el) => /open|tap|turn it over|enter|unseal|break the seal/i.test((el.getAttribute('aria-label') || '') + ' ' + (el.textContent || '')))
    if (cands[0]) { cands[0].click(); return (cands[0].getAttribute('aria-label') || cands[0].textContent || '').trim().slice(0, 40) }
    return ''
  })
  if (opened && opened !== 'no-root') await page.waitForTimeout(4500)
  const after = await measure(page, find)
  const found = { height: after.height, out: { ...after.out } }
  // What a tap-to-open design shows before it opens is what guests see first.
  if (before && opened && opened !== 'no-root') {
    for (const [k, v] of Object.entries(before.out || {})) if (v) found.out[k] = { y: v.y - 100000, via: 'cover' }
  }
  const keys = tpl.config.fields.map((f) => f.key)
  const hit = keys.filter((k) => found.out?.[k])
  console.log(tpl.id.padEnd(22), `found ${hit.length}/${keys.length}`, opened ? `[opened: ${opened}]` : '', 'missing:', keys.filter((k) => !found.out?.[k]).join(','))
  results[tpl.id] = { height: found.height, fields: keys.map((k) => ({ key: k, ...(found.out?.[k] ?? { y: null }) })) }
  await ctx.close()
  writeFileSync(OUT, JSON.stringify(results, null, 1))
}
writeFileSync(new URL('./field-positions.json', import.meta.url), JSON.stringify(results, null, 1))
await browser.close()

// ── write lib/fieldOrder.ts ─────────────────────────────────────────────
const pos = results
const order = {}, position = {}
for (const [id, r] of Object.entries(pos).sort()) {
  const fields = r.fields
  // A field not seen on the page (a link, the music, an RSVP contact) goes right
  // after the field before it in the builder's own order.
  const ys = fields.map((f) => (typeof f.y === 'number' ? f.y : null))
  const filled = []
  ys.forEach((y, i) => {
    if (y !== null) { filled.push(y); return }
    // after the field before it (a map link follows its address)…
    const prev = filled.length ? filled[filled.length - 1] : null
    if (prev !== null) { filled.push(prev + 0.01); return }
    // …or, first in the list, just before the next one seen
    const next = ys.slice(i + 1).find((v) => v !== null)
    filled.push(next !== undefined ? next - 0.5 : Number.MAX_SAFE_INTEGER)
  })
  const sorted = fields.map((f, i) => ({ key: f.key, y: filled[i], i })).sort((a, b) => a.y - b.y || a.i - b.i)
  order[id] = sorted.map((s) => s.key)
  position[id] = Object.fromEntries(sorted.map((s) => [s.key, Math.max(0, Math.min(1, Math.round((Math.max(0, s.y) / r.height) * 1000) / 1000))]))
}
const banner = `/**
 * Where each builder field shows up on its design, top to bottom.
 *
 * GENERATED — do not edit by hand. Measured by scripts/field-order/measure.mjs:
 * every field of every design is filled with a unique marker, the design is
 * rendered in the builder's preview (tap-to-open designs are opened, and what
 * their cover shows counts as first), and the first place each marker appears
 * is recorded. Fields the page never shows as text (map and music links, RSVP
 * contacts) sit with their neighbours in the template's own field order.
 *
 * FIELD_ORDER sorts the builder's input boxes so they follow the design; a
 * design missing here keeps its field definition order. FIELD_POSITION is how
 * far down the page (0–1) each field appears, for the preview to follow along.
 * Re-run the script after adding a design or moving things in one.
 */
`
const body = `export const FIELD_ORDER: Record<string, readonly string[]> = ${JSON.stringify(order, null, 2)}\n\nexport const FIELD_POSITION: Record<string, Readonly<Record<string, number>>> = ${JSON.stringify(position, null, 2)}\n`
writeFileSync(ROOT + 'lib/fieldOrder.ts', banner + '\n' + body)
console.log(Object.keys(order).length, 'designs')
for (const id of ['elegant-wedding', 'birthday-mirrorball', 'signature-nikah', 'birthday-gala']) console.log(id, '→', order[id].join(', '))
