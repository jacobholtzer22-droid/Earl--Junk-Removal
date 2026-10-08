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
/**
 * The client's brand mark, supplied October 2026. Two files, because the
 * lockup is artwork rather than type and cannot be recoloured: the dark one
 * has black HOUSTON lettering and needs a light ground, the white one is the
 * knockout and needs a dark ground. Pick by the surface, never by recolouring.
 *
 * Both are the supplied PNGs with their transparent padding trimmed and
 * nothing else done to them. Originals in client-assets/brand-2026-10.
 */
export const LOGO = 'houston-waste-removal-logo.png'
export const LOGO_ON_DARK = 'houston-waste-removal-logo-white.png'

export const STOCK = {
  /**
   * Homepage hero: old furniture in a basement. The same photograph as the
   * junk removal page, which is the point. The hero should show JUNK, and a
   * dresser, a curio cabinet and stacked boxes are exactly what this business
   * is called to take away.
   *
   * It replaced an uprooted tree, which showed storm damage: true of one of
   * the thirteen services and misleading about the other twelve. The tree now
   * belongs to yard waste alone.
   *
   * Three candidates were measured at 390 and 1440 rather than eyeballed, for
   * two things: whether the white headline still clears AA against the
   * brightest point behind it, and how much of the picture survives the scrim.
   *
   *   image      headline      visible variation, 390 / 1440
   *   tree       10.22:1       0.141 / 0.129
   *   basement    7.11:1       0.081 / 0.087, and the highest mean of the three
   *   garage      7.63:1       0.064 / 0.062, the flattest and darkest
   *
   * All three hold the headline comfortably; AA large text needs 3.0. The
   * garage is out because it reads as a dark field at both widths. The
   * basement carries less variation than the tree but more light, and it
   * shows the right thing.
   */
  hero: 'basement-with-old-furniture.jpg',
  /**
   * NULL ON PURPOSE, and it must stay null while the photography is stock.
   *
   * The About page and the homepage's about band are the two places on this
   * site that are explicitly about Earl and his company. A photograph there
   * does not illustrate a service, it illustrates HIM, so a stock image in
   * that slot is read by every visitor as his premises, his work or his crew.
   * That is a claim, and it is not one we can make.
   */
  about: null,

  junkRemoval: 'basement-with-old-furniture.jpg',
  furnitureRemoval: 'discarded-sofa-at-kerb.jpg',
  garageCleanouts: 'residential-garage-with-shelving.jpg',
  estateCleanouts: 'attic-with-stored-paintings-and-furniture.jpg',
  constructionDebris: 'broken-concrete-and-brick-pile.jpg',
  commercialCleanouts: 'emptied-hall-with-stacked-chairs.jpg',
  propertyCleanouts: 'moving-boxes-in-empty-room.jpg',
  yardWasteRemoval: 'uprooted-tree-on-lawn.jpg',

  // ---- Added October 2026, when the client asked for more photography. ----

  /** A bare mattress on a frame in a stripped room. Not urban decay. */
  mattressDisposal: 'bare-mattress-in-stripped-bedroom.jpg',
  /**
   * Hand-labelled storage bins, NOT a hoarded home. The rule against
   * photographing hoarding stands; this is the neutral image that replaces it.
   */
  hoarderCleanouts: 'labelled-storage-bins-stacked.jpg',
  /** A weathered garden shed, which is the commonest light demolition job. */
  lightDemolition: 'weathered-garden-shed.jpg',
  /** CROPPED: left 11% removed, which carried a readable safety notice. */
  hotTubRemoval: 'weathered-hot-tub-on-patio.jpg',
  /** CROPPED: top 22% removed, which carried a readable PetSafe brand mark. */
  ctaBand: 'boxes-of-household-items-set-out.jpg',

  /**
   * STILL NULL, and now on the record as needing a real photograph.
   *
   * Three searches, the limit agreed for this round: Pexels "old washing
   * machine", Pexels "old refrigerator kitchen", Unsplash "old-refrigerator".
   * Every result was one of three things: a working kitchen, a styled studio
   * product shot, or an old unit with its manufacturer's badge on the door.
   * The badge is the killer, because it sits on the subject itself and cannot
   * be cropped out without losing the appliance.
   *
   * The appliance removal page and card fall back to a brand-green block.
   * See CLIENT-TODO item 24.
   */
  applianceRemoval: null,
} as const
