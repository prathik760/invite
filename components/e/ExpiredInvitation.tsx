import Link from 'next/link'

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
}

interface TemplateCard {
  id: string
  name: string
  tagline: string
  planLabel: string
  price: string
  gradient: string
  accent: string
  rgb: string
}

const TEMPLATE_CARDS: Record<string, TemplateCard> = {
  'elegant-wedding':  { id: 'elegant-wedding',  name: 'Elegant Wedding',          tagline: 'Timeless ivory & gold',        planLabel: 'Free',    price: '₹0',   gradient: 'linear-gradient(135deg,#2C1810,#5C3420)', accent: '#D9A441', rgb: '217,164,65' },
  'cinematic-night':  { id: 'cinematic-night',  name: 'Cinematic Night',           tagline: 'Dark luxury wedding',          planLabel: 'Starter', price: '₹299', gradient: 'linear-gradient(135deg,#0A0A1A,#1A1A3A)', accent: '#818CF8', rgb: '129,140,248' },
  'indian-wedding':   { id: 'indian-wedding',   name: 'Shaadi',                    tagline: 'Rich Indian ceremony',         planLabel: 'Pro',     price: '₹599', gradient: 'linear-gradient(135deg,#1A0000,#3A0808)', accent: '#E2A735', rgb: '226,167,53' },
  'indian-engagement':{ id: 'indian-engagement',name: 'Mangni',                    tagline: 'Romantic engagement',          planLabel: 'Pro',     price: '₹599', gradient: 'linear-gradient(135deg,#1A0010,#3A0025)', accent: '#F48FB1', rgb: '244,143,177' },
  'indian-birthday':  { id: 'indian-birthday',  name: 'Janamdin',                  tagline: 'Festive birthday',             planLabel: 'Starter', price: '₹299', gradient: 'linear-gradient(135deg,#1A0500,#3A1000)', accent: '#FF8C00', rgb: '255,140,0' },
  'griha-pravesh':    { id: 'griha-pravesh',     name: 'Griha Pravesh',             tagline: 'Auspicious housewarming',      planLabel: 'Pro',     price: '₹599', gradient: 'linear-gradient(135deg,#0F0500,#2A1000)', accent: '#FFB300', rgb: '255,179,0' },
  'namakaran':        { id: 'namakaran',         name: 'Namakaran',                 tagline: 'Celestial naming ceremony',    planLabel: 'Starter', price: '₹299', gradient: 'linear-gradient(135deg,#040F22,#0A1E44)', accent: '#4FC3F7', rgb: '79,195,247' },
  'kgf-wedding':      { id: 'kgf-wedding',       name: 'KGF Royal Empire',          tagline: 'Cinematic blockbuster style',  planLabel: 'All Access', price: '₹999', gradient: 'linear-gradient(135deg,#0A0500,#1A0A00)', accent: '#D4A017', rgb: '212,160,23' },
  'royal-deco':       { id: 'royal-deco',        name: 'Royal Deco',                tagline: 'Art Deco palace edition',      planLabel: 'All Access', price: '₹999', gradient: 'linear-gradient(135deg,#03060F,#060B1E)', accent: '#BFA060', rgb: '191,160,96' },
  'anniversary':      { id: 'anniversary',       name: 'Saalgirah',                 tagline: 'Cinematic anniversary',        planLabel: 'All Access', price: '₹999', gradient: 'linear-gradient(135deg,#0A0008,#180012)', accent: '#CE93D8', rgb: '206,147,216' },
  'luxury-wedding':   { id: 'luxury-wedding',    name: 'Luxury Wedding',            tagline: 'Premium multi-function',       planLabel: 'All Access', price: '₹999', gradient: 'linear-gradient(135deg,#1C1008,#2E1A0A)', accent: '#C9A84C', rgb: '201,168,76' },
}

// ─── Category lookup ──────────────────────────────────────────────────────────
const TEMPLATE_CATEGORY: Record<string, string> = {
  'elegant-wedding': 'wedding', 'cinematic-night': 'wedding',
  'indian-wedding': 'wedding',  'luxury-wedding': 'wedding',
  'kgf-wedding': 'movie',       'royal-deco': 'retro',
  'indian-engagement': 'engagement', 'indian-birthday': 'birthday',
  'griha-pravesh': 'housewarming',   'namakaran': 'naming',
  'anniversary': 'anniversary',
}

