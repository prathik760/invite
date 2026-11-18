import { seasonAt } from '@/lib/season'

/**
 * The editor's selection: the designs ShareInvite leads with, a mix of
 * occasions and prices, most striking first. A curated choice, not a
 * popularity or sales ranking, and never labelled as one. The homepage's
 * collection and the Templates page's "Recommended" order both start here;
 * every other design follows in catalogue order.
 *
 * The eighth place is the season's design (lib/season.ts): New Year's Eve until
 * 31 December, the Valentine's confession letter until 14 February. Read it
 * while rendering, not at import, so a page rebuilt on a new season shows it.
 */
const PICKS = [
  'signature-two-worlds', 'signature-royal-edit', 'haldi-mehendi', 'signature-rajwada', 'sangeet-night',
  'birthday-mirrorball', 'signature-aquarelle', null, 'baby-shower',
  'signature-saptapadi', 'indian-birthday', 'birthday-gala', 'dasara-ambari',
  'first-birthday', 'christmas-evergreen', 'signature-nikah', 'signature-kalyanam',
] as const

export function editorsPicks(at: Date = new Date()): string[] {
  const seasonal = seasonAt(at).featured
  return Array.from(new Set(PICKS.map((id) => id ?? seasonal)))
}
