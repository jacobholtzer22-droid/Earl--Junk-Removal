# BUILD-REPORT: houston-waste-removal-1791303748120 (site_update: tracking labels)

Run kind: `site_update`, a tracking install. `INSTRUCTIONS.md` asked for two values in `site.config.ts` using this repo's own schema (`tracking.conversionLabels`). That is the whole diff.

## 1. `npm run verify` output

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

## 2. `site.config.ts` change (the only edit)

```diff
   tracking: {
     googleAdsId: 'AW-18497989799',
     conversionLabels: {
-      // EMPTY ON PURPOSE. ... (comment removed; it said the labels did not exist yet)
-      contact: '',
-      call: '',
+      contact: 'vJe1CJTfiZUdEKfZw_RE',
+      call: 'rioOCJffiZUdEKfZw_RE',
     },
   },
```

I left `googleAdsId` alone and added no second tag. Both labels are byte-for-byte what `INSTRUCTIONS.md` gave. The comment above them was removed because it now described a state that is no longer true. The rest of the config is unchanged and is not reprinted here.

How I checked it: `npx tsc --noEmit` is clean. After `npm run build`, both labels appear in the client bundle that `lib/conversions.ts` builds `send_to: AW-18497989799/<label>` from. `out/index.html` still has only the one AW- tag.

## 3. Alt-text spot checks
None for this run: no images were added, removed or re-described.

## 4. Design direction
No change, since this is a tracking-only update.

## 5. Templated-looking things
None for this run: there was no design or content work.

## 6. UNRESOLVED
No new gaps. Nothing in this run changed any null field.

## 7. INVENTED
Nothing. This list is empty.

## 8. Template / run notes
- The working tree arrived with an unrelated change I did not make: `public/images/originals/pickup-truck-bed-loaded-with-scrap-lumber-trim-a-black-panel.jpeg` was modified (455 KB to 837 KB). The instructions said to change nothing else, so I did not commit it. A human should decide whether that re-download was meant to happen.
- The template's CI tracking-install section expects a `tracking.conversions.{form,call}` block and a verify check 22. This repo uses `tracking.conversionLabels.{contact,call}` and has checks 1 to 17 only. I followed `INSTRUCTIONS.md`, which said so explicitly. The template's AGENT.md and this repo's schema have drifted apart.
- Known issue, already documented in `components/ConversionTracking.tsx` and not touched here: the sealed `ContactForm.tsx` shows a success message on an HTTP 500. The tracking works around it by firing the contact conversion only after a 2xx response.
