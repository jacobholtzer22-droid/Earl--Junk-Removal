import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

/**
 * Converts everything in public/images/originals/ to WebP at 640/1024/1920
 * (never wider than the original) and writes public/images/manifest.json.
 *
 * The manifest is keyed by ORIGINAL FILENAME, never by array position. A
 * previous project shipped nine alts shifted by one because they were
 * assigned positionally; filename keys make that class of bug impossible.
 *
 * Re-running is safe: existing alt text is preserved. New files get alt: null,
 * which lib/images.ts turns into a build error until someone views the image
 * and writes a real description.
 */

const ROOT = process.cwd()
const ORIGINALS = path.join(ROOT, 'public/images/originals')
const PROCESSED = path.join(ROOT, 'public/images/processed')
const MANIFEST = path.join(ROOT, 'public/images/manifest.json')
/*
 * 320 is here for the LOGO, and it earns its place.
 *
 * The header draws the lockup in a 100 to 112px slot. With 640 as the
 * narrowest rendition the browser had nothing smaller to pick, so a phone
 * downloaded 88kB to paint a 100px mark, and the about panel pulled another
 * 113kB of the white version for a 224px box. Two hundred kilobytes, above
 * the fold, to show a logo. 320 covers a 112px slot even at 3x.
 *
 * Every photo gets a 320 too. They are a few kB each and a narrow phone is
 * better served by one.
 */
const WIDTHS = [320, 640, 1024, 1920]
const QUALITY = 82

/**
 * ONE TREATMENT FOR THE WHOLE PHOTO LIBRARY.
 *
 * The photographs come from two stock sites and a dozen different
 * photographers, so out of the box they disagree about white balance,
 * saturation and contrast, and a grid of them reads as a pile of downloads
 * rather than as one company's pictures.
 *
 * The grade is deliberately slight: saturation pulled back a tenth, then a
 * 7% wash of the brand green laid over in soft-light, which tints the shadows
 * without touching the highlights. Enough to make a row of cards agree,
 * nowhere near enough to look like a filter.
 *
 * LOGOS ARE EXEMPT. A brand mark is artwork with its own colours, and tinting
 * it would be recolouring the client's logo. Anything whose filename contains
 * "logo" skips the grade entirely.
 */
const GRADE = { tint: { r: 1, g: 106, b: 28 }, opacity: 0.07, saturation: 0.9 }
const isLogo = (file: string) => /logo/i.test(file)
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif', '.gif'])

interface Entry {
  width: number
  height: number
  alt: string | null
  base: string
  sizes: number[]
}

function slugBase(filename: string): string {
  return path
    .parse(filename)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readExisting(): Record<string, Entry> {
  if (!fs.existsSync(MANIFEST)) return {}
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Record<string, Entry>
  } catch {
    console.warn('manifest.json was not valid JSON; starting fresh (alt text will need to be re-entered)')
    return {}
  }
}

async function main() {
  fs.mkdirSync(ORIGINALS, { recursive: true })
  fs.mkdirSync(PROCESSED, { recursive: true })

  const files = fs
    .readdirSync(ORIGINALS)
    .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()) && !f.startsWith('.'))
    .sort()

  const existing = readExisting()
  const manifest: Record<string, Entry> = {}
  const usedBases = new Map<string, string>()

  for (const file of files) {
    const base = slugBase(file)
    const clash = usedBases.get(base)
    if (clash) {
      throw new Error(`"${file}" and "${clash}" both slugify to "${base}". Rename one of them.`)
    }
    usedBases.set(base, file)

    // rotate() applies EXIF orientation so portrait phone photos come out upright.
    const image = sharp(path.join(ORIGINALS, file)).rotate()
    const meta = await image.metadata()
    if (!meta.width || !meta.height) throw new Error(`Could not read dimensions of ${file}`)
    // After rotate(), width/height are swapped for orientations 5 to 8.
    const swap = (meta.orientation ?? 1) >= 5
    const width = swap ? meta.height : meta.width
    const height = swap ? meta.width : meta.height

    const targets = WIDTHS.filter((w) => w <= width)
    if (targets.length === 0) targets.push(width)

    for (const w of targets) {
      const out = path.join(PROCESSED, `${base}-${w}.webp`)
      // Resize to a buffer first, then read its REAL dimensions. withoutEnlargement
      // can return something smaller than the requested width, and a composite
      // overlay even one pixel larger than its base makes sharp throw.
      const resized = await image.clone().resize({ width: w, withoutEnlargement: true }).toBuffer()
      if (isLogo(file)) {
        await sharp(resized).webp({ quality: QUALITY }).toFile(out)
        continue
      }
      const graded = sharp(resized).modulate({ saturation: GRADE.saturation })
      const m = await sharp(resized).metadata()
      await graded
        .composite([
          {
            input: {
              create: {
                width: m.width ?? w,
                height: m.height ?? w,
                channels: 4,
                background: { ...GRADE.tint, alpha: GRADE.opacity },
              },
            },
            blend: 'soft-light',
          },
        ])
        .webp({ quality: QUALITY })
        .toFile(out)
    }

    const prior = existing[file]
    manifest[file] = {
      width,
      height,
      alt: prior?.alt ?? null,
      base,
      sizes: targets,
    }
    console.log(`${file}  ${width}x${height}  ->  ${targets.map((w) => `${w}w`).join(' ')}${prior?.alt ? '' : '  (alt: null)'}`)
  }

  // Remove processed files whose original is gone.
  const keep = new Set(Object.values(manifest).flatMap((e) => e.sizes.map((w) => `${e.base}-${w}.webp`)))
  for (const f of fs.readdirSync(PROCESSED)) {
    if (f.endsWith('.webp') && !keep.has(f)) {
      fs.unlinkSync(path.join(PROCESSED, f))
      console.log(`removed stale ${f}`)
    }
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

  const missingAlt = Object.entries(manifest)
    .filter(([, e]) => !e.alt)
    .map(([f]) => f)
  console.log(`\nWrote ${MANIFEST} with ${files.length} image(s).`)
  if (missingAlt.length) {
    console.log(`\n${missingAlt.length} image(s) need alt text before the site will build:`)
    for (const f of missingAlt) console.log(`  - ${f}`)
    console.log('\nView each file, then set "alt" in the manifest to 10 to 20 words describing what is actually in it.')
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
