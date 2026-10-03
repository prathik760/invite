/**
 * Cookie consent for visitors from the UK, the EU/EEA and Switzerland, where
 * analytics and advertising cookies need a yes first.
 *
 * middleware.ts marks those visitors with REGION_COOKIE, from Vercel's country
 * header. consentBootScript(), inlined at the top of <head> in app/layout.tsx,
 * reads it before any tracker starts and sets up window.siConsent:
 *
 * - Meta Pixel and Clarity start through siConsent.run(), which holds them
 *   until the visitor accepts.
 * - Google tags (GA4, GTM) start in Consent Mode with storage denied, so they
 *   set no cookies and send only cookieless pings until the visitor accepts.
 * - The visitor journal (lib/journal.ts) keeps its events in memory and sends
 *   them only once the visitor accepts; they are dropped if the visitor says no.
 *
 * CookieConsent (components/providers) asks, and the answer is kept in
 * CONSENT_COOKIE. Everywhere else everything runs as before, unless the visitor
 * has said no through "Cookie settings" in the footer: an explicit choice is
 * honoured wherever the visitor is.
 */

export const REGION_COOKIE = 'si_cr'
export const CONSENT_COOKIE = 'si_consent'
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180 // six months
/** Fired on window when the visitor decides. */
export const CONSENT_EVENT = 'si:consent'

/** The EU's 27, the rest of the EEA (Iceland, Liechtenstein, Norway), the UK, and Switzerland. */
export const CONSENT_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
  'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO',
  'GB', 'CH',
])

export interface SiConsent {
  /** The visitor is in a country where trackers wait for a yes. */
  region: boolean
  choice: 'granted' | 'denied' | null
  /** Trackers may run now. */
  ok: boolean
  /** Runs `start` now if trackers may run, otherwise once the visitor accepts. */
  run(start: () => void): void
  /** Records the visitor's answer. True when it withdraws an earlier yes: reload to stop what is running. */
  decide(granted: boolean): boolean
}

declare global {
  interface Window {
    siConsent?: SiConsent
  }
}

export type ConsentState = 'granted' | 'pending' | 'denied'

/** Whether trackers may run, or are waiting for the visitor's answer. */
export function consentState(): ConsentState {
  const s = typeof window === 'undefined' ? undefined : window.siConsent
  if (!s || s.ok) return 'granted'
  return s.choice === 'denied' ? 'denied' : 'pending'
}

/** Set up window.siConsent before any tracker runs (see the comment at the top). */
export function consentBootScript(): string {
  return `!function(w,d){var c='';try{c=d.cookie}catch(e){}
var m=c.match(/(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)/),s={region:/(?:^|;\\s*)${REGION_COOKIE}=1/.test(c),choice:m?m[1]:null,wait:[]};
s.ok=s.choice?s.choice==='granted':!s.region;w.siConsent=s;
w.dataLayer=w.dataLayer||[];function g(){w.dataLayer.push(arguments)}
function all(v){return{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v}}
if(s.region||s.choice)g('consent','default',all(s.ok?'granted':'denied'));
s.run=function(f){if(s.ok)f();else s.wait.push(f)};
s.decide=function(yes){var undo=s.ok&&!yes;s.choice=yes?'granted':'denied';s.ok=yes;
d.cookie='${CONSENT_COOKIE}='+s.choice+';path=/;max-age=${CONSENT_MAX_AGE};samesite=lax'+(location.protocol==='https:'?';secure':'');
g('consent','update',all(s.choice));
if(yes){var q=s.wait;s.wait=[];q.forEach(function(f){try{f()}catch(e){}})}
try{w.dispatchEvent(new Event('${CONSENT_EVENT}'))}catch(e){}
return undo}}(window,document);`
}
