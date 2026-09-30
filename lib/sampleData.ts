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

export function withSampleDates(templateId: string, data: Record<string, string>): Record<string, string> {
  const out = { ...data }
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
    // A reply-by date only means something alongside a way to reply.
    if (!out.rsvpBy && out.whatsappNumber) out.rsvpBy = isoInDays(30)
  }
  return out
}
