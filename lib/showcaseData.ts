import { TEMPLATES } from '@/modules/templates/data'

/**
 * The full showcase for a design's live demo (/demo/<id>, and /demo/<id>/embed, which the live
 * preview and the design pages frame): every feature the design has, on show with sample content,
 * so a customer sees exactly what they would be buying. Photos of people, music, Google Maps
 * directions, RSVP, livestream and registry links, galleries and the remaining text.
 *
 * Only for showing a design. Nothing here reaches a real invitation: the builder starts blank and
 * publishes only what the host typed (app/create). A field is filled only when the design has it
 * and its sample left it empty; choices that change how a design looks (its opening, palette, hero
 * artwork) are never touched.
 *
 * Sources: photos are Unsplash images already used by the designs' own sample galleries, some
 * cropped to one person with Unsplash's focal-point crop; the songs are ShareInvite's own
 * (lib/homeSample.ts: original, no third-party rights); phone numbers are from ranges reserved for
 * fiction (Ofcom 07700 900xxx), so a demo RSVP can never reach a real phone; other links use
 * example.com, which is reserved for examples.
 */

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=75`
const crop = (id: string, x: number, y: number, z: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=focalpoint&fp-x=${x}&fp-y=${y}&fp-z=${z}&w=720&h=900&q=75`

const P = {
  brideIndian: crop('photo-1610276347233-2ab70fc71da8', 0.5, 0.45, 1.4),
  groomIndian: crop('photo-1611106211090-8f3c79eb8552', 0.36, 0.3, 2),
  groomWhiteSafa: crop('photo-1722952934661-dde241aeb591', 0.72, 0.3, 2.2),
  groomPinkSafa: crop('photo-1722953544597-57a8ba8eed44', 0.66, 0.3, 2.4),
  brideNikah: crop('photo-1675700478065-a1db5fa80292', 0.5, 0.35, 1.2),
  coupleIndian: crop('photo-1583878544470-6279e18a3947', 0.5, 0.4, 1),
  coupleIndianFull: photo('photo-1722953544597-57a8ba8eed44'),
  coupleNikah: photo('photo-1549474864-049a3b475a46'),
  brideWestern: crop('photo-1683538827719-4b24d6b69e35', 0.62, 0.45, 3),
  groomWestern: crop('photo-1683538827719-4b24d6b69e35', 0.36, 0.4, 3.2),
  coupleWestern: photo('photo-1683538827719-4b24d6b69e35'),
  coupleOlder: photo('photo-1537735319956-df7db4b6a4e9'),
  womanIndian: crop('photo-1703044412297-166a93480d1f', 0.5, 0.4, 1.3),
  womanWestern: crop('photo-1637782993379-a769478d32f9', 0.38, 0.28, 2),
  child: photo('photo-1504437484202-613bb51ce359'),
  baby: photo('photo-1583086762675-5a88bcc72548'),
  motherToBe: photo('photo-1555961064-4bc7ec634bbc'),
  family: photo('photo-1657912230172-23f8b31665ed'),
  honoree: photo('photo-1768508950778-3f6909b1fa13'),
}

/** A cover photo for each greeting, matched to what it says. */
const GREETING_PHOTO: Record<string, string> = {
  'greeting-love': photo('photo-1543932927-a9def13a0e7c'),
  'greeting-valentine': photo('photo-1637782993379-a769478d32f9'),
  'greeting-anniversary': photo('photo-1537735319956-df7db4b6a4e9'),
  'greeting-propose': photo('photo-1559006864-38a01f201f95'),
  'greeting-promise': photo('photo-1529519195486-16945f0fb37f'),
  'greeting-sorry': photo('photo-1637700941836-1d37c56e5615'),
  'greeting-congratulations': photo('photo-1699730164892-d7c433524ff3'),
  'greeting-festival': photo('photo-1659907521212-8bbdfa688aa6'),
  'greeting-family': photo('photo-1657912230172-23f8b31665ed'),
  'greeting-friendship': photo('photo-1516589091380-5d8e87df6999'),
}

const PARTY = ['photo-1631857455684-a54a2f03665f', 'photo-1699730164892-d7c433524ff3', 'photo-1577998474517-7eeeed4e448a', 'photo-1530103862676-de8c9debad1d'].map(photo).join('\n')
const GALA = ['photo-1768851142407-c663a54d70b8', 'photo-1630845253085-71dbb7d9762e', 'photo-1631397831385-b6023fd545ac', 'photo-1504196606672-aef5c9cefc92'].map(photo).join('\n')
const DASARA = ['photo-1667670651830-2d5bcd0e4f8f', 'photo-1699764681875-dd04ce36b1c3', 'photo-1662264636515-fc932f5061f4', 'photo-1702505433756-88130191bb4b'].map(photo).join('\n')

