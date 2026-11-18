import { OCCASION_MAP } from '@/lib/catalog'
import { templateSeoSlug } from '@/lib/seo'

/**
 * Where the wedding campaign (lib/promo.ts PROMO: Rajwada, ROYAL20) is offered,
 * both the popup and the offer bar (15 Nov 2026): the home page, the catalogue,
 * the wedding pages and each wedding design's own page. It used to show on every
 * page, so people reading birthday messages were offered a palace wedding suite:
 * 368 saw it, 314 closed it, 5 clicked (GA4, Aug to Nov 2026). Message and blog
 * pages, and the other occasions, get no popup. Read on the server (app/layout)
 * and handed to the browser as a short list.
 */
export function weddingPromoPages(): string[] {
  const designs = OCCASION_MAP.wedding?.templateIds ?? []
  return [
    '/',
    '/templates',
    '/templates/category/wedding',
    '/templates/category/signature',
    '/wedding-invitation',
    '/wedding-invitation/*',
    '/save-the-date',
    ...designs.map((id) => `/templates/${templateSeoSlug(id)}`),
  ]
}
