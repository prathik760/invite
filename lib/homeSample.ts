import { TEMPLATES } from '@/modules/templates/data'
import { withSampleDates } from '@/lib/sampleData'

/**
 * The homepage's showcase invitation, one source for every place it appears:
 * the hero phone and its WhatsApp chats (components/homepage/HeroPhone), the
 * walkthrough, the live sample (/demo/<id>/sample, TryInvitation) and the
 * link-preview card (public/templates/phone/share-rajwada.jpg).
 *
 * Demo pages count their dates from today, so they move every week. The
 * showcase cannot: its screenshots (public/landing/rj-*, edit-*, msg-*) and
 * its preview card carry the date. So its dates are counted from one fixed
 * day, FROM, which puts the wedding on Saturday 19 December 2026, the date in
 * those pictures. To move the showcase on, change FROM and retake them.
 *
 * Server only: it reads the whole template catalogue. Client components get
 * the few strings they need as props.
 */
export const HOME_SAMPLE_ID = 'signature-rajwada'
const FROM = new Date(2026, 10, 3, 12)

/**
 * The sample's song: an original instrumental made for ShareInvite (Raag
 * Bhupali, santoor-style strings over a tanpura drone, manjira and dholak),
 * synthesised from scratch, so it carries no third-party rights.
 */
export const HOME_SAMPLE_MUSIC = '/templates/rajwada/bhupali-santoor.mp3'

export interface HomeSample {
  templateId: string
  data: Record<string, string>
  /** "Aditi & Kabir" */
  couple: string
  /** The link as a chat shows it, "shareinvite.in/e/aditi-kabir". */
  link: string
  music: string
}

export function homeSample(): HomeSample {
  const template = TEMPLATES.find((t) => t.id === HOME_SAMPLE_ID)
  if (!template) throw new Error(`homeSample: no template ${HOME_SAMPLE_ID}`)
  const data = withSampleDates(HOME_SAMPLE_ID, template.config.defaultData, FROM)
  const bride = data.brideName || 'Aditi'
  const groom = data.groomName || 'Kabir'
  return {
    templateId: HOME_SAMPLE_ID,
    data,
    couple: `${bride} & ${groom}`,
    link: `shareinvite.in/e/${`${bride}-${groom}`.toLowerCase().replace(/[^a-z0-9-]/g, '')}`,
    music: HOME_SAMPLE_MUSIC,
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** The builder fields as the walkthrough shows them before any edit ("19 Dec 2026", "6:30 PM"). */
export function homeSampleFields(sample: HomeSample = homeSample()) {
  const d = sample.data
  const [y, m, day] = (d.date || '').split('-').map(Number)
  const [h, min] = (d.time || '').split(':').map(Number)
  return {
    bride: d.brideName || '',
    groom: d.groomName || '',
    date: y ? `${day} ${MONTHS[m - 1]} ${y}` : '',
    time: Number.isFinite(h) ? `${((h + 11) % 12) + 1}:${String(min || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` : '',
    venue: d.venue || '',
    message: d.message || '',
  }
}
