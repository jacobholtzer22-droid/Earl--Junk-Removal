import type { SiteConfigInput } from './lib/config-schema'
import { LOGO, STOCK } from './lib/stock-images'

/**
 * Every business fact for EJC Demo Junk & Haul lives here and nowhere else.
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
  businessSlug: '',

  legalName: 'Mustang Logistix LLC',
  displayName: 'EJC Demo Junk & Haul',
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
   * PROVISIONAL, and deliberately one entry. The client has not supplied a
   * city list, so no suburb, neighborhood or county is named anywhere on this
   * site. This entry exists to feed `areaServed` in lib/schema.ts; there are
   * no /areas routes in this build (see the commit that removed them).
   */
  serviceAreas: [{ slug: 'houston', name: 'Houston', county: null }],

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
          a: 'There is no flat rate, because a few bags and a full garage are not the same job. EJC Demo Junk & Haul gives a free virtual estimate, so you have a price before you commit to anything.',
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
          a: 'Same-day service is available, so call and ask what is open. EJC Demo Junk & Haul works seven days a week from 8:00am to 5:00pm, and after-hours calls are answered.',
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
          a: 'Say what discretion you need and when, and ask how the visit can be arranged around it. EJC Demo Junk & Haul works seven days a week from 8:00am to 5:00pm.',
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
      q: 'What areas does EJC Demo Junk & Haul serve?',
      a: 'We serve the Houston, Texas area. If you are not sure whether your address is covered, call and ask rather than guessing; it is a short conversation and it saves everyone a wasted trip.',
    },
    {
      q: 'How much does junk removal cost?',
      a: 'Price depends on what you have and how hard it is to reach, so there is no single number. You get a free virtual estimate, which means you have the cost before you commit to anything.',
    },
    {
      q: 'What is a free virtual estimate?',
      a: 'It is a quote that costs nothing, whether or not you go ahead. Call EJC Demo Junk & Haul and ask how to set one up.',
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
      q: 'Is EJC Demo Junk & Haul veteran owned?',
      a: 'Yes. It is a veteran owned business, owned by Earl. The "Demo" in the name is short for demolition, which is why light demolition sits alongside hauling and cleanouts on the service list.',
    },
  ],

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
  indexable: false,

  // Provisional Vercel host. The domain is not purchased yet.
  domain: 'https://ejc-demo-junk-haul.vercel.app',
} satisfies SiteConfigInput

export default siteConfig
