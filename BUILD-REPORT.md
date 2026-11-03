# BUILD-REPORT: site_update, Houston Waste Removal (houston-waste-removal-1791303748120)

Run kind: `site_update`. Task from INSTRUCTIONS.md: replace the stock photos with the client's media from the Ops intake. No copy, services, prices or contact details were changed.

## 1. `npm run verify`

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

## 2. site.config.ts

This was a `site_update`. Only the image fields changed, so this section is the diff rather than all 800 lines. Every other field is the same as on main.

```diff
diff --git a/site.config.ts b/site.config.ts
index f91851c..9db2f20 100644
--- a/site.config.ts
+++ b/site.config.ts
@@ -1,6 +1,43 @@
 import type { SiteConfigInput } from './lib/config-schema'
 import { LOGO, LOGO_ON_DARK, STOCK } from './lib/stock-images'
 
+/**
+ * EARL'S OWN JOB PHOTOGRAPHS, filed through the Ops intake in November 2026
+ * (ASSETS.json). These are real jobs, so unlike the stock in
+ * lib/stock-images.ts they may go in the gallery. Every service without one of
+ * these still runs on the stock image it had, or on none.
+ *
+ * The truck photo is CROPPED: the bottom 36% carried a readable licence plate
+ * and dealer frame. Nothing else was done to any of these files.
+ */
+const PHOTO = {
+  // IMG_5733: open living area mid-cleanout. Named as the hero by the client.
+  hero: 'open-living-area-with-a-granite-kitchen-island-holding-clean.jpg',
+  // Junk removal / hauling
+  truckLoad: 'pickup-truck-bed-loaded-with-scrap-lumber-trim-a-black-panel.jpeg', // 1000029522
+  couchAndBags: 'covered-side-entry-with-a-couch-black-trash-bags-and-scatter.jpg', // IMG_5745
+  sidePassageTrash: 'side-passage-between-houses-filled-with-trash-a-smoker-yello.jpg', // IMG_5746
+  sideWalkwayTrash: 'side-walkway-strewn-with-garbage-cardboard-a-walker-and-lean.jpg', // IMG_5747
+  // Demo / cleanout
+  kitchenClutter: 'open-kitchen-with-granite-island-cluttered-with-cleaning-sup.jpg', // IMG_5741
+  kitchenDishwasher: 'kitchen-with-open-dishwasher-stainless-fridge-and-stove-and-.jpg', // IMG_5742
+  livingAreaBag: 'empty-living-area-with-dirty-plank-floor-white-walls-a-trash.jpg', // IMG_5743
+  kitchenLiving: 'open-kitchen-and-living-area-with-dark-vinyl-plank-flooring-.jpg', // IMG_1293
+  garageLumber: 'garage-corner-with-lumber-trim-boards-black-trash-bags.jpeg', // 6410906674204622022
+  garageBay: 'single-bay-garage-with-a-miter-saw-firewood-soil-bags-cooler.jpeg', // 1000029521
+  // Finished side yards (the site has no before/after block, so these are
+  // shown as finished work)
+  sideYardAc: 'narrow-side-yard-between-two-houses-with-gray-gravel-an-air-.jpg', // IMG_5736
+  sidePassageClear: 'narrow-side-passage-with-a-concrete-walkway-gravel-beds-a-gr.jpg', // IMG_5737
+  sideYardMeters: 'side-yard-of-gravel-between-siding-walls-with-an-air-conditi.jpg', // IMG_5738
+  longPassageClear: 'long-side-passage-between-two-houses-with-a-concrete-walkway.jpg', // IMG_5739
+  // Before shots and interiors
+  sideYardDebris: 'narrow-side-yard-of-gravel-between-houses-littered-with-debr.jpg', // IMG_5744
+  sideEntrySlab: 'covered-concrete-entry-beside-a-side-door-with-dirty-stained.jpg', // IMG_5740
+  kitchenIsland: 'kitchen-island-with-granite-counter-sink-and-cleaning-produc.jpg', // IMG_5734
+  emptyRoom: 'empty-room-with-white-walls-entry-door-and-dark-plank-floori.jpg', // IMG_5735
+} as const
+
 /**
  * Every business fact for Houston Waste Removal, operated by EJC Demo Junk &
  * Haul, lives here and nowhere else.
@@ -247,7 +284,7 @@ const siteConfig = {
         'Household junk hauled away: boxes, bags, old furniture, electronics, and whatever else has stacked up.',
       priceFrom: null,
       priceNote: 'set by a free virtual estimate',
-      image: STOCK.junkRemoval,
+      image: PHOTO.couchAndBags,
       titleOverride: null,
       faqs: [
         {
@@ -347,7 +384,7 @@ const siteConfig = {
         'Garages, attics, basements, and storage units cleared from front to back, including the things stacked behind everything else.',
       priceFrom: null,
       priceNote: 'set by a free virtual estimate',
-      image: STOCK.garageCleanouts,
+      image: PHOTO.garageLumber,
       titleOverride: null,
       faqs: [
         {
@@ -427,7 +464,7 @@ const siteConfig = {
         'Lumber, drywall, roofing tear-off, concrete, brick, and scrap metal cleared off the site so the next trade can get to work.',
       priceFrom: null,
       priceNote: 'set by a free virtual estimate',
-      image: STOCK.constructionDebris,
+      image: PHOTO.truckLoad,
       titleOverride: 'Construction Debris Removal Houston',
       faqs: [
         {
@@ -523,7 +560,7 @@ const siteConfig = {
         'Evictions, foreclosures, move-outs, and listing preparation cleared on a turnover schedule so the unit is ready to show.',
       priceFrom: null,
       priceNote: 'set by a free virtual estimate',
-      image: STOCK.propertyCleanouts,
+      image: PHOTO.kitchenClutter,
       titleOverride: 'Property Cleanouts in Houston, TX',
       faqs: [
         {
@@ -756,12 +793,26 @@ const siteConfig = {
   },
 
   images: {
-    hero: STOCK.hero,
+    hero: PHOTO.hero,
     about: STOCK.about,
-    // Empty on purpose. There are no client photographs yet, and a gallery of
-    // licensed stock would imply these are EJC's own jobs. The Gallery section
-    // does not render while this is empty.
-    gallery: [],
+    // Earl's own photographs only, never stock. Finished side yards first,
+    // then the before shots. Service images are not repeated here.
+    gallery: [
+      PHOTO.sideYardAc,
+      PHOTO.sidePassageClear,
+      PHOTO.sideYardMeters,
+      PHOTO.longPassageClear,
+      PHOTO.sidePassageTrash,
+      PHOTO.sideWalkwayTrash,
+      PHOTO.sideYardDebris,
+      PHOTO.sideEntrySlab,
+      PHOTO.kitchenDishwasher,
+      PHOTO.livingAreaBag,
+      PHOTO.kitchenLiving,
+      PHOTO.garageBay,
+      PHOTO.kitchenIsland,
+      PHOTO.emptyRoom,
+    ],
     // The client's brand mark. Keeps stock photography out of schema.org
     // `logo` and the social card. See lib/schema.ts logoUrl().
     logo: LOGO,
```

