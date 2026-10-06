# TEMPLATE-FIXES: changes that belong upstream in AA-Template

Everything in this file fixes a defect in **AA-Template itself**, not something
specific to EJC Demo Junk & Haul. Each one will recur on every client site
generated from the template until it is fixed at source.

**The template repo was not touched in this session.** This is the list to work
from when you do.

Branched from `aa-site-template` at `9e93653` (branch `feat/contact-form-fields`,
2 commits ahead of `AA-Template` `origin/main` at `aff28dc`). Note that the two
unmerged commits carry the current `ContactForm.tsx` **and** its matching
`scripts/contact-form.sha256`, so any upstream work should start from that
branch rather than `main`.

Ordered by how much damage each one does if left alone.

---

## 1. `next-mdx-remote@5` blocks every Vercel deploy, and the obvious fix silently blanks all copy

**Severity: ships broken copy with a green gate.**
**Commit `f96efea` · `package.json`, `lib/content.ts`, `scripts/proof/mdx-interpolation.mjs`**

Vercel refuses to deploy on `next-mdx-remote@5.0.0` (CVE-2026-0969), which the
template pins. So every new client repo hits a wall at deploy time.

The trap is the fix. v6 turns MDX `{expressions}` **off by default**, so after a
plain version bump every `{config.displayName}` in `content/*.mdx` renders as an
empty string. The build succeeds. **All 17 verify checks pass.** The prose reads
"… is a junk removal company in , ." and nobody notices until a human reads the
live site.

Fix, which must ship as one commit so no commit ever contains blank copy:
- `next-mdx-remote` to `^6.0.0`
- `blockJS: false` in the `compileMDX` options in `lib/content.ts`
  (`blockDangerousJS` stays at its default `true`, so `eval`, `Function`,
  `process` and `require` remain blocked: v6's recommended mode for trusted,
  repo-authored content)
- a check that catches it, because the gate does not

`scripts/proof/mdx-interpolation.mjs` is written to be client-agnostic already:
pass it any strings that must appear, and it reads the **rendered text** of each
page's `<article>` rather than raw HTML. Raw-HTML grepping gives false passes,
because React separates interpolated text nodes with `<!-- -->`. It also flags
the punctuation a blank interpolation leaves behind (`in ,`, `in .`, doubled
spaces).

Confirmed hitting three client repos now: 8th-Ascent, Hail-Recovery-Team, and
this one.

**Still open upstream:** `npm audit` flags `next@14.2.21` as critical with no
14.x or 15.x patch; the first patched release is a two-major jump. That needs a
real decision, not a patch bump, and it was out of scope here.

---

## 2. `lib/schema.ts` publishes the hero photograph as the business's logo

**Severity: publishes a false claim in structured data.**
**Commits `0bb7408`, `c8b0fb5` · `lib/config-schema.ts`, `lib/schema.ts`, `lib/seo.ts`**

`localBusiness()` and `organization()` both set schema.org `logo` from
`config.images.hero`, and `buildMetadata` fell back to the same image for
`og:image`. On any site whose hero is a photograph rather than a logo, that
declares a photograph as the company's logo to every consumer of the markup.
On a site whose hero is licensed **stock**, it declares someone else's stock
photo as the client's logo.

Fix: `images.logo` as its own nullable field, a separate `logoUrl()` in
`lib/schema.ts`, and `logo` and `image` emitted as independent properties that
each fall back to `null` rather than to each other.

**While you are in there:** `images` is an inner `z.object` without `.strict()`,
so zod **strips** an unrecognised key. Adding `logo` to a config without adding
it to the schema parses clean and then reads back `undefined` at runtime. Silent,
not loud. Worth either making the inner objects strict or commenting the trap.

---

## 3. `accent-dark` is asked to do two incompatible jobs, and one of them fails AA

**Severity: WCAG failure in the sealed component.**
**Commit `c8b0fb5` · `app/globals.css`, `theme.ts`**

`accent-dark` is simultaneously:
- the button **hover fill**, which pairs with `on-accent` (a near-black), and
- the **text colour** of the contact form's validation messages on an off-white
  surface (`text-accent-dark` in the sealed `ContactForm.tsx`).

No single colour can be 4.5:1 from both near-black and near-white. Whichever way
a client's palette goes, one of the two fails. On this site the validation text
won (small persistent text on an error path), which left a near-black button
label at 3.06:1 on hover.

Worked around here with one rule in `globals.css` that makes the label light on
hover (5.39:1) without touching the sealed form. **The real fix is upstream:**
either a separate `on-accent-dark` token, or stop reusing the hover fill as a
text colour in `ContactForm.tsx` and re-seal.

---