const SANTOOR = '/templates/rajwada/bhupali-santoor.mp3'
const WALTZ = '/templates/two-worlds/our-song.mp3'
/** Designs set outside India, or modern: the waltz. The rest: the santoor. */
const WESTERN = new Set([
  'elegant-wedding', 'signature-garden', 'save-the-date', 'christmas-evergreen', 'newyear-midnight',
  'birthday-mirrorball', 'birthday-martini', 'birthday-champagne', 'birthday-long-lunch', 'birthday-gala',
  'greeting-love', 'greeting-valentine', 'greeting-propose', 'greeting-promise', 'greeting-sorry', 'greeting-congratulations', 'greeting-friendship',
])

/** Numbers reserved for fiction (Ofcom 07700 900xxx), one per design. */
const RSVP_NUMBER: Record<string, string> = {
  'signature-saptapadi': '+44 7700 900493',
  'signature-nikah': '+44 7700 900504',
  'signature-garden': '+44 7700 900526',
  'luxury-wedding': '+44 7700 900537',
}

const TEXT: Record<string, Record<string, string>> = {
  'luxury-wedding': { brideFamily: 'Ramesh & Sunita Sharma\nUncle Vijay & Aunt Meera', groomFamily: 'Suresh & Kavita Verma\nUncle Anand & Aunt Rekha' },
  'signature-nikah': { hashtag: '#AyeshaWedsImran' },
  'signature-garden': { invocation: 'Love is patient, love is kind', blessings: 'Margaret & Peter Hale\nElena & Marco Rossi', destination: 'Lake Como' },
  'signature-aquarelle': { invocation: 'With love, and the blessings of our families' },
  'signature-two-worlds': { blessings: 'Grandmother Halyna\nDadi Kamla' },
  'signature-royal-edit': { blessings: 'Smt. Kamala Rao\nShri Venkatesh Rao' },
  'birthday-mirrorball': { invitedBy: 'Sam & the girls', guestNote: 'It’s a surprise. Arrive by 8:45 and keep it quiet!' },
  'birthday-martini': { invitedBy: 'Theo & friends' },
  'birthday-champagne': { guestNote: 'Carriages at midnight. Taxis are booked from 11:30.' },
  'birthday-long-lunch': { invitedBy: 'Luca & the family' },
}

function minusDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const t = new Date(y, m - 1, d - n, 12)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

export function withShowcase(templateId: string, data: Record<string, string>): Record<string, string> {
  const t = TEMPLATES.find((x) => x.id === templateId)
  if (!t) return data
  const keys = new Set(t.config.fields.map((f) => f.key))
  const out = { ...data }
  const set = (k: string, v: string | undefined) => {
    if (v && keys.has(k) && !String(out[k] ?? '').trim()) out[k] = v
  }

  // People.
  const western = templateId === 'elegant-wedding' || templateId === 'signature-garden'
  const nikah = templateId === 'signature-nikah'
  set('bridePhoto', western || templateId === 'signature-two-worlds' ? P.brideWestern : nikah ? P.brideNikah : P.brideIndian)
  set('groomPhoto', western ? P.groomWestern : nikah ? P.groomWhiteSafa : templateId === 'signature-two-worlds' ? P.groomPinkSafa : P.groomIndian)
  set('couplePhoto', templateId === 'anniversary' ? P.coupleOlder : western || templateId === 'signature-two-worlds' ? P.coupleWestern : nikah ? P.coupleNikah : templateId === 'signature-aquarelle' ? P.coupleIndianFull : P.coupleIndian)
  set('partner1Photo', P.brideIndian)
  set('partner2Photo', P.groomIndian)
  set('celebrantPhoto', templateId === 'first-birthday' ? P.child : templateId === 'indian-birthday' ? P.womanIndian : P.womanWestern)
  set('babyPhoto', P.baby)
  set('motherPhoto', P.motherToBe)
  set('hostPhoto', P.family)
  set('familyPhoto', templateId === 'christmas-evergreen' ? P.coupleOlder : P.family)
  set('honoreePhoto', P.honoree)
  set('photo', GREETING_PHOTO[templateId])

  // Photos, music, directions.
  set('galleryImages', templateId === 'dasara-ambari' ? DASARA : templateId === 'birthday-gala' ? GALA : templateId.startsWith('birthday-') ? PARTY : undefined)
  set('musicUrl', WESTERN.has(templateId) ? WALTZ : SANTOOR)
  const where = [out.venue, out.venueAddress || out.address, out.city].map((s) => (s || '').trim()).filter(Boolean).join(', ')
  if (where) set('mapsUrl', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}`)

  // Replies and links.
  set('whatsappNumber', RSVP_NUMBER[templateId])
  if (out.whatsappNumber && out.date) set('rsvpBy', minusDays(out.date, 16))
  set('livestreamUrl', 'https://www.example.com/live')
  set('registryUrl', 'https://www.example.com/registry')
  set('websiteUrl', 'https://www.example.com')

  // Words the sample left out.
  for (const [k, v] of Object.entries(TEXT[templateId] ?? {})) set(k, v)

  return out
}
