# BUILD-REPORT: site_update (tracking install), houston-waste-removal-1791303748120

**Result: STOPPED again. Nothing was applied, and `site.config.ts` is unchanged.** This is the same tracking block as the previous run, and the repo's config schema still does not accept it. AGENT.md (CI mode, Tracking installs) says: "If a value in the block does not match the schema, stop and say so under item 8; never guess or reformat an id or a label." Since the last run, the only new commit is `2c25f89` ("Add site tracking + cookie banner"). It changed only `app/layout.tsx`, `app/privacy-policy/page.tsx` and `components/Footer.tsx`. It did not touch `lib/config-schema.ts`, the tag components or `scripts/verify.ts`.

## 1. `npm run verify` (unchanged tree, after `npm run build` passed)

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
All checks passed.
```

**Check 22, which INSTRUCTIONS.md requires, does not exist in this repo.** `scripts/verify.ts` here has only checks 1 to 17.

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

Nothing new. The form and call conversion events still do not fire, because both labels are empty. The base Ads tag `AW-18497989799` is live and unchanged.

## 7. INVENTED

Nothing was invented. I was tempted to reshape the block to fit this repo's schema, as `conversionLabels: { contact: 'vJe1CJTfiZUdEKfZw_RE', call: 'rioOCJffiZUdEKfZw_RE' }`, and I did not. That would rename `form` to `contact` and strip the `AW-.../` prefix, which is the reformatting AGENT.md forbids.

## 8. Problems with the template / this run

1. **Schema mismatch, which is why I stopped (second run in a row).** I applied the block as given in a scratch test, then reverted it:
   `site.config.ts(653,5): error TS2353: Object literal may only specify known properties, and 'conversions' does not exist in type '{ googleAdsId?: ...; conversionLabels?: { contact?: ...; call?: ... } }'.`
   `lib/config-schema.ts` expects `tracking.conversionLabels: { contact, call }` as bare labels, and `lib/conversions.ts` adds the `AW-.../` prefix itself. Re-dispatching the same block will fail the same way.
2. **This repo is behind AA-Template.** It has `components/GoogleAdsTag.tsx` and `components/ConversionTracking.tsx`, but not the `components/GoogleTag.tsx` that AGENT.md describes. It also has no check 22. `lib/config-schema.ts` and `scripts/verify.ts` are on the CI forbidden list, so I did not change them.
   **Fix (the human decides):** either (a) sync this repo's schema, tag component and `verify.ts` from the current AA-Template, then re-dispatch the same block; or (b) re-dispatch in this repo's shape, `conversionLabels: { contact: 'vJe1CJTfiZUdEKfZw_RE', call: 'rioOCJffiZUdEKfZw_RE' }`, if Jacob confirms that `form` maps to `contact`.
3. **`launch.indexable` is `true`** (`site.config.ts:830`). The previous report flagged this too. This run did not touch it.
4. **A hand-added third-party script.** Commit `2c25f89` added `<script src="https://www.alignandacquire.com/t/s/houston-waste-removal-1791303748120.js">` straight into `<head>` in `app/layout.tsx`, outside config. The `tracking` schema comment says "Nothing else: no Tag Manager, no GA4, no third tag." It also added a hidden "Cookie settings" link in `components/Footer.tsx`. This is probably intentional on the platform side. I note it only because it sidesteps the config-is-the-control-surface rule, and the template should own it. I did not change it.