const CATEGORY_LABEL: Record<string, string> = {
  wedding: 'weddings', engagement: 'engagements', birthday: 'birthdays',
  housewarming: 'housewarming ceremonies', naming: 'naming ceremonies',
  anniversary: 'anniversaries', movie: 'cinematic weddings', retro: 'royal weddings',
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
}

export default function ExpiredInvitation({ templateId, data }: ExpiredInvitationProps) {
  const eventLabel = getEventLabel(data, templateId)
  const category = TEMPLATE_CATEGORY[templateId] ?? 'wedding'
  const categoryLabel = CATEGORY_LABEL[category] ?? 'celebrations'
  const recommendations = getRecommendations(templateId)
  const dateFormatted = data.date ? formatDate(data.date) : null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5F0' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#E8DCCD] bg-white/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="110" height="28" />
        </Link>
        <Link
          href="/create"
          className="text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          style={{ background: 'rgba(184,138,68,0.12)', color: '#B87924', border: '1px solid rgba(184,138,68,0.25)' }}
        >
          Create yours →
        </Link>
      </header>

      {/* Expired message */}
      <section className="flex flex-col items-center text-center px-5 pt-14 pb-12">
        {/* Soft hourglass icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(184,138,68,0.10)', border: '1px solid rgba(184,138,68,0.20)' }}>
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#B87924" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-3" style={{ color: '#B87924' }}>
          Invitation expired
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1A17] mb-2 max-w-sm leading-snug">
          This celebration has taken place
        </h1>
        <p className="text-sm text-[#706861] max-w-xs leading-6">
          <strong className="font-semibold text-[#2C201C]">{eventLabel}</strong>
          {dateFormatted && <> · {dateFormatted}</>}
          <br />
          Invitation links expire a few days after the event.
        </p>

        {/* Divider */}
        <div className="mt-10 flex items-center gap-4 w-full max-w-sm">
          <div className="flex-1 h-px bg-[#E8DCCD]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B0A090]">
            Planning a celebration?
          </span>
          <div className="flex-1 h-px bg-[#E8DCCD]" />
        </div>
      </section>

      {/* Template recommendations */}
      <section className="px-5 pb-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm text-[#706861] mb-6">
            Create a beautiful digital invitation for your next {categoryLabel} — free in 5 minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {recommendations.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/create?template=${tpl.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1"
                style={{ border: '1px solid rgba(44,32,28,0.10)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Swatch */}
                <div
                  className="relative h-[90px] flex flex-col items-center justify-center gap-1"
                  style={{ background: tpl.gradient }}
                >
                  <p className="text-[8px] uppercase tracking-[0.3em] font-semibold"
                    style={{ color: `rgba(${tpl.rgb},0.75)` }}>
                    shareinvite
                  </p>
                  <p className="font-bold text-[15px] italic"
                    style={{ color: '#fff' }}>
                    {tpl.name}
                  </p>
                  {/* Hover CTA */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                      Use this template →
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-3.5 py-3 bg-white flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#221B17] truncate">{tpl.name}</p>
                    <p className="text-[10px] text-[#706861] truncate">{tpl.tagline}</p>
                  </div>
                  <span
                    className="shrink-0 text-[9px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                    style={
                      tpl.planLabel === 'Free'
                        ? { background: 'rgba(47,118,109,0.12)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.22)' }
                        : tpl.planLabel === 'Starter'
                        ? { background: 'rgba(184,138,68,0.12)', color: '#B87924', border: '1px solid rgba(184,138,68,0.25)' }
                        : tpl.planLabel === 'Pro'
                        ? { background: 'rgba(47,118,109,0.10)', color: '#2F766D', border: '1px solid rgba(47,118,109,0.20)' }
                        : { background: 'rgba(201,168,76,0.14)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.30)' }
                    }
                  >
                    {tpl.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg,#B87924,#D9A441)',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(184,121,36,0.35)',
              }}
            >
              Create your own invitation — free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl text-sm font-semibold border text-[#2C201C] transition-colors hover:border-[#D9A441]/60 bg-white"
              style={{ borderColor: '#E8DCCD' }}
            >
              Browse all templates
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-5 text-center text-[11px] text-[#B0A090]">
            Free plan available · No credit card needed · Share via WhatsApp
          </p>
        </div>
      </section>
    </div>
  )
}
