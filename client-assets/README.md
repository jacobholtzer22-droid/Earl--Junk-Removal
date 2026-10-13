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

## brand-2026-10/print-proofs

Added 2026-10-12. Five phone screenshots from the print shop's site
(tdayflyers / NextDayFlyers) plus a t-shirt mockup.

**None of these is a new logo and none is a new colour.** They are print
proofs of the collateral already in the folder above: the same door hanger,
the same business card, the same lockup. The greens in them were sampled and
sit at hue 131 to 140, which is the palette already in theme.ts (accent and
accentDark are both hue 135). The lime on the door hanger back is #9CC636
against the site's #A4E048, the same colour doing the same job.

**None of them can go on the site**, and not because of the marketing-piece
rule alone:

- two still have the phone's status bar and the browser address bar in frame
- all four print proofs carry the printer's TRIM LINE, SAFE ZONE and
  FRONT/BACK overlay marks drawn across the artwork
- the t-shirt mockup has a NextDayFlyers watermark on it

They are kept here because they are the record of what the client is actually
printing, and because the business card is where "Earl Morris", the second
Gmail address and the curbside-pickup and recycling claims come from. All of
those are open questions on the client list, items 22 and 28.
