/**
 * Sample dates for places that *show* a design with its default content — the
 * demo pages, the design picker and the preview modal. Default data leaves
 * dates empty so nobody publishes a date they didn't choose; without one, a
 * showcase would hide the date layout and the countdown, which are the parts
 * people most want to see.
 */

function isoInDays(days: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + days)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** A Saturday about eight and a half months out — when a save-the-date is usually sent. */
function saturdayInMonths(): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + 260 + ((6 - ((d.getDay() + 260) % 7)) + 7) % 7)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** The first Saturday at least `days` from today. */
function saturdayInDays(days: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + days)
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Numbers reserved for fiction (Ofcom 07700 900xxx, NANP 555-01xx, ACMA 0491 570xxx), so a
// showcase RSVP can never reach a real phone.
const SAMPLE_RSVP: Record<string, string> = {
  'birthday-mirrorball': '+44 7700 900461',
  'birthday-martini': '+1 212 555 0148',
  'birthday-champagne': '+61 491 570 156',
  'birthday-long-lunch': '+1 310 555 0172',
  'birthday-gala': '+44 7700 900218',
}

/** Navaratri 2026 begins 11 October; Ayudha Puja 19, Vijayadashami 20, Jamboo Savari 21. */
const DASARA_2026 = { navaratri: '2026-10-11', main: '2026-10-20', last: '2026-10-21', days: ['2026-10-11', '2026-10-19', '2026-10-20', '2026-10-21'] }

/** yyyy-mm-dd plus `n` days. */
function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const t = new Date(y, m - 1, d + n, 12)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

export function withSampleDates(templateId: string, data: Record<string, string>): Record<string, string> {
  const out = { ...data }
  if (templateId === 'save-the-date') {
    if (!out.date) out.date = saturdayInMonths()
    // Showcases get a snapshot on the card. It is not in the design's default
    // data, so nobody publishes a stranger's photo by not noticing it.
    if (!out.couplePhoto) out.couplePhoto = 'https://images.unsplash.com/photo-1637782993379-a769478d32f9?auto=format&fit=crop&w=600&q=75'
  }
  if (templateId.startsWith('birthday-')) {
    // A party is on a Saturday. Showcases also get a reply-by date and an RSVP
    // number, so the RSVP is on show; neither is in the default data, so no
    // host publishes a stranger's phone number by not noticing it.
    if (!out.date) out.date = saturdayInDays(40)
    if (!out.rsvpBy) out.rsvpBy = isoInDays(26)
    if (!out.rsvpPhone && !out.rsvpEmail) out.rsvpPhone = SAMPLE_RSVP[templateId] ?? '+44 7700 900461'
  }
  if (templateId === 'birthday-gala') {
    // The weekend is laid out around the main night: earlier parts the days before, later ones after.
    const rows = (out.events || '').split('\n').filter((l) => l.trim())
    const main = Math.max(0, rows.findIndex((l) => /dinner|party|gala|birthday|main/i.test(l.split('|')[0])))
    out.events = rows
      .map((line, i) => {
        const cells = line.split('|').map((c) => c.trim())
        while (cells.length < 6) cells.push('')
        if (!cells[1]) cells[1] = addDays(out.date, i - main)
        return cells.join(' | ')
      })
      .join('\n')
  }
  if (templateId === 'dasara-ambari') {
    // The real 2026 dates while they are ahead; after that the same weekdays
    // 52 weeks on, so the countdown and the colour of the day keep working.
    let shift = 0
    while (addDays(DASARA_2026.last, shift) < isoInDays(0)) shift += 364
    if (!out.date) out.date = addDays(DASARA_2026.main, shift)
    if (!out.navratriStart) out.navratriStart = addDays(DASARA_2026.navaratri, shift)
    out.days = (out.days || '')
      .split('\n')
      .filter((l) => l.trim())
      .map((line, i) => {
        const cells = line.split('|').map((c) => c.trim())
        while (cells.length < 4) cells.push('')
        if (!cells[1] && DASARA_2026.days[i]) cells[1] = addDays(DASARA_2026.days[i], shift)
        return cells.join(' | ')
      })
      .join('\n')
    if (!out.rsvpPhone && !out.rsvpEmail) out.rsvpEmail = 'ananya.rao@example.com'
  }
  if (templateId === 'christmas-evergreen') {
    // Christmas Eve, this year's while it is ahead.
    const t = new Date()
    const year = t.getMonth() === 11 && t.getDate() > 24 ? t.getFullYear() + 1 : t.getFullYear()
    if (!out.date) out.date = `${year}-12-24`
    if (!out.rsvpBy) out.rsvpBy = `${year}-12-10` < isoInDays(0) ? '' : `${year}-12-10`
    if (!out.rsvpPhone && !out.rsvpEmail) out.rsvpPhone = '+44 7700 900634'
  }
  if (templateId === 'newyear-midnight') {
    const year = new Date().getFullYear()
    if (!out.date) out.date = `${year}-12-31`
    if (!out.rsvpBy) out.rsvpBy = `${year}-12-20` < isoInDays(0) ? '' : `${year}-12-20`
    if (!out.rsvpPhone && !out.rsvpEmail) out.rsvpPhone = '+1 212 555 0186'
  }
  if (!out.date) out.date = isoInDays(46)
  if (templateId === 'luxury-wedding') {
    if (!out.haldiDate) out.haldiDate = isoInDays(44)
    if (!out.mehendiDate) out.mehendiDate = isoInDays(44)
    if (!out.sangeetDate) out.sangeetDate = isoInDays(45)
    if (!out.receptionDate) out.receptionDate = isoInDays(47)
  }
  if (templateId === 'ganesh-chaturthi' && !out.visarjanDate) out.visarjanDate = isoInDays(56)
  if (templateId === 'haldi-mehendi' && !out.mehendiDate) out.mehendiDate = out.date
  if (templateId.startsWith('signature-')) {
    // Functions without a date are laid out around the wedding day, in the
    // order the host listed them: earlier rows before it, the last after.
    const rows = (out.events || '').split('\n').filter((l) => l.trim())
    const main = rows.findIndex((l) => /pheras|muhurtham|nikah|ceremony|wedding/i.test(l.split('|')[0]))
    const pivot = main === -1 ? rows.length - 1 : main
    out.events = rows
      .map((line, i) => {
        const cells = line.split('|').map((c) => c.trim())
        while (cells.length < 5) cells.push('')
        if (!cells[1]) cells[1] = isoInDays(46 + (i < pivot ? -Math.max(1, Math.ceil((pivot - i) / 2)) : i - pivot))
        return cells.join(' | ')
      })
      .join('\n')
    // Aquarelle's RSVP card is part of the show; a number reserved for fiction keeps it on view.
    if (templateId === 'signature-aquarelle' && !out.whatsappNumber) out.whatsappNumber = '+44 7700 900372'
    // A reply-by date only means something alongside a way to reply.
    if (!out.rsvpBy && out.whatsappNumber) out.rsvpBy = isoInDays(30)
  }
  return out
}
