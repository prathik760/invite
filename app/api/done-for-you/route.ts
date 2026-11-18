import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTemplateData } from '@/modules/templates/data'
import { displayName } from '@/lib/catalog'
import { templatePrice } from '@/lib/plans'
import { getAppUrl } from '@/lib/utils'
import { isDeliverable, sendLater, sendMail } from '@/lib/mail'
import { SUPPORT_EMAIL } from '@/lib/support'
import { cleanAnswers, newToken, refOf, type DfyRecord } from '@/lib/doneForYou'
import { DFY_PREFIX, dfyQuestions, isRowField, waDigits } from '@/lib/doneForYouShared'

/**
 * POST /api/done-for-you: a customer asks the team to fill in a design (components/create/DoneForYouForm).
 * Saves the request (lib/doneForYou.ts), emails the team, and answers with the request's reference.
 *
 * No account needed: this is for people who would rather not use the builder. Kept small against
 * abuse: a hidden box a person never fills, at most 3 requests an hour from one number and 30 an
 * hour in all, and only the design's own boxes are stored.
 */

const HOUR = 60 * 60 * 1000
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  // The hidden "website" box: only a bot fills it. Answer as if it worked.
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true, ref: 'THANKS' })

  const templateId = typeof body.templateId === 'string' ? body.templateId : ''
  const template = getTemplateData(templateId)
  if (!template) return NextResponse.json({ error: 'Please choose a design first.' }, { status: 400 })

  const contact = (body.contact && typeof body.contact === 'object' ? body.contact : {}) as Record<string, unknown>
  const name = typeof contact.name === 'string' ? contact.name.trim().slice(0, 80) : ''
  const phone = waDigits(typeof contact.phone === 'string' ? contact.phone : '')
  const emailRaw = typeof contact.email === 'string' ? contact.email.trim().slice(0, 120) : ''
  const email = emailRaw && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailRaw) ? emailRaw : ''
  if (!name) return NextResponse.json({ error: 'Please tell us your name.' }, { status: 400 })
  if (!phone) return NextResponse.json({ error: 'Please give your WhatsApp number, with the country code if you are outside India.' }, { status: 400 })
  if (emailRaw && !email) return NextResponse.json({ error: 'Please check your email address.' }, { status: 400 })

  const answers = cleanAnswers(templateId, body.fields, body.extras)
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 3000) : ''
  if (!answers || (!Object.keys(answers.fields).length && !Object.keys(answers.extras).length && !notes)) {
    return NextResponse.json({ error: 'Please fill in at least a few details for the invitation.' }, { status: 400 })
  }

  try {
    const since = new Date(Date.now() - HOUR)
    const [fromNumber, overall] = await Promise.all([
      prisma.event.count({ where: { slug: { startsWith: DFY_PREFIX }, createdAt: { gte: since }, data: { path: ['contact', 'phone'], equals: phone } } }),
      prisma.event.count({ where: { slug: { startsWith: DFY_PREFIX }, createdAt: { gte: since } } }),
    ])
    if (fromNumber >= 3 || overall >= 30) {
      return NextResponse.json({ error: 'We already have your request. We will message you on WhatsApp soon.' }, { status: 429 })
    }

    await prisma.template.upsert({
      where: { id: templateId },
      update: {},
      create: { id: templateId, name: template.name, previewImage: '', config: template.config as object },
    })

    const token = newToken()
    const record: DfyRecord = {
      kind: 'done-for-you',
      ref: refOf(token),
      teamKey: newToken(),
      status: 'new',
      contact: { name, phone, ...(email ? { email } : {}) },
      fields: answers.fields,
      extras: answers.extras,
      notes,
      submittedAt: new Date().toISOString(),
    }
    await prisma.event.create({ data: { slug: `${DFY_PREFIX}${token}`, templateId, data: record as object, isPaid: false } })

    sendLater(() => sendMail(teamEmail(record, templateId)))
    return NextResponse.json({ ok: true, ref: record.ref }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/done-for-you]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Something went wrong. Please message us on WhatsApp instead.' }, { status: 500 })
  }
}

/** To the team: who, which design, every answer, and where to pick it up. */
function teamEmail(r: DfyRecord, templateId: string) {
  const t = getTemplateData(templateId)!
  const design = `${displayName(t.name)} (₹${templatePrice(templateId).toLocaleString('en-IN')})`
  const app = getAppUrl().replace(/\/$/, '')
  const rows: [string, string][] = []
  for (const f of dfyQuestions(t.config.fields)) {
    const v = isRowField(f) ? r.extras[f.key] : r.fields[f.key]
    if (v) rows.push([f.label, v])
  }
  if (r.notes) rows.push(['Anything else', r.notes])
  const wa = `https://wa.me/${r.contact.phone}`
  const text = [
    `Done-for-you request #${r.ref}: ${design}`,
    `${r.contact.name}, WhatsApp +${r.contact.phone}${r.contact.email ? `, ${r.contact.email}` : ''}`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    `Open it in the builder from ${app}/admin/done-for-you`,
    `WhatsApp them: ${wa}`,
  ].join('\n')
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;color:#1E2726">
<h2 style="font-size:18px;margin:0 0 4px">Done-for-you request #${esc(r.ref)}</h2>
<p style="margin:0 0 12px">${esc(design)}</p>
<p style="margin:0 0 12px"><strong>${esc(r.contact.name)}</strong> · <a href="${wa}">WhatsApp +${esc(r.contact.phone)}</a>${r.contact.email ? ` · ${esc(r.contact.email)}` : ''}</p>
<table style="border-collapse:collapse;width:100%">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 10px 6px 0;vertical-align:top;color:#7A6E68;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table>
<p style="margin:16px 0 0"><a href="${app}/admin/done-for-you" style="background:#0B4A34;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:700">Open the request</a></p>
<p style="margin:12px 0 0;color:#7A6E68;font-size:12px">Photos usually follow on WhatsApp. Fill it in from the admin page, save it for the customer, then send them the link.</p>
</div>`
  return { to: isDeliverable(SUPPORT_EMAIL) ? SUPPORT_EMAIL : '', subject: `New done-for-you request #${r.ref}: ${displayName(t.name)} for ${r.contact.name}`, html, text }
}
