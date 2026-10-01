import Image from 'next/image'
import Link from 'next/link'
import Logo, { LogoMark } from '@/components/brand/Logo'
import { templateImage } from '@/lib/templateMedia'
import { formatTemplatePrice } from '@/lib/plans'

// ─── Template recommendation data ────────────────────────────────────────────
// Pick 3 recs per original category: same-category first, then cross-sell
const RECS_BY_CATEGORY: Record<string, string[]> = {
  wedding:      ['cinematic-night', 'indian-wedding', 'indian-birthday'],
  engagement:   ['elegant-wedding', 'cinematic-night', 'indian-birthday'],
  birthday:     ['indian-birthday', 'elegant-wedding', 'indian-engagement'],
  housewarming: ['griha-pravesh', 'elegant-wedding', 'indian-birthday'],
  naming:       ['namakaran', 'elegant-wedding', 'indian-birthday'],
  anniversary:  ['anniversary', 'cinematic-night', 'elegant-wedding'],
  movie:        ['kgf-wedding', 'cinematic-night', 'indian-wedding'],
  retro:        ['royal-deco', 'kgf-wedding', 'cinematic-night'],
  ganeshchaturthi: ['ganesh-chaturthi', 'rakshabandhan', 'elegant-wedding'],
}

interface TemplateCard {
  id: string
  name: string
  tagline: string
  gradient: string
  accent: string
  rgb: string
}

const TEMPLATE_CARDS: Record<string, TemplateCard> = {
  'elegant-wedding':  { id: 'elegant-wedding',  name: 'Elegant Wedding',          tagline: 'Timeless ivory & gold',        gradient: 'linear-gradient(135deg,#2C1810,#5C3420)', accent: '#D9A441', rgb: '217,164,65' },
  'cinematic-night':  { id: 'cinematic-night',  name: 'Cinematic Night',           tagline: 'Dark luxury wedding',          gradient: 'linear-gradient(135deg,#0A0A1A,#1A1A3A)', accent: '#818CF8', rgb: '129,140,248' },
  'indian-wedding':   { id: 'indian-wedding',   name: 'Shaadi',                    tagline: 'Rich Indian ceremony',         gradient: 'linear-gradient(135deg,#1A0000,#3A0808)', accent: '#E2A735', rgb: '226,167,53' },
  'indian-engagement':{ id: 'indian-engagement',name: 'Mangni',                    tagline: 'Romantic engagement',          gradient: 'linear-gradient(135deg,#1A0010,#3A0025)', accent: '#F48FB1', rgb: '244,143,177' },
  'indian-birthday':  { id: 'indian-birthday',  name: 'Janamdin',                  tagline: 'Festive birthday',             gradient: 'linear-gradient(135deg,#1A0500,#3A1000)', accent: '#FF8C00', rgb: '255,140,0' },
  'griha-pravesh':    { id: 'griha-pravesh',     name: 'Griha Pravesh',             tagline: 'Auspicious housewarming',      gradient: 'linear-gradient(135deg,#0F0500,#2A1000)', accent: '#FFB300', rgb: '255,179,0' },
  'namakaran':        { id: 'namakaran',         name: 'Namakaran',                 tagline: 'Celestial naming ceremony',    gradient: 'linear-gradient(135deg,#040F22,#0A1E44)', accent: '#4FC3F7', rgb: '79,195,247' },
  'kgf-wedding':      { id: 'kgf-wedding',       name: 'KGF Royal Empire',          tagline: 'Cinematic blockbuster style',  gradient: 'linear-gradient(135deg,#0A0500,#1A0A00)', accent: '#D4A017', rgb: '212,160,23' },
  'royal-deco':       { id: 'royal-deco',        name: 'Royal Deco',                tagline: 'Art Deco palace edition',      gradient: 'linear-gradient(135deg,#03060F,#060B1E)', accent: '#BFA060', rgb: '191,160,96' },
  'anniversary':      { id: 'anniversary',       name: 'Saalgirah',                 tagline: 'Cinematic anniversary',        gradient: 'linear-gradient(135deg,#0A0008,#180012)', accent: '#CE93D8', rgb: '206,147,216' },
  'luxury-wedding':   { id: 'luxury-wedding',    name: 'Luxury Wedding',            tagline: 'Premium multi-function',       gradient: 'linear-gradient(135deg,#1C1008,#2E1A0A)', accent: '#C9A84C', rgb: '201,168,76' },
  'ganesh-chaturthi': { id: 'ganesh-chaturthi',  name: 'Ganesh Chaturthi Premium',  tagline: 'Saffron & gold Ganeshotsav',   gradient: 'linear-gradient(135deg,#3A1206,#6E2A08)', accent: '#E4761B', rgb: '228,118,27' },
  'rakshabandhan':    { id: 'rakshabandhan',     name: 'Raksha Bandhan Premium',    tagline: 'Cream & gold festive',         gradient: 'linear-gradient(135deg,#2E1218,#4E1A28)', accent: '#C24E68', rgb: '194,78,104' },
}

// ─── Category lookup ──────────────────────────────────────────────────────────
const TEMPLATE_CATEGORY: Record<string, string> = {
  'elegant-wedding': 'wedding', 'cinematic-night': 'wedding',
  'indian-wedding': 'wedding',  'luxury-wedding': 'wedding',
  'kgf-wedding': 'movie',       'royal-deco': 'retro',
  'indian-engagement': 'engagement', 'indian-birthday': 'birthday',
  'griha-pravesh': 'housewarming',   'namakaran': 'naming',
  'anniversary': 'anniversary',
  'ganesh-chaturthi': 'ganeshchaturthi',
}