## 4. The `line` token is the border on every form input, and it is not a UI-contrast value

**Severity: WCAG 1.4.11 failure in every shipped site.**
**Commit `c8b0fb5` · `theme.ts`, `scripts/proof/contrast.mjs`**

`line` reads as a decorative hairline token and the shipped sample sets it that
way (`#D5D8DC`, **1.39:1** against the surface). But `ContactForm.tsx` uses
`border-line` on every input, and WCAG 1.4.11 treats an input border as a UI
component boundary needing 3:1. At 1.39:1 the fields are effectively invisible to
anyone with low vision.

This site uses `#848B94` (3.36:1). The template should say in `theme.ts` that
`line` has a hard floor because of where it is used, and ideally split the
decorative divider from the input border.

`scripts/proof/contrast.mjs` is generic: it parses `theme.ts` and audits the
pairs the site actually renders, listing combinations the design deliberately
avoids rather than quietly not testing them. Worth lifting into the template.

---

## 5. `buildTitle` cannot produce a good title for several page kinds

**Severity: cosmetic, but it makes check 13 fight the author.**
**Commits `0bb7408`, `c8b0fb5` · `lib/seo.ts`, `lib/config-schema.ts`**

Three problems, all a function of the client's display name length:

- `args.title` was honoured only for `kind: 'other'`, so no page could override
  a bad derived title.
- Service titles omitted `primaryState`, so they answered "which Houston?" with
  nothing.
- The derived `about` and `contact` titles name the business **twice**
  (`About X in City | X`) and blow past 60 characters for any name over about
  16 characters.

Fixes: an explicit `args.title` now wins for every kind; service titles include
the state; and `services[].titleOverride` lets a long service name stay long in
the H1, nav and cards while the `<title>` stays under 60. Truncating the name
itself to fit a `<title>` degrades the page for every human to satisfy a crawler.

---

## 6. The price column renders dead text on any site with no prices

**Severity: cosmetic, but it looks unfinished on every such site.**
**Commit `64f8979` · `components/ServiceGrid.tsx`**

With every `priceFrom` null, `ServiceGrid` printed the same fallback string on
every row: thirteen identical cells of "Quoted on site". It reads exactly like a
field nobody filled in. The column now renders only when at least one service
has a price, and the description takes the width.

(The string itself was also wrong for this client: "Quoted on site" contradicts
a business whose offer is a *virtual* estimate. That part is client-specific.)

---

## 7. `businessSlug` could not express "pre-launch", so the build died

**Severity: blocks any site that ships before its platform row exists.**
**Commit `0bb7408` · `lib/config-schema.ts`; `components/PendingFormGate.tsx`**

`lib/config.ts` parses at module load and throws, so an empty `businessSlug`
failed `next build` outright rather than failing the gate. AGENT.md's answer is
to stop and not build at all, which is right when a slug merely *exists* and is
unknown, but wrong when the Business row genuinely has not been created yet and
the client still needs a site up.

This repo adds `z.union([z.literal(''), slug])` plus a `superRefine` that refuses
`indexable: true` with an empty slug, so an indexed site with a dead form cannot
be built. `verify.ts` check 2 is untouched and stays red for the whole
pre-launch window.

`components/PendingFormGate.tsx` is the other half and is **fully generic**: it
wraps the sealed `ContactForm` untouched and blocks submission in React's capture
phase while the slug is empty. `npm run proof:form` tests both directions. Worth
taking upstream together with the schema change, or neither.

---

## 8. Smaller things, no commit of their own

- **`getImage()` reports the wrong `og:image` dimensions.** It returns
  `entry.width`/`entry.height` (the original) alongside a `src` capped at 1024,
  so any image wider than 1024 declares dimensions it does not have. Sidestepped
  here by serving the social card as a real PNG from `public/` instead of
  through the manifest, which also avoids WebP, which several social scrapers
  still handle badly. A template-level fix would return the chosen rendition's
  real size.
- **`app/layout.tsx` hardcoded `robots: { index: true, follow: true }`**, which
  would override nothing today but is the wrong default for any page that
  forgets to call `buildMetadata`.
- **`verify.ts` check 3 can never pass**, because the platform has not shipped
  `/api/verify-slug`. The template README documents this, which is good, but it
  means every client build reports a failure nobody can act on. Either ship the
  endpoint or make the check's failure mode distinguish "endpoint missing" from
  "slug wrong" in its exit code.
- **Check 8 treats the literal `TODO` as a placeholder token in
  `site.config.ts`**, which collides with referring to `CLIENT-TODO.md` in a
  comment. The check is right; the collision is just worth knowing about before
  someone weakens it. Reworded here instead.
