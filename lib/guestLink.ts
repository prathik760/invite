/**
 * A link out of an invitation page (/e/…), for a guest who wants one of their own.
 *
 * Analytics do not run on invitation pages (app/layout.tsx): guests opening a
 * WhatsApp link were most of the site's "Direct" visits and hid the real ones.
 * So these links are plain <a> tags, a full page load that starts analytics on
 * arrival (a client-side navigation would never load it), and they carry where
 * the visit came from, so it counts as invitation traffic, not "Direct".
 */
export function guestLink(path: string, campaign: string): string {
  return `${path}${path.includes('?') ? '&' : '?'}utm_source=invitation&utm_medium=guest_link&utm_campaign=${campaign}`
}
