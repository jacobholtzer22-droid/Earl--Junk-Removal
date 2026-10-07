import type { SiteConfigInput } from './lib/config-schema'
import { LOGO, STOCK } from './lib/stock-images'

/**
 * Every business fact for Houston Waste Removal, operated by EJC Demo Junk &
 * Haul, lives here and nowhere else.
 *
 * SOURCED ENTIRELY FROM seo/FACTS.md. If a claim is not in that file it is not
 * in this one: no license number, no insurance status, no years in business,
 * no job counts, no prices, no response times, no disposal or recycling
 * percentages, no reviews. Unknown is `null`, and a null field renders nothing.
 * An empty slot on the page is correct. A plausible guess is a defect.
 *
 * Open questions live in the client question list at the repo root, not in
 * here as a half-filled value.
 */
const siteConfig = {
  /**
   * PRE-LAUNCH. The platform Business row does not exist yet, so there is no
   * slug to send. Empty is a legal value (see lib/config-schema.ts) and makes
   * components/PendingFormGate.tsx hold the contact form shut rather than
   * posting a blank slug the platform would drop on the floor.
   *
   * verify.ts check 2 stays red until this is filled in. That is intentional.
   */
  businessSlug: 'houston-waste-removal-1791303748120',

  legalName: 'Mustang Logistix LLC',
  /**
   * The customer-facing brand. EJC Demo Junk & Haul is the operating company
   * and stays visible: in the header lockup, in the footer, on the about page,
   * in a homepage FAQ, in llms.txt, and as schema.org alternateName. A visitor
   * who was recommended one name and lands on the other has to be able to tell
   * they are the same business, in one glance.
   */
  displayName: 'Houston Waste Removal',
  alternateName: 'EJC Demo Junk & Haul',
  tagline: 'Veteran owned junk removal, cleanouts, and light demolition serving Houston, Texas seven days a week.',

  // Service-area business, no storefront. LocalBusiness is the honest type:
  // the work spans hauling, cleanouts and light demolition, so neither
  // MovingCompany nor GeneralContractor describes it.
  schemaType: 'LocalBusiness',

  phone: '+17132919440',
  email: 'ejcdjh75@gmail.com',

  // No published street address. Service-area business, so the address block
  // and every address-dependent schema property are omitted entirely.
  address: null,

  primaryCity: 'Houston',
  primaryState: 'TX',

  /**
   * The eight places besides Houston, each verified against a public source
   * before it was written about. Status, county and the source URL for every
   * one are in seo/AREA-SOURCES.md.
   *
   * placeType is NOT decorative. Cypress, Spring and The Woodlands are not
   * incorporated cities, and calling them City in structured data would be
   * false. schema.org has no census-designated-place type, so they use Place.
   *
   * NONE OF THESE HAS BEEN CONFIRMED BY EARL ONE BY ONE. The list was drawn
   * from a driving radius he gave. See item 3 on the client question list at the repo root; a page for a place
   * he will not drive to is worse than no page, because it ranks.
   */
  serviceAreas: [
    { slug: 'houston', name: 'Houston', county: 'Harris County', placeType: 'City', titleOverride: null, faqs: [] },
    {
      slug: 'katy',
      name: 'Katy',
      county: 'Harris, Fort Bend and Waller counties',
      placeType: 'City',
      // "Junk Removal in Katy, TX | Houston Waste Removal" is 48 characters.
      // Short name, wasted width.
      titleOverride: 'Junk Removal and Hauling in Katy, TX',
      faqs: [
        {
          q: 'Which county is my Katy address in?',
          a: 'It depends which side of town you are on. Katy sits at the tripoint of Harris, Fort Bend and Waller counties, so three different county lines run through the same city. It makes no difference to a quote, but it is worth knowing when a permit or a deed is involved.',
        },
        {
          q: 'Do you take construction debris from a Katy remodel?',
          a: 'Yes. Lumber, drywall, roofing tear-off, concrete, brick and scrap metal all come under construction debris removal. Say what the pile is made of when you call, because weight drives that job more than volume does.',
        },
        {
          q: 'Can you pick up the same day in Katy?',
          a: 'Same-day service is available. Call and ask what is still open today rather than assuming it is too late; the phone is answered seven days a week from 8:00am to 5:00pm.',
        },
      ],
    },
    {
      slug: 'sugar-land',
      name: 'Sugar Land',
      county: 'Fort Bend County',
      placeType: 'City',
      titleOverride: null,
      faqs: [
        {
          q: 'Do you clear properties for realtors in Sugar Land?',
          a: 'Yes. Listing preparation, move-outs, evictions and foreclosure cleanouts are all on the property cleanouts page, and the estimate is virtual, which matters when you are running several Fort Bend County listings at once and cannot meet anyone on site.',
        },
        {
          q: 'What about an address outside the Sugar Land city limits?',
          a: 'Ask when you call. A Sugar Land postal address and the incorporated city are not always the same boundary, and the only way to know whether yours is covered is to say the address out loud to someone.',
        },
        {
          q: 'Do you remove hot tubs and sheds in Sugar Land?',
          a: 'Yes, and they are two different jobs on the list. A hot tub is broken down where it sits and carried out in pieces; a shed comes under light demolition, where the teardown and the debris are quoted together.',
        },
      ],
    },
    {
      slug: 'pearland',
      name: 'Pearland',
      county: 'Brazoria County, with portions in Fort Bend and Harris',
      placeType: 'City',
      titleOverride: null,
      faqs: [
        {
          q: 'Pearland sits in three counties. Does that change anything?',
          a: 'Not for a quote. Pearland is mostly in Brazoria County with portions reaching into Fort Bend and Harris, which can matter for a permit rather than for what it costs to empty a garage.',
        },
        {
          q: 'Do you handle estate cleanouts in Pearland?',
          a: 'Yes. Whole-property clearing for executors and families is on the estate cleanouts page, the pace is agreed when the job is quoted, and the estimate is virtual so an out-of-state executor does not need to travel for a price.',
        },
        {
          q: 'Is the estimate really free for a Pearland address?',
          a: 'Yes, and it is free whether or not you book. That is the whole point of a virtual estimate: you have a price before you commit to anything, and nothing is owed if you decide against it.',
        },
      ],
    },
    {
      slug: 'cypress',
      name: 'Cypress',
      county: 'Harris County',
      placeType: 'Place',
      titleOverride: null,
      faqs: [
        {
          q: 'Is Cypress its own city?',
          a: 'No. Cypress is an unincorporated community in Harris County, and it sits entirely inside the City of Houston extraterritorial jurisdiction. There is no Cypress city hall, which is why permits and rules get routed through the county or through Houston.',
        },
        {
          q: 'Do you clear garages and storage units in Cypress?',
          a: 'Yes, and they are the same job with one difference worth planning around: a storage facility has access hours and they are often narrower than ours. Mention them when you book so the visit lands inside them.',
        },
        {
          q: 'Can you come out at the weekend in Cypress?',
          a: 'Yes. Saturday and Sunday are ordinary working days here, 8:00am to 5:00pm, same as the rest of the week. After-hours calls are answered too.',
        },
      ],
    },
    {
      slug: 'spring',
      name: 'Spring',
      county: 'Harris County, with a smaller area in Montgomery',
      placeType: 'Place',
      titleOverride: null,
      faqs: [
        {
          q: 'Which Spring do you mean?',
          a: 'Whichever one you live in. Spring is a census-designated place in Harris County, but the name is popularly applied to a much larger stretch of northern Harris County and a smaller area of southern Montgomery County. Give the address and it stops being ambiguous.',
        },
        {
          q: 'Do you clear storm debris in Spring?',
          a: 'Yes. Brush, limbs, leaves and whatever the wind brought down come under yard waste and storm debris removal, along with old fencing and decking. Emergency after-hours service is available and a trip charge applies; ask what it is when you call.',
        },
        {
          q: 'Do you take appliances and mattresses from a Spring home?',
          a: 'Yes, and each has its own page. Appliance removal covers refrigerators, washers, dryers and water heaters; mattress disposal covers any size, box spring included. Both can go in one visit if you mention both when you call.',
        },
      ],
    },
    {
      slug: 'the-woodlands',
      name: 'The Woodlands',
      county: 'Montgomery County, with portions in Harris',
      placeType: 'Place',
      titleOverride: null,
      faqs: [
        {
          q: 'Is The Woodlands a city?',
          a: 'No, and residents have chosen to keep it that way. The Woodlands is a special-purpose district and census-designated place, run by The Woodlands Township and its elected board rather than by a city council. Residents voted against incorporation in 2021.',
        },
        {
          q: 'Do you do commercial cleanouts in The Woodlands?',
          a: 'Yes. Offices, retail units, warehouses, restaurants and hotels are all on the commercial cleanouts page, including the furniture, appliances and kitchen equipment inside them. Say what window you need when you call and ask what fits it.',
        },
        {
          q: 'What about work outside normal hours in The Woodlands?',
          a: 'After-hours calls are answered, and emergency after-hours service is available with a trip charge. Ask what the charge is before you book rather than after the work is done.',
        },
      ],
    },
    {
      slug: 'pasadena',
      name: 'Pasadena',
      county: 'Harris County',
      placeType: 'City',
      titleOverride: null,
      faqs: [
        {
          q: 'Do you cover all of Pasadena?',
          a: 'Ask with the address. Pasadena is an incorporated city in Harris County, and a postal address does not always match the limits of an incorporated city, here or anywhere else.',
        },
        {
          q: 'Do you clear out rental properties in Pasadena?',
          a: 'Yes. Tenant eviction cleanouts, move-outs and listing preparation are on the property cleanouts page, and same-day service is available when a unit has to be empty by a particular date.',
        },
        {
          q: 'Do you take renovation debris in Pasadena?',
          a: 'Yes. Construction and renovation waste, roofing tear-off, concrete, brick, lumber and scrap metal all come under construction debris removal, and repeat visits across a build are quoted the same way as a single clear.',
        },
      ],
    },
    {
      slug: 'humble',
      name: 'Humble',
      county: 'Harris County',
      placeType: 'City',
      titleOverride: null,
      faqs: [
        {
          q: 'Do you serve Humble itself or the wider area?',
          a: 'Both are worth asking about. Humble is an incorporated city in Harris County, and a postal address does not always match the limits of an incorporated city, so give the address rather than the city name and you will get a straight answer.',
        },
        {
          q: 'Do you do hoarder and estate cleanouts in Humble?',
          a: 'Yes, and both are handled with the pacing agreed before any work starts. Say what you need when you call: discretion, stages across several visits, or anything set aside and kept.',
        },
        {
          q: 'Is the virtual estimate available for Humble addresses?',
          a: 'Yes. It costs nothing whether or not you go ahead, and you have a price before you commit. Call and ask how to set one up.',
        },
      ],
    },
  ],

  services: [
    {
      slug: 'junk-removal',
      name: 'Junk Removal',
      shortDescription:
        'Household junk hauled away: boxes, bags, old furniture, electronics, and whatever else has stacked up.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.junkRemoval,
      titleOverride: null,
      faqs: [
        {
          q: 'How much does junk removal cost in Houston?',
          a: 'There is no flat rate, because a few bags and a full garage are not the same job. Houston Waste Removal gives a free virtual estimate, so you have a price before you commit to anything.',
        },
        {
          q: 'Can you come out the same day?',
          a: 'Same-day service is available. Call and ask what is open today. If it cannot be today, we are open seven days a week from 8:00am to 5:00pm.',
        },
        {
          q: 'Do I have to move everything outside first?',
          a: 'No. Say where the items are when you call. If it is upstairs, in a back room, or behind a shed, mention it during the estimate so it is part of what gets quoted.',
        },
        {
          q: 'What happens to everything after you take it?',
          a: 'Recycling pickup, donation drop-off, scrap metal recycling and electronics recycling are all on the service list. Ask about a specific item during your estimate.',
        },
      ],
    },
    {
      slug: 'furniture-removal',
      name: 'Furniture Removal',
      shortDescription:
        'Couches, sectionals, mattresses, dressers, and desks carried out and hauled off, including from upstairs and tight stairwells.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.furnitureRemoval,
      titleOverride: null,
      faqs: [
        {
          q: 'Can you get a sectional down a narrow staircase?',
          a: 'Often it has to come apart to get out, and that is worth mentioning during the estimate. Doorway width, stair turns and whether a piece separates all affect the job, so flag them early.',
        },
        {
          q: 'Will you take just one piece of furniture?',
          a: 'Yes. Call with whatever you have, however small, and ask for a quote on it.',
        },
        {
          q: 'Do you remove office furniture as well as household?',
          a: 'Yes. Commercial furniture and appliance removal is part of what we do, alongside office, retail, and warehouse cleanouts. The scheduling is the same; call and tell us what the space looks like.',
        },
      ],
    },
    {
      slug: 'appliance-removal',
      name: 'Appliance Removal',
      shortDescription:
        'Refrigerators, washers, dryers, ranges, water heaters, and freezers taken out of the spot they have sat in and hauled away.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.applianceRemoval,
      titleOverride: null,
      faqs: [
        {
          q: 'Do you take refrigerators and freezers?',
          a: 'Yes. Refrigerators and freezers come under appliance removal. Mention the size and where the unit sits when you call, so it is part of the quote.',
        },
        {
          q: 'Can you take the old one away when a new one is delivered?',
          a: 'Yes, and timing it around a delivery window is worth raising when you book. We are open seven days a week from 8:00am to 5:00pm, and same-day service is available if the delivery lands sooner than planned.',
        },
        {
          q: 'What do you do with old appliances?',
          a: 'Appliance recycling and scrap metal recycling are both on the service list. Ask about your specific unit during the free virtual estimate.',
        },
      ],
    },
    {
      slug: 'mattress-disposal',
      name: 'Mattress Disposal',
      shortDescription:
        'Mattresses and box springs of any size, taken out of the bedroom and hauled away.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.mattressDisposal,
      titleOverride: null,
      faqs: [
        {
          q: 'Will you take a mattress and the box spring together?',
          a: 'Yes. Mention both when you call so the estimate covers the whole set rather than one piece of it.',
        },
        {
          q: 'Do you handle more than one mattress at a time?',
          a: 'Yes. Move-outs, rentals and property turnovers can mean several at once. Give the number during the free virtual estimate so the whole load is quoted.',
        },
        {
          q: 'Can you pick one up the same day I call?',
          a: 'Same-day service is available, so call and ask what is open. We work seven days a week from 8:00am to 5:00pm, and after-hours calls are answered.',
        },
      ],
    },
    {
      slug: 'garage-cleanouts',
      name: 'Garage Cleanouts',
      shortDescription:
        'Garages, attics, basements, and storage units cleared from front to back, including the things stacked behind everything else.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.garageCleanouts,
      titleOverride: null,
      faqs: [
        {
          q: 'Do I need to sort everything before you arrive?',
          a: 'No. Point out anything that stays before work starts. If you would rather sort first, that works too, but a garage cleanout does not require it.',
        },
        {
          q: 'Can you clear a storage unit instead of a garage?',
          a: 'Yes. Storage unit cleanouts work the same way as a garage, with one difference worth planning around: facility access hours. Mention them when you book so the visit lands inside them.',
        },
        {
          q: 'How long does a garage cleanout take?',
          a: 'It depends on how full it is and how much has to be carried, which is what the free virtual estimate is for. Ask for the scope as well as the price.',
        },
        {
          q: 'Do you clear attics and basements as well?',
          a: 'Yes. Attic, basement and storage cleanouts all fall under this service. Mention the stairs, hatches or pull-down ladders involved during the estimate so the access is part of what gets quoted.',
        },
      ],
    },
    {
      slug: 'estate-cleanouts',
      name: 'Estate Cleanouts',
      shortDescription:
        'Whole-property clearing for executors and families settling an estate, with the pace agreed when the job is quoted.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.estateCleanouts,
      titleOverride: null,
      faqs: [
        {
          q: 'What if we have not finished deciding what to keep?',
          a: 'Say so when you call. Mark or set aside whatever stays before work starts, and ask about splitting the job across visits if the family needs time.',
        },
        {
          q: 'Can you work with an executor who lives out of state?',
          a: 'Yes. The estimate is virtual and free, so you do not need to be in Houston to get a price. Arrange property access when you book.',
        },
        {
          q: 'Do you handle donation of usable items?',
          a: 'Donation drop-off is on the service list. Say during the estimate which items you would rather see donated than discarded, and ask what is workable for them.',
        },
      ],
    },
    {
      slug: 'hoarder-cleanouts',
      name: 'Hoarder Cleanouts',
      shortDescription:
        'Heavily filled homes cleared, with discretion and pacing agreed before any work starts.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.hoarderCleanouts,
      titleOverride: null,
      faqs: [
        {
          q: 'Will anyone judge the condition of the home?',
          a: 'You do not owe anyone an explanation of how the house got this way, and you do not have to give one to get a quote. Ask about discretion directly when you call.',
        },
        {
          q: 'Can the work be done in stages?',
          a: 'Ask about splitting the work across several visits. Say what pace suits the household during the free virtual estimate and ask for the schedule to be set around it.',
        },
        {
          q: 'How do we keep this private?',
          a: 'Say what discretion you need and when, and ask how the visit can be arranged around it. We work seven days a week from 8:00am to 5:00pm.',
        },
        {
          q: 'What if we find things we want to keep partway through?',
          a: 'Say so and set them aside. Anything you want to keep is worth marking before work starts, and worth saying straight away if you change your mind partway.',
        },
      ],
    },
    {
      slug: 'construction-debris-removal',
      name: 'Construction Debris Removal',
      shortDescription:
        'Lumber, drywall, roofing tear-off, concrete, brick, and scrap metal cleared off the site so the next trade can get to work.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.constructionDebris,
      titleOverride: 'Construction Debris Removal Houston',
      faqs: [
        {
          q: 'Do you take concrete and brick?',
          a: 'Yes. Concrete and brick removal and scrap metal hauling are part of this service, alongside lumber disposal and roofing debris. Say what the pile is made of when you call, because weight changes the job.',
        },
        {
          q: 'Can you come back between phases of a job?',
          a: 'Yes. Repeat visits across a build are quoted the same way as a single clear, and we are open seven days a week from 8:00am to 5:00pm.',
        },
        {
          q: 'Do you work with contractors directly?',
          a: 'Yes, and there is a referral program for contractors who send work our way: $20 for a verified lead that requests a quote, and $75 for a lead that books and has the job completed.',
        },
      ],
    },
    {
      slug: 'light-demolition',
      name: 'Light Demolition',
      shortDescription:
        'Sheds, decks, fences, playground sets, and similar structures taken apart, with the debris hauled off as well.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.lightDemolition,
      titleOverride: null,
      faqs: [
        {
          q: 'What counts as light demolition?',
          a: 'Freestanding structures and attached features that come apart without structural work: sheds, decks, fences, playground equipment, carpet, and interior fixtures. If you are unsure yours fits, describe it during the free estimate.',
        },
        {
          q: 'Do you haul the debris away too?',
          a: 'Yes. Demolition and removal are both on the service list, so clearing the debris can be quoted with the teardown rather than as a second job.',
        },
        {
          q: 'Do I need a permit?',
          a: 'That depends on the structure and your local rules, and it is worth checking with the City of Houston or your HOA before work is scheduled. We cannot answer that for your specific property.',
        },
      ],
    },
    {
      slug: 'hot-tub-removal',
      name: 'Hot Tub Removal',
      shortDescription:
        'Old hot tubs and spas broken down where they sit and carried out piece by piece, including from decks and back yards.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.hotTubRemoval,
      titleOverride: null,
      faqs: [
        {
          q: 'Does the hot tub have to be drained first?',
          a: 'It needs to be empty before it can be moved, so draining it ahead of the visit saves time. If that is not something you can do, raise it during the estimate rather than on the day.',
        },
        {
          q: 'What if the tub is on a deck or behind a fence?',
          a: 'That is why a hot tub is often cut down on site rather than carried out whole. Describe the access during the free virtual estimate so the route out is part of what gets quoted.',
        },
        {
          q: 'Will the deck or patio be damaged?',
          a: 'Point out anything you are concerned about before work starts, including decking, pavers and sprinkler heads on the path out, and ask how the route out will be handled.',
        },
      ],
    },
    {
      slug: 'commercial-cleanouts',
      name: 'Commercial Cleanouts',
      shortDescription:
        'Offices, retail spaces, warehouses, restaurants, and hotels cleared out, including furniture, appliances, and kitchen equipment.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.commercialCleanouts,
      titleOverride: null,
      faqs: [
        {
          q: 'Can you work outside our business hours?',
          a: 'Scheduling runs seven days a week from 8:00am to 5:00pm, after-hours calls are answered, and emergency after-hours service is available with a trip charge. Say what window you need when you call and ask what fits it.',
        },
        {
          q: 'Do you remove restaurant equipment?',
          a: 'Yes. Restaurant equipment removal is part of commercial work here, along with office, retail, warehouse, and hotel and hospitality cleanouts.',
        },
        {
          q: 'Who is commercial work for?',
          a: 'Business owners, property managers, hotels, storage facility operators, and municipalities, as well as contractors clearing a space between tenants. Tell us which you are and the quote will reflect that scope.',
        },
      ],
    },
    {
      slug: 'property-cleanouts',
      name: 'Property Cleanouts for Realtors and Property Managers',
      shortDescription:
        'Evictions, foreclosures, move-outs, and listing preparation cleared on a turnover schedule so the unit is ready to show.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.propertyCleanouts,
      titleOverride: 'Property Cleanouts in Houston, TX',
      faqs: [
        {
          q: 'How fast can a unit be cleared between tenants?',
          a: 'Same-day service is available, and we work seven days a week from 8:00am to 5:00pm. Call with the date you need it empty by and ask what is open.',
        },
        {
          q: 'Do you handle eviction and foreclosure cleanouts?',
          a: 'Yes. Tenant eviction cleanouts, foreclosure cleanouts, and moving cleanouts are all part of this service, as is clearing a property so it photographs well for a listing.',
        },
        {
          q: 'Can you quote without me meeting you there?',
          a: 'Yes. The virtual estimate is free and does not require you on site, which matters when you are managing several properties. Arrange access with us and you will have a price before the visit.',
        },
        {
          q: 'Is there anything in it for referring other agents?',
          a: 'Yes. The referral program pays $20 for a verified lead that requests a quote and $75 for a lead that books and has the job completed. It is open to realtors, property managers, and trade contractors.',
        },
      ],
    },
    {
      slug: 'yard-waste-removal',
      name: 'Yard Waste and Storm Debris Removal',
      shortDescription:
        'Brush, limbs, leaves, and storm debris cleared from the yard, plus old fencing, decking, and outdoor furniture.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate',
      image: STOCK.yardWasteRemoval,
      titleOverride: 'Yard Waste Removal in Houston, TX',
      faqs: [
        {
          q: 'Do you clear storm debris after a Houston storm?',
          a: 'Yes. Storm debris cleanup is part of this service, along with brush and tree debris removal. Emergency after-hours service is available and a trip charge applies; call and ask what it is for your job.',
        },
        {
          q: 'Will you take fencing and old outdoor furniture too?',
          a: 'Yes. Fence removal, deck removal, playground equipment, and outdoor furniture all come under yard work here, so a single visit can clear the whole back yard rather than just the brush.',
        },
        {
          q: 'Do you cut down trees?',
          a: 'We remove brush, limbs and debris that is already down. Felling a standing tree is a different trade; if that is what you need, get it dropped first, and clearing the debris is a job for us.',
        },
      ],
    },
  ],

  // Monday through Sunday, 8:00am to 5:00pm Central. After-hours calls are
  // answered and emergency service is available with a trip charge, but that
  // is not a posted opening hour and is not represented here.
  hours: [
    { day: 'Monday', open: '08:00', close: '17:00' },
    { day: 'Tuesday', open: '08:00', close: '17:00' },
    { day: 'Wednesday', open: '08:00', close: '17:00' },
    { day: 'Thursday', open: '08:00', close: '17:00' },
    { day: 'Friday', open: '08:00', close: '17:00' },
    { day: 'Saturday', open: '08:00', close: '17:00' },
    { day: 'Sunday', open: '08:00', close: '17:00' },
  ],

  // In business under a year. Tenure is deliberately not displayed, so this is
  // null rather than 1: a "1 year in business" badge is worse than silence.
  yearsInBusiness: null,
  // Not supplied. No licensing or insurance claim appears anywhere on the site.
  licenseNumber: null,
  insured: null,

  // No reviews supplied. Review and aggregateRating schema cannot render while
  // this is empty, which is the correct state.
  reviews: [],

  profiles: {
    // No Google Business Profile yet.
    gbp: null,
    // Both built from client-supplied handles. UNVERIFIED: Facebook returns
    // 400 to non-browser requests and Instagram serves a login wall, so
    // neither could be confirmed to resolve. Item 16 on the client question
    // list at the repo root.
    facebook: 'https://www.facebook.com/ejcdjh75',
    instagram: 'https://www.instagram.com/ejcdjh75',
    yelp: null,
  },

  faqs: [
    {
      q: 'Is Houston Waste Removal the same company as EJC Demo Junk & Haul?',
      a: 'Yes. Houston Waste Removal is the name the business trades under, EJC Demo Junk & Haul is the company that operates it, and Mustang Logistix LLC is the registered legal name. One business, one phone number, three names. If you were recommended any of them, you are in the right place.',
    },
    {
      q: 'What areas does Houston Waste Removal serve?',
      a: 'We serve the Houston, Texas area. If you are not sure whether your address is covered, call and ask rather than guessing; it is a short conversation and it saves everyone a wasted trip.',
    },
    {
      q: 'How much does junk removal cost?',
      a: 'Price depends on what you have and how hard it is to reach, so there is no single number. You get a free virtual estimate, which means you have the cost before you commit to anything.',
    },
    {
      q: 'What is a free virtual estimate?',
      a: 'It is a quote that costs nothing, whether or not you go ahead. Call and ask how to set one up.',
    },
    {
      q: 'Can you come out today?',
      a: 'Same-day service is available. We are open Monday through Sunday, 8:00am to 5:00pm Central, so call and ask what is still open today rather than assuming it is too late.',
    },
    {
      q: 'Do you answer calls after hours?',
      a: 'Yes. After-hours calls are answered, and emergency after-hours service is available. A trip charge applies for emergency calls outside the hours above; call and ask what it is.',
    },
    {
      q: 'Is there a discount for first-time customers?',
      a: 'Yes. New customers get $50 off their first service. Mention it when you call or when you request your free estimate so it is applied to the quote rather than after the fact.',
    },
    {
      q: 'Who do you work with besides homeowners?',
      a: 'Renters, realtors, property managers, contractors, businesses, municipalities, senior citizens, estate executors, and storage facility operators. The scheduling and the free estimate work the same way for all of them.',
    },
    {
      q: 'Is Houston Waste Removal veteran owned?',
      a: 'Yes. It is a veteran owned business, owned by Earl. The "Demo" in the name is short for demolition, which is why light demolition sits alongside hauling and cleanouts on the service list.',
    },
  ],

  /**
   * Q&A for the five standalone pages. See lib/config-schema.ts pageFaqs for
   * why it lives here rather than in the MDX.
   *
   * about, services, areas and referral are the questions that were already
   * visible on those pages as headings in content/*.mdx with the answer in the
   * paragraph underneath. The words are the same words; moving them here is
   * what puts FAQPage markup over them without writing them twice. The couple
   * of headings that were statements rather than questions ("Why this exists")
   * are now phrased as the question they were already answering.
   *
   * contact is the only new copy. That page had no Q&A of any kind, and every
   * answer below comes from seo/FACTS.md: the estimate is virtual and free,
   * access is arranged at booking, the phone is answered seven days a week.
   * Nothing here promises a response time, because no response time was given.
   */
  pageFaqs: {
    about: [
      {
        q: 'Is this the same company as EJC Demo Junk & Haul?',
        a: 'Yes. Houston Waste Removal is the name the business trades under, EJC Demo Junk & Haul is the company that operates it, and Mustang Logistix LLC is the registered legal name. One business, one phone number, three names. If someone recommended any of them to you, you are in the right place.',
      },
      {
        q: 'What does the "Demo" in EJC Demo Junk & Haul stand for?',
        a: 'Demolition. It is in the name because light demolition is on the service list alongside hauling: sheds, decks, fences, playground sets and interior fixtures. Because both are services here, the teardown and the debris can be quoted together rather than as two jobs.',
      },
      {
        q: 'How do you work?',
        a: 'You call or send the form, describe what you have, and get a free virtual estimate before you commit to anything. Mark anything that is staying before work starts, and if what is on site turns out to be different from what you described, raise it and ask for the quote to be looked at again.',
      },
      {
        q: 'Who do you work for?',
        a: 'Homeowners and renters, realtors and property managers, contractors, businesses and municipalities, senior citizens, estate executors, and storage facility operators. The scheduling and the free estimate work the same way whichever of those you are.',
      },
    ],
    services: [
      {
        q: 'Can you do more than one of these in a visit?',
        a: 'Ask when you call. A garage cleanout plus a shed that has to come down plus the brush pile out back can be quoted as one job rather than three. Mention everything during the free virtual estimate so the quote covers the whole lot.',
      },
      {
        q: 'What if my job is not on this list?',
        a: 'Call and ask. This list is not a boundary. We also handle labour-only moving help, packing and unpacking, pressure washing, dumpster rental coordination, event cleanup and subscription junk pickup, which do not each need their own page to be real.',
      },
      {
        q: 'How are these services priced?',
        a: 'None of them has a flat rate, because a few bags and a full garage are not the same job. Every service on this list is priced by a free virtual estimate, so you have the number before you commit to anything, and nothing is owed if you decide against it.',
      },
    ],
    areas: [
      {
        q: 'Why are these places listed individually?',
        a: 'Because three of them are not cities, and that trips people up. Cypress is an unincorporated community, Spring is a census-designated place, and The Woodlands is a township that voted against becoming a city. A postal address in any of them can sit outside the boundary a map shows you, which is why every page here says to give the address rather than the place name.',
      },
      {
        q: 'What if my address is not on the list?',
        a: 'Call and ask. The list is where the work usually goes, not a fence. It is a short conversation and it beats guessing from a map.',
      },
      {
        q: 'Can you come out the same day in these areas?',
        a: 'Same-day service is available. Rather than deciding for yourself that it is too late, call and ask what is still open today; the phone is answered Monday through Sunday, 8:00am to 5:00pm Central.',
      },
    ],
    contact: [
      {
        q: 'What happens after I send this form?',
        a: 'It reaches Earl, who runs the business, and he follows up to set up your free virtual estimate. If you would rather not wait on a reply, call instead; the phone is answered Monday through Sunday, 8:00am to 5:00pm Central.',
      },
      {
        q: 'What should I have ready when I call?',
        a: 'Roughly what the items are, which room or part of the property they are in, and anything awkward about reaching them: stairs, a narrow doorway, a locked back gate, a long carry from the kerb. Access affects a quote as much as volume does, so it is better said now than discovered on the day.',
      },
      {
        q: 'Do I need to be there?',
        a: 'Not to get a price. The estimate is virtual, so nobody has to meet anyone to work out what the job costs. Property access is arranged when you book, and that is the point to say whether you will be there or leaving a gate unlocked.',
      },
    ],
    referral: [
      {
        q: 'Why does this program exist?',
        a: 'You are already standing in the garage, the crawlspace and the gutted bathroom. You see the pile before anyone else does, and if hauling is not your trade there is nothing you can do with it. This turns that into something you get paid for instead.',
      },
      {
        q: 'What counts as a lead?',
        a: 'Someone you sent who contacts us and asks for a quote. The first payment is for that, whether or not it becomes a job. The second, larger payment is for a referral that books and has the work completed.',
      },
      {
        q: 'How do I set it up?',
        a: 'Call before you refer anybody. Agree with Earl how you will pass work over, what counts as verified on your jobs, and how you want to be paid. Settling that in one phone call up front is how this stays simple later.',
      },
    ],
  },

  images: {
    hero: STOCK.hero,
    about: STOCK.about,
    // Empty on purpose. There are no client photographs yet, and a gallery of
    // licensed stock would imply these are EJC's own jobs. The Gallery section
    // does not render while this is empty.
    gallery: [],
    // The real logo. Keeps stock photography out of schema.org `logo` and the
    // social card. See lib/schema.ts logoUrl().
    logo: LOGO,
  },

  // No contactForm block: the baseline four fields only. Every extra field is
  // a reason a visitor abandons the form, and nothing in FACTS.md says Earl
  // needs an address, a ZIP or a service dropdown to quote. Revisit with him
  // rather than switching options on because they look useful.

  // Pre-launch. Cannot be true while businessSlug is empty; the schema refuses
  // to parse that combination and the build fails. Flip to true in the same
  // commit that sets `domain` to the real purchased host.
  indexable: true,

  // Provisional Vercel host. The domain is not purchased yet.
  domain: 'https://www.houstonwasteremoval.com',
} satisfies SiteConfigInput

export default siteConfig
