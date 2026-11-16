# BUILD-REPORT: site_update (tracking install), houston-waste-removal-1791303748120

**Result: STOPPED, nothing applied. `site.config.ts` is unchanged.** The tracking block in INSTRUCTIONS.md does not match this repo's config schema. AGENT.md (CI mode, Tracking installs) says: "If a value in the block does not match the schema, stop and say so under item 8; never guess or reformat an id or a label."

## 1. `npm run verify` (unchanged tree)

```
#   check                                                                   result  detail
--- ----------------------------------------------------------------------  ------  ------
1   site.config.ts parses against schema                                    PASS
2   businessSlug and identity are filled in (not the template sample)       PASS    slug "houston-waste-removal-1791303748120"
3   businessSlug exists in the live platform database                       PASS    platform confirmed slug "houston-waste-removal-1791303748120"
4   components/ContactForm.tsx matches sealed checksum                      PASS    790e76a06c45
5   built HTML posts to the www contact endpoint, never the bare apex       PASS    endpoint on /contact, /
6   honeypot hp_7d3a_ref inside hidden wrapper, no "company" field          PASS
7   content/ contains no bare phone, address, email, or price               PASS
8   no placeholder tokens in content/ or site.config.ts                     PASS
9   every JSON-LD block parses, has @context/@type, all types on allowlist  PASS
10  Review/aggregateRating only with real, visible reviews                  PASS
11  every image has a 15+ char alt; no two images share an alt              PASS    2 declared-decorative images exempt
12  exactly one <h1> per page                                               PASS
13  titles unique, 30 to 60 chars as rendered                               PASS
14  meta descriptions present, unique, 140 to 160 chars                     PASS
15  canonical present on every page and matches config.domain               PASS
16  sitemap lists every built route and nothing else                        PASS
17  every internal link resolves to a built route                           PASS

17/17 checks passed across 29 pages.
```

**Check 22 does not exist in this repo.** INSTRUCTIONS.md says "check 22 must pass". This repo's `scripts/verify.ts` has only checks 1 to 17.

## 2. `site.config.ts`

Unchanged. The current tracking block is:

```ts
tracking: {
  googleAdsId: 'AW-18497989799',
  conversionLabels: {
    contact: '',
    call: '',
  },
},
```

## 3 to 5. Alt spot checks, design direction, templated-look fixes

Not applicable. This is a tracking-install run, so no images, design or content were touched.

## 6. UNRESOLVED

Nothing new. The two conversion events stay off, because `conversionLabels.contact` and `conversionLabels.call` are empty. The base Ads tag (`AW-18497989799`) was already live before this run and still is.

## 7. INVENTED

Nothing. I was tempted to convert the block to this repo's shape, as shown below, and I did not:

```ts
conversionLabels: { contact: 'vJe1CJTfiZUdEKfZw_RE', call: 'rioOCJffiZUdEKfZw_RE' }
```

That would rename `form` to `contact` and strip the `AW-.../` prefix from each value. AGENT.md forbids exactly that kind of reformatting.

## 8. Problems with the template / this run

1. **Schema mismatch, which is why I stopped.** INSTRUCTIONS.md supplies `tracking.conversions: { form, call }` with full `send_to` values (`AW-18497989799/<label>`). This repo's `lib/config-schema.ts` defines `tracking.conversionLabels: { contact, call }` with bare labels. `lib/conversions.ts` adds the `AW-.../` prefix itself. The block was applied as given in a scratch test, then reverted. The test result was:
   `site.config.ts(653,5): error TS2353: Object literal may only specify known properties, and 'conversions' does not exist in type '{ googleAdsId?: ...; conversionLabels?: { contact?: ...; call?: ... } }'.`
   Even if it type-checked, zod would drop the unknown key and no conversion would fire, and the gate would still be green.
2. **The repo is behind the template.** This repo has `components/GoogleAdsTag.tsx` plus `components/ConversionTracking.tsx`. AGENT.md refers to `components/GoogleTag.tsx`, which does not exist here. AGENT.md also refers to check 22, which is missing from `scripts/verify.ts`. The CI section of AGENT.md was updated, but the schema, components and verify script were not. `lib/config-schema.ts` and `scripts/verify.ts` are on the CI forbidden list, so I did not change them.
   **Fix (human decides):** either (a) sync this repo with the current AA-Template (schema, `GoogleTag.tsx`, check 22), then re-dispatch the same block, or (b) re-dispatch with the block in this repo's shape, `conversionLabels: { contact: 'vJe1CJTfiZUdEKfZw_RE', call: 'rioOCJffiZUdEKfZw_RE' }`, if Jacob confirms that `form` maps to `contact`.
3. **`launch.indexable` is already `true`.** The comment above it says the domain "is not purchased yet". This run did not touch it. Please confirm that the go-live was intended.