## 3. Alt-text spot checks (five picked at random from the photos I viewed, then viewed again by filename)

| File | Alt | Matches? |
|---|---|---|
| garage-corner-with-lumber-trim-boards-black-trash-bags.jpeg | Garage corner stacked with leftover lumber, trim boards, black trash bags and a boxed miter saw awaiting removal | yes |
| side-yard-of-gravel-between-siding-walls-with-an-air-conditi.jpg | Cleared gravel side yard between siding walls with an air conditioner, utility meters and open irrigation valve boxes | yes |
| open-kitchen-with-granite-island-cluttered-with-cleaning-sup.jpg | Open kitchen with a granite island cluttered with cleaning supplies, trash bags and a mop on dark plank flooring | yes |
| kitchen-island-with-granite-counter-sink-and-cleaning-produc.jpg | Kitchen island with a granite counter, sink and cleaning products, with crumbs and stains on the plank floor | yes |
| long-side-passage-between-two-houses-with-a-concrete-walkway.jpg | Long cleared side passage between two houses with a concrete walkway, gravel beds, downspouts and a wooden gate | yes |

All 19 alts are written from the filed captions after viewing the photo. They contain no town, customer or job name.

## 4. Design direction

No change. Heavy iron, as built. This run did not redesign anything.

## 5. Templated-looking things (written self-check, CI mode, limited to what this run touched)

1. **The desktop hero would have been a blank floor.** The client's hero (IMG_5733) is a tall 9:16 phone shot. The hero's `object-[center_65%]` was tuned for the old basement stock. At 1440 it kept only the bottom third of the frame: grey plank floor, no subject. **Fix:** I changed it to `object-[center_45%]` in `components/Hero.tsx`, which puts the island and the cleaning supplies in frame. I measured the headline with the scrim against the brightest point from 35% of the box down: 5.72:1 at 1440 and 4.80:1 at 390. AA for large text needs 3.0.
2. **The truck photo had a readable licence plate and dealer frame.** **Fix:** I cropped the bottom 36% off the original. That removed the plate, the frame and the badge and kept the full load in the bed.
3. **The gallery must not repeat the service images or open on a before shot.** The gallery's first tile is double size. **Fix:** I ordered it with the finished side yards first (IMG_5736 leads) and the before shots after them. No photo appears both in the gallery and as a service image.

## Photo placement

