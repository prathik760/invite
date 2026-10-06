import { SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_URL } from '@/lib/support'
import { ENDS_AFTER_DAYS } from '@/lib/retention'
import type { Mail } from '@/lib/mail'
import { templateImage } from '@/lib/templateMedia'

/*
 * The two emails a buyer gets: the receipt when the payment clears, and the
 * congratulations when their invitation goes live. Ivory paper, an emerald
 * band, gold rules and a serif, like the site. Tables and inline styles only,
 * because that is what Gmail, Outlook and Apple Mail all agree on.
 */

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

const C = {
  page: '#EFE7D8',
  paper: '#FBF6EC',
  line: '#E3D6BC',
  emerald: '#052E20',
  gold: '#B8913F',
  goldSoft: '#D9B566',
  ink: '#22201B',
  soft: '#5E574C',
  faint: '#8A8174',
}
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function button(href: string, label: string, tone: 'emerald' | 'gold' | 'whatsapp' = 'emerald'): string {
  const bg = tone === 'gold' ? C.gold : tone === 'whatsapp' ? '#1DA851' : C.emerald
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="border-radius:999px;background:${bg};">
<a href="${esc(href)}" target="_blank" style="display:inline-block;padding:14px 30px;font-family:${SANS};font-size:15px;font-weight:600;color:#FFFDF8;text-decoration:none;border-radius:999px;">${esc(label)}</a>
</td></tr></table>`
}

const rule = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:6px 0 2px;">
<span style="display:inline-block;width:56px;border-top:1px solid ${C.gold};vertical-align:middle;"></span>
<span style="display:inline-block;margin:0 10px;color:${C.gold};font-size:10px;vertical-align:middle;">&#9670;</span>
<span style="display:inline-block;width:56px;border-top:1px solid ${C.gold};vertical-align:middle;"></span>
</td></tr></table>`

function layout({ title, preheader, body }: { title: string; preheader: string; body: string }): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};"><tr><td align="center" style="padding:28px 12px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.paper};border:1px solid ${C.line};">
<tr><td align="center" style="background:${C.emerald};padding:28px 24px 24px;">
<div style="font-family:${SERIF};font-size:26px;letter-spacing:0.5px;color:#F4ECD8;">Share<span style="font-style:italic;color:${C.goldSoft};">Invite</span></div>
<div style="font-family:${SANS};font-size:10.5px;letter-spacing:3.5px;text-transform:uppercase;color:${C.goldSoft};margin-top:6px;">Beautifully invited</div>
</td></tr>
<tr><td style="height:3px;background:${C.gold};line-height:3px;font-size:0;">&nbsp;</td></tr>
<tr><td style="padding:40px 40px 34px;">${body}</td></tr>
<tr><td style="padding:22px 32px 28px;border-top:1px solid ${C.line};text-align:center;">
<p style="margin:0;font-family:${SANS};font-size:13px;line-height:20px;color:${C.soft};">Questions? Reply to this email, or WhatsApp us on <a href="${esc(SUPPORT_WHATSAPP_URL)}" style="color:${C.emerald};">${esc(SUPPORT_WHATSAPP_DISPLAY)}</a>.</p>
<p style="margin:10px 0 0;font-family:${SANS};font-size:12px;line-height:18px;color:${C.faint};"><a href="${APP_URL}" style="color:${C.faint};">shareinvite.in</a> &nbsp;·&nbsp; ${esc(SUPPORT_EMAIL)}</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

function kicker(text: string) {
  return `<p style="margin:0;text-align:center;font-family:${SANS};font-size:11.5px;letter-spacing:3.5px;text-transform:uppercase;color:${C.gold};">${esc(text)}</p>`
}

function heading(text: string) {
  return `<h1 style="margin:12px 0 0;text-align:center;font-family:${SERIF};font-weight:normal;font-size:32px;line-height:40px;color:${C.ink};">${esc(text)}</h1>`
}

function para(html: string, center = true) {
  return `<p style="margin:18px 0 0;${center ? 'text-align:center;' : ''}font-family:${SERIF};font-size:17px;line-height:27px;color:${C.soft};">${html}</p>`
}

function firstName(name?: string | null): string {
  return (name || '').trim().split(/\s+/)[0] || ''
}

/* ── The receipt ───────────────────────────────────────────────────── */

export interface ReceiptDetails {
  to: string
  name?: string | null
  designName?: string
  templateId?: string
  amount: string
  paymentId: string
  orderId: string
  paidAt: Date
}

