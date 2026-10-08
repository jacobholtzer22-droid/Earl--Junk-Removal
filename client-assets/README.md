# client-assets

The client's own files, exactly as he supplied them. **Nothing in this folder is
served.** It sits outside `public/` on purpose: these are 1 to 2.4MB PNGs, and
several of them are marketing pieces that must never reach the site.

`next build` only copies `public/`, so none of this appears in `out/`. There is
a gate check that proves it (see the brand commit's artifacts).

## brand-2026-10

Supplied 2026-10-07. Twelve PNGs, no vector file, no written guidelines.

- **`HWR Logo (Black).png`** and **`HWR logo (White).png`** are the two files
  the site uses. Trimmed of transparent padding and nothing else, then run
  through `scripts/process-images.ts` like any other image. The trimmed copies
  live in `public/images/originals/`.
- **`Houston Waste Removal Logo Collection.png`** holds three lockups on a
  white ground. The circular badge from it is the source of the favicon,
  circle-masked back to transparency.
- Everything else is a **marketing piece**: business cards, door hangers and
  mockup sheets. None of them goes on the site, by instruction. They are here
  so the brand is recorded in one place and so the palette can be re-derived.

The flyer artwork, including the skyline and truck scenes, is AI-generated, and
two files are named `ChatGPT Image` outright. The logo itself is too. The logo
is exempt by explicit ruling, as the client's chosen brand mark rather than a
depiction of his work; the rule stands for everything else here.

## legacy

The previous identity, retired from the site on 2026-10-07 and kept so the
change is reversible.