**Hero:** `open-living-area-with-a-granite-kitchen-island-holding-clean.jpg` (IMG_5733). INSTRUCTIONS.md named it, and ASSETS.json marks it `heroCandidate`. It shows a door and windows but no person, car, readable house number or neighbour's house in the hero crop. Its alt text is generic.

**Service images (4):**
- Junk Removal: IMG_5745 (couch and trash bags at a side entry). It is from the junk removal / hauling set, with no person and no car.
- Construction Debris Removal: 1000029522 (truck bed of scrap lumber and paint buckets, cropped). It is from the hauling set and shows exactly that service.
- Garage Cleanouts: 6410906674204622022 (garage corner of lumber and bags). It is from the demo / cleanout set.
- Property Cleanouts: IMG_5741 (cluttered kitchen in an emptied unit). It is from the demo / cleanout set.

The site has no "hauling section" or "demo section" as such. Each service page holds one image, so each set's best fit went to the matching service page and the rest of the set went to the gallery. Light Demolition keeps its stock shed, because none of the 19 photos shows a demolition.

**Gallery (14), in order:** IMG_5736, IMG_5737, IMG_5738, IMG_5739 (finished work), then IMG_5746, IMG_5747, IMG_5744, IMG_5740, IMG_5742, IMG_5743, IMG_1293, 1000029521, IMG_5734, IMG_5735.

**Before/after:** the layout has no before/after block, so per INSTRUCTIONS.md IMG_5736 to 5739 are in the gallery as finished work. The before shots IMG_5744 and IMG_5740 are in the gallery after them.

**Placed: 19 of 19 photos. Left out: none.** IMG_5746 shows a person standing at the far gate. They are small and cannot be identified. It is in the gallery only, never the hero.

**Videos: 0 of 3 placed.** IMG_5748.mov, IMG_5749.mov and IMG_5750.mov are in ASSETS.json `skipped` with the reason "this repo has no scripts/transcode-videos.mjs yet (template sync pending)". This repo also has no `components/Video.tsx` and no `public/videos/manifest.json`. AGENT.md forbids transcoding a video myself, so I did not convert them to mp4. No hero video, as instructed.

**Stock deleted (no longer referenced):** basement-with-old-furniture, residential-garage-with-shelving, broken-concrete-and-brick-pile, moving-boxes-in-empty-room, stacked-cardboard-boxes. stacked-cardboard-boxes was already unreferenced before this run. Their processed WebPs were deleted too. The removed keys came out of `lib/stock-images.ts`, and a note was added to `seo/STOCK-PHOTOS.md`.

**Stock still in use, because no client photo shows these services:** Furniture Removal, Mattress Disposal, Estate Cleanouts, Hoarder Cleanouts, Light Demolition, Hot Tub Removal, Commercial Cleanouts, Yard Waste, and the Contact / Referral Program banners. Appliance Removal still has no image. About stays null on purpose. All of these are listed in CLIENT-TODO.md.

## 6. UNRESOLVED

No new config field was nulled by this run. Still open, and this run did not touch any of it:
- The three videos are owed (see above). Nothing renders for them.
- `services[appliance-removal].image` is null, because there is no photo. That page shows the brand-green block.
- `images.about` is null on purpose. No photo shows on About or in the homepage about band.
- The earlier open facts are unchanged: insurance/licensing, how virtual estimates work, whether the phone takes texts, the after-hours fee, offer and referral terms, items not taken, pricing method, Spanish, and an owner story. They are now phrased as questions at the top of CLIENT-TODO.md under `## Questions for Jacob`.

## 7. INVENTED

None. No facts were added or changed. One thing I was tempted to do and did not: spread more client photos onto Light Demolition, Estate Cleanouts and Hoarder Cleanouts. None of the photos actually shows those jobs, so those pages keep their stock.

## 8. Template / process notes

- **Videos cannot be placed in this repo yet.** It needs the template sync that adds `scripts/transcode-videos.mjs`, `components/Video.tsx` and `public/videos/`. Once that lands, rerun to get the three clips into the gallery (muted, loop, playsinline).
- **The hero is soft at 1440.** The hero original is only 1350px wide, so the ladder stops at 1024w and the browser upscales it about 1.4x on a 1440 screen. A higher-resolution original from the client would fix it. No code change would.
- **CLIENT-TODO.md was deleted in the checkout before this run started.** I don't know why. I restored it from main and put the `## Questions for Jacob` section at the top, plus a table of pages that still have no real photo.
- **This is a rerun.** No `build/houston-waste-removal-1791303748120` branch existed locally or on origin when this run started. This commit creates it. If the earlier run 41550156021 opened a PR from a different branch, close that PR in favour of this one.
- The truck photo is cropped (bottom 36%). The uncropped original is still in the Ops intake.
