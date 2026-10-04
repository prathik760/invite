/**
 * What a shared invitation's link preview says: the occasion and whose it is.
 * The share card (lib/inviteCard.tsx) draws it, and the invitation page uses it
 * for the title shown under the picture. Kept apart from the card so the page
 * does not load the image renderer and its fonts to get one line of text.
 */

/** 21 -> "21st", 12 -> "12th" */
function ordinal(n: number): string {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

export interface Card {
  label: string
  names: [string] | [string, string]
  /** Small italic line under the names. */
  sub?: string
}

/** What the share card says: the occasion, and whose it is. Also the title of a shared link. */
export function cardFor(templateId: string, d: Record<string, string>): Card {
  const t = (v?: string) => (v || '').trim()
  const age = Number(t(d.age))
  const years = Number(t(d.years))
  if (templateId.startsWith('greeting-')) {
    return { label: t(d.headline) || 'A message for you', names: [`For ${t(d.recipientName) || 'you'}`], sub: t(d.senderName) ? `with love, ${t(d.senderName)}` : undefined }
  }
  if (templateId === 'surprise-journey') {
    return { label: t(d.occasion) || 'A surprise for you', names: [`For ${t(d.recipientName) || 'you'}`], sub: t(d.senderName) ? `from ${t(d.senderName)}` : undefined }
  }
  if (t(d.brideName) && t(d.groomName)) {
    const label = templateId === 'haldi-mehendi' ? 'Haldi & Mehendi'
      : templateId === 'sangeet-night' ? 'Sangeet'
      : templateId === 'signature-nikah' ? 'Nikah'
      : templateId === 'save-the-date' ? 'Save the date'
      : 'Wedding invitation'
    return { label, names: [t(d.brideName), t(d.groomName)] }
  }
  if (t(d.motherName)) return { label: 'Baby shower', names: [t(d.motherName)], sub: t(d.hostNames) ? `hosted by ${t(d.hostNames)}` : undefined }
  if (t(d.honoreeName)) return { label: 'Retirement celebration', names: [t(d.honoreeName)], sub: t(d.milestone) || undefined }
  if (t(d.poojaName)) return { label: t(d.poojaName), names: [t(d.hostNames) || 'You are invited'] }
  if (t(d.partner1Name) && t(d.partner2Name)) return { label: 'Engagement', names: [t(d.partner1Name), t(d.partner2Name)] }
  if (t(d.sisterName) && t(d.brotherName)) return { label: t(d.title) || 'Raksha Bandhan', names: [t(d.sisterName), t(d.brotherName)] }
  if (t(d.coupleNames)) {
    const parts = t(d.coupleNames).split(/\s*&\s*|\s+and\s+/i).filter(Boolean)
    const label = Number.isFinite(years) && years > 0 ? `${ordinal(years)} wedding anniversary` : 'Anniversary celebration'
    return parts.length === 2 ? { label, names: [parts[0], parts[1]] } : { label, names: [t(d.coupleNames)] }
  }
  if (t(d.celebrantName)) {
    return { label: Number.isFinite(age) && age > 0 ? `${ordinal(age)} birthday` : 'Birthday celebration', names: [t(d.celebrantName)] }
  }
  if (t(d.babyName)) return { label: 'Naming ceremony', names: [t(d.babyName)], sub: t(d.parentNames) ? `with ${t(d.parentNames)}` : undefined }
  if (templateId === 'ganesh-chaturthi') return { label: t(d.title) || 'Ganesh Chaturthi', names: [t(d.hostNames) || 'You are invited'] }
  if (templateId === 'diwali-party') return { label: t(d.title) || 'Diwali Milan', names: [t(d.hostNames) || 'You are invited'] }
  if (templateId === 'dasara-ambari') return { label: t(d.title) || 'Dasara', names: [t(d.hostNames) || 'You are invited'] }
  if (templateId === 'christmas-evergreen') return { label: t(d.title) || 'Christmas', names: [t(d.hostNames) || 'You are invited'] }
  if (templateId === 'newyear-midnight') return { label: t(d.title) || 'New Year’s Eve', names: [t(d.hostNames) || 'You are invited'] }
  if (templateId === 'eid-milan') return { label: t(d.title) || 'Eid Milan', names: [t(d.hostNames) || 'You are invited'] }
  if (t(d.hostNames)) return { label: 'Griha Pravesh', names: [t(d.hostNames)] }
  return { label: 'You are invited', names: ['You are invited'] }
}

/** The title of a published invitation: the browser tab, the bold line under a shared link's picture, the email. */
export function eventTitle(data: Record<string, string>, templateId?: string): string {
  if (templateId === 'save-the-date' && data.brideName && data.groomName) return `${data.brideName} & ${data.groomName} — Save the Date`
  if (data.headline && data.recipientName) return `${data.headline} — for ${data.recipientName}`
  if (data.recipientName) return `${data.occasion || 'A Surprise'} for ${data.recipientName} 🎁`
  if (data.brideName && data.groomName) return `${data.brideName} & ${data.groomName} — Wedding Invitation`
  if (data.partner1Name && data.partner2Name) return `${data.partner1Name} & ${data.partner2Name} — Engagement Invitation`
  if (data.celebrantName) {
    const age = Number((data.age || '').match(/^\s*(\d{1,3})/)?.[1])
    return `${data.celebrantName}'s ${age > 0 ? `${ordinal(age)} ` : ''}Birthday Celebration`
  }
  if (data.babyName) return `Namakaran of ${data.babyName}`
  if (data.coupleNames) return `${data.coupleNames}${data.years ? ` — ${data.years} Years` : ''} Anniversary`
  if (data.sisterName && data.brotherName) return `${data.sisterName} & ${data.brotherName} — Raksha Bandhan`
  // The festival, pooja, baby shower and retirement designs all name their
  // hosts. Every one of them used to fall through to "— Griha Pravesh", so a
  // Diwali party went out titled as a housewarming. They take their words from
  // the share card instead, so the title under the picture says what it says.
  if (templateId && templateId !== 'griha-pravesh') {
    const card = cardFor(templateId, data)
    if (card.label !== 'You are invited' && card.label !== 'Griha Pravesh') {
      const who = card.names.filter((n) => n !== 'You are invited').join(' & ')
      return who ? `${card.label} — ${who}` : card.label
    }
  }
  if (data.hostNames) return `${data.hostNames} — Griha Pravesh`
  return 'You are Invited'
}
