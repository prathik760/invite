/**
 * The season's slots, switched by date (India time), so nobody has to remember to change them:
 *
 *   New Year      15 Nov – 31 Dec   the New Year's Eve design and its messages
 *   Valentine's    1 Jan – 14 Feb   the confession letters and the Valentine's Day post
 *   otherwise                      the slots as they were before 15 Nov 2026 (Diwali), and no
 *                                  seasonal boost in the sitemap
 *
 * Where each slot shows: the sitemap's top entries (app/sitemap.ts), one place in the editor's
 * selection that opens the home page's collection and the Templates page (lib/editorsPicks.ts), and
 * the seasonal sentence on the home page (components/pages/HomePage.tsx). The festival and love
 * covers and the closing fan's card feed components/home/OccasionIndex.tsx and ClosingFan.tsx, which
 * no page uses at present.
 *
 * Those pages are static, so the date is read when they are built. On the first day of a season the
 * daily job at /api/cron/season rebuilds the English ones (vercel.json) without waiting for a
 * deploy; the translated ones follow at the next deploy (see that route for why).
 */

export type SeasonKey = 'newyear' | 'valentine' | 'default'

export interface Season {
  key: SeasonKey
  /** The design given the sitemap's top place, or null. */
  templateId: string | null
  /** The post given the sitemap's top place, or null. */
  blogSlug: string | null
  /** The home page's festival tile. */
  festivalCover: string
  /** The home page's love tile. */
  loveCover: string
  /** The closing fan's fourth card, and the seasonal place in the editor's selection. */
  featured: string
}

const DEFAULT: Season = {
  key: 'default',
  templateId: null,
  blogSlug: null,
  festivalCover: 'diwali-party',
  loveCover: 'greeting-love',
  featured: 'diwali-party',
}

/** Inclusive "MM-DD" windows; none crosses the new year. */
const SEASONS: { from: string; to: string; season: Season }[] = [
  {
    from: '11-15',
    to: '12-31',
    season: {
      key: 'newyear',
      templateId: 'newyear-midnight',
      blogSlug: 'new-year-party-invitation-message-new-years-eve-invitation-wording',
      festivalCover: 'newyear-midnight',
      loveCover: 'greeting-love',
      featured: 'newyear-midnight',
    },
  },
  {
    from: '01-01',
    to: '02-14',
    season: {
      key: 'valentine',
      templateId: 'confession-for-her',
      blogSlug: 'valentines-day-card-online-send-a-3d-animated-valentine-on-whatsapp',
      festivalCover: 'diwali-party',
      loveCover: 'confession-for-her',
      featured: 'confession-for-her',
    },
  },
]

const IST_OFFSET_MS = 330 * 60 * 1000

/** "MM-DD" of the day in India at `at`. */
function indiaMonthDay(at: Date): string {
  const d = new Date(at.getTime() + IST_OFFSET_MS)
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

export function seasonAt(at: Date = new Date()): Season {
  const md = indiaMonthDay(at)
  return SEASONS.find((x) => md >= x.from && md <= x.to)?.season ?? DEFAULT
}

/** Whether the season changed within the last `hours`: the daily job's cue to rebuild. */
export function seasonChangedWithin(hours: number, at: Date = new Date()): boolean {
  return seasonAt(at).key !== seasonAt(new Date(at.getTime() - hours * 60 * 60 * 1000)).key
}
