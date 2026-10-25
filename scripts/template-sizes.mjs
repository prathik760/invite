/**
 * Writes the ready-made sizes of every design picture (public/templates/<id>.jpg)
 * to public/templates/sized/<id>-<width>.webp. The site shows these instead of
 * sending design pictures through Vercel's image optimiser (see
 * sizedTemplateImage in lib/templateMedia.ts).
 *
 *   npm i --no-save sharp                  # once
 *   node scripts/template-sizes.mjs        # every design (or name some ids)
 *
 * Run it whenever a design's picture is re-shot, then bump that picture's
 * version in lib/templateMedia.ts.
 */
import sharp from 'sharp'
import { mkdirSync, readdirSync } from 'fs'

const DIR = new URL('../public/templates/', import.meta.url).pathname
// Keep in step with SIZED_WIDTHS in lib/templateMedia.ts.
const WIDTHS = [128, 384, 640, 960]
const only = process.argv.slice(2)

mkdirSync(DIR + 'sized', { recursive: true })
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.jpg'))) {
  const id = file.slice(0, -'.jpg'.length)
  if (only.length && !only.includes(id)) continue
  for (const width of WIDTHS) {
    await sharp(DIR + file)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 74, effort: 6 })
      .toFile(`${DIR}sized/${id}-${width}.webp`)
  }
  console.log(id)
}
