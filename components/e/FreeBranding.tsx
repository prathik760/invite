/**
 * The watermark on an invitation published free (lib/freeInvites.ts), with the pinned
 * FreePlanBanner at the top: "ShareInvite" written faintly across the whole design. Buying the
 * design removes both, on the same link.
 *
 * It sits above everything, the design's own opening screens included, and never takes a tap
 * (pointer-events: none), so guests can still open the doors, see the map, reply and leave a wish.
 * A mid grey at low opacity reads on dark designs and light ones alike.
 *
 * `contained`: drawn inside the builder's phone preview (absolute, over the screen) instead of over
 * the page (fixed), so a host sees exactly what a free invitation looks like before choosing.
 */
const TILE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='190' viewBox='0 0 300 190'>` +
    `<g transform='rotate(-24 150 95)' fill='rgb(128,128,128)' fill-opacity='0.24' font-family='Georgia, serif' text-anchor='middle'>` +
    `<text x='150' y='88' font-size='26' font-style='italic'>ShareInvite</text>` +
    `<text x='150' y='112' font-size='12' letter-spacing='3'>FREE INVITATION</text>` +
    `</g></svg>`,
)

export default function FreeBranding({ contained = false }: { contained?: boolean }) {
  return (
    <div
      aria-hidden
      className={`${contained ? 'absolute' : 'fixed'} pointer-events-none inset-0`}
      style={{
        // Above the design's own layers in both places: its openings use high z-indexes of their own.
        zIndex: contained ? 1000 : 2147481000,
        backgroundImage: `url("data:image/svg+xml,${TILE}")`,
        backgroundSize: contained ? '220px auto' : '300px auto',
      }}
    />
  )
}