const CATEGORY_LABEL: Record<string, string> = {
  wedding: 'weddings', engagement: 'engagements', birthday: 'birthdays',
  housewarming: 'housewarming ceremonies', naming: 'naming ceremonies',
  anniversary: 'anniversaries', movie: 'cinematic weddings', retro: 'royal weddings',
  ganeshchaturthi: 'Ganesh Chaturthi celebrations',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRecommendations(originalTemplateId: string): TemplateCard[] {
  const category = TEMPLATE_CATEGORY[originalTemplateId] ?? 'wedding'
  const ids = (RECS_BY_CATEGORY[category] ?? RECS_BY_CATEGORY['wedding'])
    .filter(id => id !== originalTemplateId)
    .slice(0, 3)
  return ids.map(id => TEMPLATE_CARDS[id]).filter(Boolean)
}

function getEventLabel(data: Record<string, string>, templateId: string): string {
  if (data.brideName && data.groomName) return `${data.brideName} & ${data.groomName}`
  if (data.partner1Name && data.partner2Name) return `${data.partner1Name} & ${data.partner2Name}`
  if (data.celebrantName) return `${data.celebrantName}'s Birthday`
  if (data.coupleNames) return `${data.coupleNames}'s Anniversary`
  // hostNames is shared with Griha Pravesh, so the occasion has to come from
  // the template rather than the field alone.
  if (templateId === 'ganesh-chaturthi') return data.hostNames ? `${data.hostNames}'s Ganesh Utsav` : 'This Ganesh Utsav'
  if (data.hostNames) return `${data.hostNames}'s Griha Pravesh`
  if (data.babyName) return `Namakaran of ${data.babyName}`
  const category = TEMPLATE_CATEGORY[templateId] ?? 'celebration'
  return `This ${category}`
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year) return dateStr
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────
interface ExpiredInvitationProps {
  templateId: string
  data: Record<string, string>
  /** ISO date the invitation, its wishes and photos are deleted (lib/retention.ts). */
  deletesOn?: string
}

export default function ExpiredInvitation({ templateId, data, deletesOn }: ExpiredInvitationProps) {
  const eventLabel = getEventLabel(data, templateId)
  const category = TEMPLATE_CATEGORY[templateId] ?? 'wedding'
  const categoryLabel = CATEGORY_LABEL[category] ?? 'celebrations'
  const recommendations = getRecommendations(templateId)
  const dateFormatted = data.date ? formatDate(data.date) : null

  return (
    <div className="flex min-h-screen flex-col bg-champagne text-charcoal">
      {/* Header */}
      <header className="border-b border-line bg-champagne/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" aria-label="ShareInvite home"><Logo markClassName="h-8 w-8" /></Link>
          <Link href="/create" className="btn-outline rounded-full px-4 py-2 text-[0.82rem] font-semibold">
            Create yours
          </Link>
        </div>
      </header>

      {/* Expired message */}
      <section className="relative overflow-hidden px-5 pb-12 pt-16 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(232,200,102,0.2),transparent_70%)]" />
        <div className="relative mx-auto max-w-lg">
          <LogoMark className="mx-auto h-14 w-14" />
          <p className="eyebrow mt-6">This celebration has taken place</p>
          <h1 className="t-h1 mt-3">Thank you for being part of it</h1>
          <p className="mt-4 text-[0.98rem] leading-7 text-charcoal/70">
            <strong className="font-semibold text-charcoal">{eventLabel}</strong>
            {dateFormatted && <> · {dateFormatted}</>}
            <br />
            Invitation links close a few days after the event
            {deletesOn
              ? <>, and the invitation, its photos and wishes are deleted on {new Date(deletesOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.</>
              : '.'}
          </p>
        </div>
      </section>

      {/* Template recommendations */}
      <section className="border-t border-line bg-paper px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-center">Planning a celebration?</p>
          <p className="t-h3 mt-2 text-center">A beautiful invitation for your next {categoryLabel}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {recommendations.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/create?template=${tpl.id}`}
                className="lift group flex flex-col overflow-hidden rounded-3xl border border-line bg-champagne"
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-peach">
                  <Image src={templateImage(tpl.id)} alt="" fill sizes="(max-width: 640px) 100vw, 220px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute right-3 top-3 rounded-full bg-charcoal/85 px-2.5 py-1 text-[0.75rem] font-bold text-paper">
                    {formatTemplatePrice(tpl.id)}
                  </span>
                </span>
                <span className="block px-4 py-3.5">
                  <span className="block truncate font-editorial text-[1.25rem] font-semibold leading-tight">{tpl.name}</span>
                  <span className="mt-0.5 block truncate text-[0.78rem] text-muted">{tpl.tagline}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/create" className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[0.95rem] font-semibold sm:w-auto">
              Start your invitation
            </Link>
            <Link href="/templates" className="btn-outline inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-[0.95rem] font-semibold sm:w-auto">
              Browse designs
            </Link>
          </div>
          <p className="mt-5 text-center text-[0.8rem] text-muted">
            Preview before you pay · One price per design, paid once · Share via WhatsApp
          </p>
        </div>
      </section>
    </div>
  )
}
