/**
 * EVERY PHOTOGRAPH ON THIS SITE, IN ONE PLACE.
 *
 * All of them are licensed stock from Pexels. None of them shows EJC Demo Junk
 * & Haul, its truck, its crew or one of its jobs, and no alt text, caption or
 * surrounding copy says or implies otherwise. Full inventory with source URLs,
 * photographers and licence in seo/STOCK-PHOTOS.md.
 *
 * WHY THIS FILE EXISTS. When Earl sends real job photos, swapping one in is a
 * single line here: drop the new file in public/images/originals/, run
 * `npm run images`, write its alt in public/images/manifest.json, and change
 * the filename below. Nothing in site.config.ts, no component and no content
 * file has to be touched, and nothing can be missed because there is nowhere
 * else a photograph is named.
 *
 * `null` is a real, supported value, not a gap waiting to be filled. Five
 * service pages run on type and colour alone because no honest stock photo
 * exists for them (see the notes). The layout is built for that: a page
 * without a photo degrades to a flat charcoal field and still looks finished.
 * Do not go and find "something close" for those five. A photograph that
 * misrepresents the service is worse than no photograph.
 *
 * RULES FOR ANY REPLACEMENT, stock or real:
 *   - No trucks, trailers, dumpsters or crews, even unbranded. Next to the EJC
 *     name they read as Earl's own equipment, which would be a claim.
 *   - No company branding, logos, readable lettering, or licence plates.
 *   - No identifiable people who could be taken for Earl or his crew.
 *   - Hero, service page banners and section backgrounds only. No gallery,
 *     no "our work", no before-and-after, until the photos are genuinely his.
 */

/** The business's own logo. Not stock. Masked from the supplied artwork. */
export const LOGO = 'ejc-logo.png'

export const STOCK = {
  /** Homepage hero. Reused on the yard waste page; it is the same photograph. */
  hero: 'uprooted-tree-on-lawn.jpg',
  /** About page. */
  about: 'stacked-cardboard-boxes.jpg',

  junkRemoval: 'basement-with-old-furniture.jpg',
  furnitureRemoval: 'discarded-sofa-at-kerb.jpg',
  garageCleanouts: 'residential-garage-with-shelving.jpg',
  estateCleanouts: 'attic-with-stored-paintings-and-furniture.jpg',
  constructionDebris: 'broken-concrete-and-brick-pile.jpg',
  commercialCleanouts: 'emptied-hall-with-stacked-chairs.jpg',
  propertyCleanouts: 'moving-boxes-in-empty-room.jpg',
  yardWasteRemoval: 'uprooted-tree-on-lawn.jpg',

  // ---- Deliberately null. Each one was searched for and rejected. ----

  /**
   * Every "old appliance" result on Pexels is either a styled vintage prop or a
   * decayed unit carrying a readable manufacturer badge. One candidate was
   * rejected at full size for exactly that.
   */
  applianceRemoval: null,
  /**
   * Every discarded-mattress photograph available is shot as urban decay:
   * squats, graffiti, abandonment. Fine as editorial, wrong beside a service
   * a person is deciding whether to trust with their house.
   */
  mattressDisposal: null,
  /**
   * NEVER fill this one. A photograph of a hoarded home published next to a
   * hoarder cleanout page is somebody's house and somebody's circumstances
   * used as advertising. The page runs on type and copy, and the copy does the
   * work instead.
   */
  hoarderCleanouts: null,
  /**
   * No photograph exists of a deck or shed mid-dismantling without machinery
   * or a crew in frame. The results are all abandonment and ruin, which says
   * something different from "we take it apart and haul it away".
   */
  lightDemolition: null,
  /** No hot tub photograph that is not a lifestyle spa shoot. */
  hotTubRemoval: null,
} as const