export function paymentReceiptEmail(r: ReceiptDetails): Mail {
  const who = firstName(r.name)
  const when = r.paidAt.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST'
  const design = r.designName || 'your design'
  const image = r.templateId ? `${APP_URL}${templateImage(r.templateId)}` : ''
  const row = (k: string, v: string, last = false) =>
    `<tr><td style="padding:12px 0;${last ? '' : `border-bottom:1px solid ${C.line};`}font-family:${SANS};font-size:13px;letter-spacing:0.4px;color:${C.faint};">${esc(k)}</td><td align="right" style="padding:12px 0;${last ? '' : `border-bottom:1px solid ${C.line};`}font-family:${SANS};font-size:14px;color:${C.ink};">${v}</td></tr>`

  const body = `${kicker('Payment received')}
${heading(who ? `Thank you, ${who}.` : 'Thank you.')}
${para(`Your payment is confirmed and <strong style="color:${C.ink};font-weight:normal;font-style:italic;">${esc(design)}</strong> is yours. Keep this email as your receipt.`)}
${image ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 0 6px;"><img src="${esc(image)}" width="168" alt="${esc(design)}" style="display:block;width:168px;max-width:60%;height:auto;border:1px solid ${C.gold};padding:6px;background:#FFFFFF;"></td></tr></table>` : ''}
<div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
${rule}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
${row('Design', esc(design))}
${row('Amount paid', `<strong>${esc(r.amount)}</strong> &nbsp;<span style="color:${C.faint};font-size:12px;">one-time</span>`)}
${row('Date', esc(when))}
${row('Payment ID', `<span style="font-family:Menlo,Consolas,monospace;font-size:12.5px;">${esc(r.paymentId)}</span>`)}
${row('Order ID', `<span style="font-family:Menlo,Consolas,monospace;font-size:12.5px;">${esc(r.orderId)}</span>`, true)}
</table>
${para('Your invitation link will arrive in a separate email the moment it is published.')}`

  const text = [
    who ? `Thank you, ${who}.` : 'Thank you.',
    '',
    `Your payment is confirmed and ${design} is yours. Keep this email as your receipt.`,
    '',
    `Design: ${design}`,
    `Amount paid: ${r.amount} (one-time)`,
    `Date: ${when}`,
    `Payment ID: ${r.paymentId}`,
    `Order ID: ${r.orderId}`,
    '',
    'Your invitation link will arrive in a separate email the moment it is published.',
    '',
    `Questions? Reply to this email, or WhatsApp us on ${SUPPORT_WHATSAPP_DISPLAY}.`,
  ].join('\n')

  return {
    to: r.to,
    subject: `Payment received — ${design} is yours`,
    html: layout({ title: 'Payment received', preheader: `Receipt for ${r.amount} · ${design}`, body }),
    text,
  }
}

/* ── Congratulations: the invitation is live ───────────────────────── */

export interface LiveDetails {
  to: string
  name?: string | null
  slug: string
  /** "Bombe Habba & Dasara at home — Ananya & Karthik Rao" */
  title: string
  designName?: string
  dateLabel?: string
  /** Designs that greet a guest by name from a ?to= link. */
  personalLinks?: boolean
  example?: string
}

export function invitationLiveEmail(l: LiveDetails): Mail {
  const who = firstName(l.name)
  const url = `${APP_URL}/e/${l.slug}`
  const card = `${url}/opengraph-image`
  const wa = `https://wa.me/?text=${encodeURIComponent(`You're invited! ${l.title}\n${url}`)}`
  const tips = [
    'Send it to yourself first and open it on your phone — check the names, the date and the map.',
    l.personalLinks
      ? `Make it personal: add <span style="font-family:Menlo,Consolas,monospace;font-size:13px;color:${C.ink};">?to=${esc(l.example || 'Shalini+and+family')}</span> to the end of the link, and it greets that guest by name.`
      : '',
    'Guests can leave their wishes on the invitation, and everyone who opens it can read them.',
    l.dateLabel ? `It stays online until ${ENDS_AFTER_DAYS} days after the day, so latecomers can still find the address.` : '',
  ].filter(Boolean)

  const body = `${kicker('Your invitation is live')}
${heading(who ? `Congratulations, ${who}!` : 'Congratulations!')}
${para(`<em style="color:${C.ink};">${esc(l.title)}</em> is ready to share. This is what your guests will see when you send the link:`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:26px 0 0;">
<a href="${esc(url)}" target="_blank" style="text-decoration:none;"><img src="${esc(card)}" width="520" alt="${esc(l.title)}" style="display:block;width:100%;max-width:520px;height:auto;border:1px solid ${C.line};"></a>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;"><tr><td align="center" style="padding:14px 16px;background:#FFFFFF;border:1px dashed ${C.gold};">
<a href="${esc(url)}" target="_blank" style="font-family:Menlo,Consolas,monospace;font-size:14px;color:${C.emerald};text-decoration:none;word-break:break-all;">${esc(url.replace(/^https?:\/\//, ''))}</a>
</td></tr></table>
<div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
${button(url, 'Open your invitation')}
<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
${button(wa, 'Share on WhatsApp', 'whatsapp')}
<div style="height:30px;line-height:30px;font-size:0;">&nbsp;</div>
${rule}
<p style="margin:18px 0 0;text-align:center;font-family:${SANS};font-size:11.5px;letter-spacing:3px;text-transform:uppercase;color:${C.gold};">A few things worth knowing</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
${tips.map((t) => `<tr><td valign="top" style="padding:10px 12px 0 0;color:${C.gold};font-size:12px;">&#9670;</td><td style="padding:10px 0 0;font-family:${SERIF};font-size:16px;line-height:25px;color:${C.soft};">${t}</td></tr>`).join('\n')}
</table>
${para(`See all your invitations any time at <a href="${APP_URL}/dashboard" style="color:${C.emerald};">shareinvite.in/dashboard</a> — sign in with Google using this email address.`)}
${para(`With love,<br><span style="font-style:italic;color:${C.ink};">the ShareInvite team</span>`)}`

  const text = [
    who ? `Congratulations, ${who}!` : 'Congratulations!',
    '',
    `${l.title} is ready to share.`,
    '',
    `Your link: ${url}`,
    `Share on WhatsApp: ${wa}`,
    '',
    'A few things worth knowing:',
    ...tips.map((t) => `- ${t.replace(/<[^>]+>/g, '')}`),
    '',
    `See all your invitations at ${APP_URL}/dashboard — sign in with Google using this email address.`,
    '',
    'With love,',
    'the ShareInvite team',
  ].join('\n')

  return {
    to: l.to,
    subject: `Congratulations! Your invitation is live`,
    html: layout({ title: 'Your invitation is live', preheader: `${l.title} — your link is ready to share`, body }),
    text,
  }
}
