import type { SiteConfigInput } from './lib/config-schema'

/**
 * Every business fact for EJC Demo Junk & Haul lives here and nowhere else.
 *
 * SOURCED ENTIRELY FROM seo/FACTS.md. If a claim is not in that file it is not
 * in this one: no license number, no insurance status, no years in business,
 * no job counts, no prices, no response times, no disposal or recycling
 * percentages, no reviews. Unknown is `null`, and a null field renders nothing.
 * An empty slot on the page is correct. A plausible guess is a defect.
 *
 * Open questions are tracked in CLIENT-TODO.md, not guessed at here.
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
        'Household junk hauled away in one visit: boxes, bags, old furniture, electronics, and whatever else has stacked up.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'curbside-junk-pile.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'How much does junk removal cost in Houston?',
          a: 'There is no flat rate, because a few bags and a full garage are not the same job. EJC Demo Junk & Haul gives a free virtual estimate first, so you know the price before anyone shows up and before you have agreed to anything.',
        },
        {
          q: 'Can you come out the same day?',
          a: 'Same-day service is available. Call and ask what is open today. If it cannot be today, we are open seven days a week from 8:00am to 5:00pm, so the next opening is rarely far off.',
        },
        {
          q: 'Do I have to move everything outside first?',
          a: 'No. Tell us where the items are and we will plan the job around that. If it is upstairs, in a back room, or behind a shed, say so during the estimate so the quote reflects the real work.',
        },
        {
          q: 'What happens to everything after you take it?',
          a: 'Depending on the item, we offer recycling pickup, donation drop-off, scrap metal recycling, and electronics recycling as part of what we do. Ask about a specific item during your estimate and we will tell you what applies to it.',
        },
      ],
    },
    {
      slug: 'furniture-removal',
      name: 'Furniture Removal',
      shortDescription:
        'Couches, sectionals, mattresses, dressers, and desks carried out and hauled off, including from upstairs and tight stairwells.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'old-sofa-curbside.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'Can you get a sectional down a narrow staircase?',
          a: 'Usually, yes, and it is worth mentioning during the estimate. Doorway width, stair turns, and whether a piece comes apart all change how long the job takes, so flag them early and the quote will be accurate.',
        },
        {
          q: 'Will you take just one piece of furniture?',
          a: 'Yes. Single-item pickups are normal work, not an inconvenience. Call with what you have and EJC Demo Junk & Haul will quote it the same way as a full room.',
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
        'Refrigerators, washers, dryers, ranges, water heaters, and freezers disconnected from their spot and hauled out.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'old-appliance-garage.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'Do you take refrigerators and freezers?',
          a: 'Yes. Refrigerators and freezers are routine appliance removals. Mention the unit when you call so the crew brings the right equipment for the size and where it sits.',
        },
        {
          q: 'Can you take the old one away when a new one is delivered?',
          a: 'Yes, and timing it around a delivery window is worth raising when you book. We are open seven days a week from 8:00am to 5:00pm, and same-day service is available if the delivery lands sooner than planned.',
        },
        {
          q: 'What do you do with old appliances?',
          a: 'Appliance recycling and scrap metal recycling are both part of what EJC Demo Junk & Haul offers. Ask about your specific unit during the free virtual estimate and we will tell you what applies.',
        },
      ],
    },
    {
      slug: 'mattress-disposal',
      name: 'Mattress Disposal',
      shortDescription:
        'Mattresses and box springs of any size taken out of the bedroom and hauled away, so you are not driving one to a dump yourself.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'mattress-against-wall.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'Will you take a mattress and the box spring together?',
          a: 'Yes, and it is cheaper to handle them in one visit than to book twice. Mention both when you call so the estimate covers the whole set rather than one piece of it.',
        },
        {
          q: 'Do you handle more than one mattress at a time?',
          a: 'Yes. Several at once is common for move-outs, rentals, and property turnovers. Tell us how many during the free virtual estimate and the quote will reflect the full load.',
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
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'cluttered-garage.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'Do I need to sort everything before you arrive?',
          a: 'No. Point out anything that stays and the rest goes. If you would rather sort first, that works too, but a garage cleanout does not require it.',
        },
        {
          q: 'Can you clear a storage unit instead of a garage?',
          a: 'Yes. Storage unit cleanouts work the same way as a garage, with one difference worth planning around: facility access hours. Mention them when you book so the visit lands inside them.',
        },
        {
          q: 'How long does a garage cleanout take?',
          a: 'It depends on how full it is and how much has to be carried. That is what the free virtual estimate is for; you get the scope and the price before anyone is standing in your driveway.',
        },
        {
          q: 'Do you clear attics and basements as well?',
          a: 'Yes. Attic, basement, and storage cleanouts all fall under this service. Mention the stairs, hatches, or pull-down ladders involved during the estimate so the quote reflects the real access.',
        },
      ],
    },
    {
      slug: 'estate-cleanouts',
      name: 'Estate Cleanouts',
      shortDescription:
        'Whole-property clearing for executors and families settling an estate, worked at the pace the family sets rather than a rushed schedule.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'stacked-moving-boxes.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'What if we have not finished deciding what to keep?',
          a: 'Say so. Mark or set aside whatever stays and we work around it. Nothing is removed that you have not cleared, and the job can be split across visits if the family needs time.',
        },
        {
          q: 'Can you work with an executor who lives out of state?',
          a: 'Yes. The estimate is virtual and free, so you do not need to be in Houston to get a price. Arrange property access with us and we will keep you updated.',
        },
        {
          q: 'Do you handle donation of usable items?',
          a: 'Donation drop-off is one of the services EJC Demo Junk & Haul offers. Tell us during the estimate which items you would rather see donated than discarded and we will tell you what is workable.',
        },
      ],
    },
    {
      slug: 'hoarder-cleanouts',
      name: 'Hoarder Cleanouts',
      shortDescription:
        'Heavily filled homes cleared discreetly and without judgment, at whatever pace the household is comfortable with.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: null,
      titleOverride: null,
      faqs: [
        {
          q: 'Will anyone judge the condition of the home?',
          a: 'No. This is routine work and it is treated that way. The job is to clear the space and leave the household better off, not to comment on how it got there.',
        },
        {
          q: 'Can the work be done in stages?',
          a: 'Yes. Stages are often easier on everyone than one long day. Say what pace suits you during the free virtual estimate and the plan is built around that.',
        },
        {
          q: 'How do we keep this private?',
          a: 'Tell us what discretion you need and when, and we will plan the visit around it. Scheduling is flexible: EJC Demo Junk & Haul works seven days a week from 8:00am to 5:00pm.',
        },
        {
          q: 'What if we find things we want to keep partway through?',
          a: 'Stop us and set them aside. Nothing leaves the property that you have not cleared, and changing your mind mid-job is expected rather than a problem.',
        },
      ],
    },
    {
      slug: 'construction-debris-removal',
      name: 'Construction Debris Removal',
      shortDescription:
        'Lumber, drywall, roofing tear-off, concrete, brick, and scrap metal cleared off the site so the next trade can get to work.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'construction-debris-pile.jpg',
      titleOverride: 'Construction Debris Removal Houston',
      faqs: [
        {
          q: 'Do you take concrete and brick?',
          a: 'Yes. Concrete and brick removal and scrap metal hauling are part of this service, alongside lumber disposal and roofing debris. Say what the pile is made of when you call, because weight changes the job.',
        },
        {
          q: 'Can you come back between phases of a job?',
          a: 'Yes. Repeat visits across a build are normal. We are open seven days a week from 8:00am to 5:00pm, which usually makes it possible to clear a site before the next trade arrives.',
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
        'Sheds, decks, fences, playground sets, and similar structures taken apart and hauled off in the same visit.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'dismantled-wooden-deck.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'What counts as light demolition?',
          a: 'Freestanding structures and attached features that come apart without structural work: sheds, decks, fences, playground equipment, carpet, and interior fixtures. If you are unsure yours fits, describe it during the free estimate.',
        },
        {
          q: 'Do you haul the debris away too?',
          a: 'Yes. Taking the structure apart and removing what is left are the same job here, so you are not left with a pile in the yard afterwards.',
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
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'old-outdoor-hot-tub.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'Does the hot tub have to be drained first?',
          a: 'It needs to be empty before it can be moved, so draining it ahead of the visit saves time. If that is not something you can do, raise it during the estimate rather than on the day.',
        },
        {
          q: 'What if the tub is on a deck or behind a fence?',
          a: 'That is normal and it is why hot tubs are usually cut down on site rather than carried out whole. Describe the access during the free virtual estimate so the quote matches the real route out.',
        },
        {
          q: 'Will the deck or patio be damaged?',
          a: 'Point out anything you are concerned about before work starts, including decking, pavers, and sprinkler heads on the path out, and the approach can be planned around it.',
        },
      ],
    },
    {
      slug: 'commercial-cleanouts',
      name: 'Commercial Cleanouts',
      shortDescription:
        'Offices, retail spaces, warehouses, restaurants, and hotels cleared out, including furniture, appliances, and kitchen equipment.',
      priceFrom: null,
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'empty-office-stacked-chairs.jpg',
      titleOverride: null,
      faqs: [
        {
          q: 'Can you work outside our business hours?',
          a: 'Scheduling runs seven days a week from 8:00am to 5:00pm, after-hours calls are answered, and emergency after-hours service is available with a trip charge. Tell us the window you need and we will tell you what fits.',
        },
        {
          q: 'Do you remove restaurant equipment?',
          a: 'Yes. Restaurant equipment removal is part of commercial work here, along with office, retail, warehouse, and hotel and hospitality cleanouts.',
        },
        {
          q: 'Who do you usually work with on commercial jobs?',
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
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'empty-room-after-moveout.jpg',
      titleOverride: 'Property Cleanouts in Houston, TX',
      faqs: [
        {
          q: 'How fast can a unit be cleared between tenants?',
          a: 'Same-day service is available, and we work seven days a week from 8:00am to 5:00pm, which covers most turnover windows. Call with the date you need it empty by and we will tell you what is open.',
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
      priceNote: 'set by a free virtual estimate before any work starts',
      image: 'fallen-branches-brush-pile.jpg',
      titleOverride: 'Yard Waste Removal in Houston, TX',
      faqs: [
        {
          q: 'Do you clear storm debris after a Houston storm?',
          a: 'Yes. Storm debris cleanup is part of this service, along with brush and tree debris removal. Emergency after-hours service is available and a trip charge applies; call and we will tell you what it is for your job.',
        },
        {
          q: 'Will you take fencing and old outdoor furniture too?',
          a: 'Yes. Fence removal, deck removal, playground equipment, and outdoor furniture all come under yard work here, so a single visit can clear the whole back yard rather than just the brush.',
        },
        {
          q: 'Do you cut down trees?',
          a: 'We remove brush, limbs, and debris that is already down. Felling a standing tree is a different trade; if that is what you need, get it dropped first and we will clear what is left.',
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
    // neither could be confirmed to resolve. See CLIENT-TODO.md item 1.
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
      a: 'Price depends on what you have and how hard it is to reach, so there is no single number. You get a free virtual estimate first, which means you know the cost before anyone comes out and before you commit.',
    },
    {
      q: 'What is a free virtual estimate?',
      a: 'It is a no-cost quote arranged before any visit, so you are not paying for someone to come and look. Call EJC Demo Junk & Haul and we will walk you through how to set one up.',
    },
    {
      q: 'Can you come out today?',
      a: 'Same-day service is available. We are open Monday through Sunday, 8:00am to 5:00pm Central, so call and ask what is still open today rather than assuming it is too late.',
    },
    {
      q: 'Do you answer calls after hours?',
      a: 'Yes. After-hours calls are answered, and emergency after-hours service is available. A trip charge applies for emergency calls outside normal hours; call and we will tell you what it is before anyone is dispatched.',
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
    hero: 'curbside-junk-pile.jpg',
    about: 'cluttered-garage.jpg',
    // Empty on purpose. There are no client photographs yet, and a gallery of
    // licensed stock would imply these are EJC's own jobs. The Gallery section
    // does not render while this is empty.
    gallery: [],
    // The real logo. Keeps stock photography out of schema.org `logo` and the
    // social card. See lib/schema.ts logoUrl().
    logo: 'ejc-logo.png',
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
