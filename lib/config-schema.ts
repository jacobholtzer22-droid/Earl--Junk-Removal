import { z } from 'zod'

/**
 * The schema every site.config.ts is parsed against.
 *
 * This file deliberately does NOT parse anything at import time, so
 * scripts/verify.ts can import the schema and report a parse failure as a
 * check result instead of crashing. lib/config.ts is the module that parses
 * at load and throws, which is what makes an invalid config fail `next build`.
 */

/**
 * Where every contact form submission goes. Frozen, never an env var.
 * The bare apex (alignandacquire.com without www) answers with a 308 that
 * the platform's own tooling does not follow, so the "www." is load-bearing.
 */
export const CONTACT_ENDPOINT = 'https://www.alignandacquire.com/api/contact' as const

/** The honeypot field name the platform checks. Must match lib/spam-constants.ts there. */
export const HONEYPOT_FIELD = 'hp_7d3a_ref' as const

/**
 * Real schema.org types a site may declare itself as. "LandscapingBusiness" and
 * "LandscapeService" do not exist on schema.org and are not accepted. Landscaping
 * and other outdoor trades use HomeAndConstructionBusiness.
 */
export const SCHEMA_TYPES = [
  'HomeAndConstructionBusiness',
  'Plumber',
  'Electrician',
  'HVACBusiness',
  'RoofingContractor',
  'MovingCompany',
  'AutoRepair',
  'GeneralContractor',
  'LocalBusiness',
  'ProfessionalService',
  'Locksmith',
  'HousePainter',
] as const

export type SchemaType = (typeof SCHEMA_TYPES)[number]

export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

const slug = z.string().regex(SLUG_REGEX, 'must be kebab-case: lowercase letters, digits, single hyphens')

const faq = z.object({
  q: z.string().min(8),
  a: z.string().min(20),
})

export const siteConfigSchema = z
  .object({
    /**
     * Sent with every contact form submission and must match a live Business
     * row in the platform database, or every lead from this site is lost.
     * verify.ts confirms it against the platform (check 3) and rejects the
     * shipped sample identity (check 2).
     *
     * THE EMPTY STRING IS A LEGAL PRE-LAUNCH VALUE and means exactly one
     * thing: the Business row does not exist yet. The site builds, every page
     * renders, and components/PendingFormGate.tsx stops the contact form from
     * posting anywhere, showing a call-us notice instead. A form that posted a
     * blank slug would 404 on the platform and lose the lead silently, which
     * is the failure this whole file exists to prevent.
     *
     * verify.ts check 2 is deliberately NOT relaxed to match: it tests
     * SLUG_REGEX directly, so it stays red for the whole pre-launch window and
     * nobody can mistake this site for finished. Fill the slug in, and check 2
     * goes green with no other change.
     *
     * The `indexable` guard at the bottom of this schema makes the pairing
     * safe: '' plus indexable: true refuses to build.
     */
    businessSlug: z.union([z.literal(''), slug]),

    legalName: z.string().min(2),
    displayName: z.string().min(2),
    /**
     * A second name the same business trades under, emitted as schema.org
     * `alternateName` on LocalBusiness and Organization.
     *
     * Exists for the case where the customer-facing brand and the name on the
     * truck are different. Search engines and answer engines otherwise have no
     * way to know the two refer to one business, and a visitor who was
     * recommended one name and lands on the other has no way to know either.
     * null when the business trades under one name.
     */
    alternateName: z.string().min(2).nullable().default(null),
    tagline: z.string().min(10),

    schemaType: z.enum(SCHEMA_TYPES),

    /** E.164. The single source of truth for the phone number; phoneDisplay is derived from it. */
    phone: z.string().regex(/^\+1\d{10}$/, 'must be E.164: +1 followed by 10 digits'),
    email: z.string().email().nullable(),

    /**
     * null when the business does not publish an address. Address-dependent
     * schema properties and the address block do not render.
     */
    address: z
      .object({
        street: z.string().min(3),
        city: z.string().min(2),
        state: z.string().length(2),
        zip: z.string().regex(/^\d{5}$/),
        lat: z.number().nullable(),
        lng: z.number().nullable(),
      })
      .nullable(),

    primaryCity: z.string().min(2),
    /** Two-letter state for titles and area pages. Kept top-level because address may be null. */
    primaryState: z.string().length(2),

    serviceAreas: z
      .array(
        z.object({
          slug,
          name: z.string().min(2),
          county: z.string().nullable(),
          /**
           * The schema.org type for this place.
           *
           * NOT every place with a name and a post office is a city. A
           * census-designated place, an unincorporated community and a
           * special-purpose district are none of them cities, and calling one
           * a City in structured data is simply false. schema.org has no CDP
           * type, so anything not incorporated uses the broader `Place`, which
           * is true of all of them.
           *
           * Check before setting this. The status of each place and its source
           * belong in seo/AREA-SOURCES.md.
           */
          placeType: z.enum(['City', 'Place']).default('City'),
          /**
           * Replaces "<primaryService> in <name>, <state>" as the head of the
           * <title>, same idea as services[].titleOverride.
           *
           * Short place names are the reason this exists: a four-letter name
           * lands the derived title under 50 characters, which wastes the
           * space Google will actually display. The H1 is unaffected.
           */
          titleOverride: z.string().min(10).nullable().default(null),
          /**
           * Questions for this place specifically. Rendered as the visible
           * accordion AND as the FAQPage markup, from the same objects, so the
           * two cannot drift.
           *
           * Write them per place. Three near-identical sets across eight pages
           * is the thing that makes a city-page template look like a city-page
           * template, and it is what the similarity check in
           * scripts/proof/area-similarity.mjs exists to catch.
           */
          faqs: z
            .array(faq)
            .max(6)
            .default([])
            // Empty is legal, and means exactly one thing: this place has no
            // page of its own. The primary city is the homepage, so it never
            // gets one. Any place that DOES get a page needs at least three,
            // or the FAQPage markup is not worth emitting.
            .refine((a) => a.length === 0 || a.length >= 3, {
              message: 'a place with its own page needs 3 to 6 faqs; only the primary city may have none',
            }),
        }),
      )
      .min(1),

    services: z
      .array(
        z.object({
          slug,
          name: z.string().min(2),
          shortDescription: z.string().min(40).max(200),
          priceFrom: z.number().nullable(),
          priceNote: z.string().nullable(),
          /** Filename in public/images/originals to use as the page image, or null. */
          image: z.string().nullable(),
          /**
           * Replaces "<name> in <primaryCity>, <primaryState>" as the HEAD of
           * the <title>. The " | <displayName>" suffix is still appended, so
           * this is the part you are budgeting characters for.
           *
           * Exists because the title is capped at 60 rendered characters while
           * the H1 is not. A service whose honest name runs long should keep
           * that name in the H1, the nav and the cards, and shorten only the
           * title. Truncating the name itself to fit a <title> is the wrong
           * trade: it degrades the page for every human to satisfy a crawler.
           * null means the title is derived from the name as usual.
           */
          titleOverride: z.string().min(10).nullable().default(null),
          faqs: z.array(faq).min(3).max(6),
        }),
      )
      .min(1),

    /** null means hours are unknown. openingHoursSpecification is omitted entirely. Never guess hours. */
    hours: z
      .array(
        z.object({
          day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
          open: z.string().regex(TIME_REGEX, 'HH:MM 24-hour'),
          close: z.string().regex(TIME_REGEX, 'HH:MM 24-hour'),
        }),
      )
      .nullable(),

    yearsInBusiness: z.number().int().positive().nullable(),
    licenseNumber: z.string().nullable(),
    insured: z.boolean().nullable(),

    /**
     * Review and aggregateRating schema render ONLY when this array is non-empty,
     * and the same reviews render visibly on the page. Empty by default. Only real
     * reviews with a source URL belong here.
     */
    reviews: z
      .array(
        z.object({
          author: z.string().min(2),
          rating: z.number().min(1).max(5),
          text: z.string().min(10),
          source: z.string().min(2),
          url: z.string().url(),
        }),
      )
      .default([]),

    profiles: z
      .object({
        gbp: z.string().url().nullable(),
        facebook: z.string().url().nullable(),
        instagram: z.string().url().nullable(),
        yelp: z.string().url().nullable(),
      })
      .partial(),

    /**
     * Whether the business accepts text messages on its published number.
     *
     * FALSE BY DEFAULT and false here, pending the client's answer. When it is
     * true a Text Us button appears beside Call Now in the header, pointing at
     * an sms: link on the same number.
     *
     * It is a flag rather than an assumption because an sms: link on a number
     * that cannot receive texts is worse than no button: the message is sent,
     * it goes nowhere, and the customer believes they have made contact.
     */
    acceptsTexts: z.boolean().default(false),

    /** Homepage FAQs. FAQPage schema on the homepage renders only when non-empty. */
    faqs: z.array(faq).default([]),

    /**
     * Q&A for the five standalone pages, which are neither a service nor a
     * place and so have nowhere else to put it.
     *
     * These exist so that a page's visible questions and its FAQPage markup
     * are THE SAME OBJECTS. Before this slot existed, the about, services,
     * areas and referral pages carried question headings in MDX with answers
     * underneath and no structured data over any of it: readable to a person,
     * invisible to an answer engine. Writing the pairs twice, once in MDX and
     * once for the schema, is the other way to fix that and is how they drift.
     *
     * Rendered by components/FaqProse.tsx as open headings and paragraphs, or
     * by components/FaqAccordion.tsx where a collapsed list reads better. Both
     * take the same array and lib/schema.ts faqPage() turns it into markup.
     *
     * NO LEGAL KEY, deliberately. A privacy policy and a terms page answer in
     * prose and are indexed for trust rather than for answers; FAQPage markup
     * over a liability clause claims a role the page does not have. See
     * scripts/proof/seo-score.mjs, which names that exemption rather than
     * quietly scoring those two pages as if they had Q&A.
     */
    pageFaqs: z
      .object({
        about: z.array(faq).max(6).default([]),
        services: z.array(faq).max(6).default([]),
        areas: z.array(faq).max(6).default([]),
        contact: z.array(faq).max(6).default([]),
        referral: z.array(faq).max(6).default([]),
      })
      .default({}),

    /** Which processed images go where. Filenames are keys in public/images/manifest.json. */
    images: z.object({
      hero: z.string().nullable(),
      about: z.string().nullable(),
      gallery: z.array(z.string()).default([]),
      /**
       * The business's actual logo. Separate from `hero` on purpose: before
       * this existed, lib/schema.ts set the LocalBusiness `logo` property and
       * the og:image to the hero photograph. On a site whose hero is stock
       * photography that publishes a stock photo as the company's logo.
       *
       * NOTE FOR ANYONE ADDING A FIELD HERE: this inner object is not
       * .strict(). Zod's default is to STRIP unknown keys, so an unrecognised
       * key parses "successfully" and then reads back undefined at runtime. It
       * has to be declared here to exist at all.
       */
      logo: z.string().nullable().default(null),
      /**
       * The same mark knocked out white, for dark grounds. A logo lockup is
       * artwork: it cannot be recoloured with CSS the way a wordmark can, so a
       * brand that works on both grounds needs two files, not one plus a
       * filter. null means the site has no dark-ground variant and the header
       * and footer fall back to `logo`.
       */
      logoOnDark: z.string().nullable().default(null),
    }),

    /**
     * Extra fields on the contact form. OPTIONAL, and off by default.
     *
     * Omit the whole block and the form renders exactly the fields it has
     * always rendered and posts exactly the payload it has always posted, so
     * every site built before this existed is unaffected. Each option is
     * additive on top of that baseline.
     *
     * What never changes, whatever is switched on: the endpoint, the payload
     * keys { name, phone, email, message, smsConsent, businessSlug } plus the
     * honeypot, and the SMS consent checkbox. Extra answers are folded into
     * `name` and `message`, because those are the two fields the platform
     * already parses.
     */
    contactForm: z
      .object({
        /**
         * Ask for first and last name separately. `name` is still posted as
         * one string, "First Last".
         */
        splitName: z.boolean().default(false),
        /**
         * Street address and city. 'optional' renders them and lets the form
         * through empty; 'required' blocks submission until both are filled.
         * Trades that quote on site need the address; a consultant does not.
         */
        address: z.enum(['off', 'optional', 'required']).default('off'),
        /**
         * Ask for a ZIP or postal code. Independent of `address`.
         *
         * With `address` on, the ZIP sits in the address group and folds into
         * the Address line, which is how a street address is normally written.
         * With `address` off, it renders on its own and folds in as its own
         * "ZIP:" line. A business that quotes from local data needs the ZIP and
         * has no use for the street.
         */
        zip: z.enum(['off', 'optional', 'required']).default('off'),
        /**
         * A "how soon do you need this" dropdown.
         *
         * The label and the choices are per-client because the useful answers
         * are: a water treatment company cares about install timing, a roofer
         * about whether it is leaking now. An empty first choice means the
         * select has no default, so a required timeframe cannot be satisfied by
         * the visitor ignoring it.
         */
        timeframe: z
          .object({
            label: z.string().min(4),
            options: z.array(z.string().min(1)).min(2),
            required: z.boolean().default(false),
          })
          .optional(),
        /**
         * A dropdown of config.services by name, plus "Not sure yet" so nobody
         * is forced to self-diagnose before they can send a message.
         */
        serviceDropdown: z.boolean().default(false),
        /** Require the email address. It is optional by default. */
        emailRequired: z.boolean().default(false),
      })
      .optional(),

    /**
     * Whether search engines and AI crawlers may index this site.
     *
     * false emits `noindex, nofollow` on every page and a blanket Disallow in
     * robots.txt. It is the correct state while the site is on a temporary
     * Vercel URL: indexing a throwaway hostname and then moving the site is
     * how a brand new domain inherits duplicate-content problems on day one.
     *
     * Flip to true in the same commit that sets `domain` to the real purchased
     * host. See the guard below: this can never be true while businessSlug is
     * empty.
     */
    indexable: z.boolean(),

    /** Full origin including https:// and www. when www is the primary host. No trailing slash. */
    domain: z
      .string()
      .url()
      .regex(/^https:\/\/[^/]+$/, 'origin only: https://www.example-host.com with no path or trailing slash'),
  })
  .strict()
  /**
   * An indexable site with a dead contact form is the single worst state this
   * repo can ship. Every visitor search sends to it finds a form that cannot
   * submit, and nobody finds out until the client asks why the phone never
   * rang. Refusing to build is the only honest response.
   */
  .superRefine((cfg, ctx) => {
    if (cfg.indexable && cfg.businessSlug === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['indexable'],
        message:
          'indexable cannot be true while businessSlug is empty: the contact form is inert, so an indexed page would collect nothing. Set the real businessSlug first.',
      })
    }
  })

export type SiteConfigInput = z.input<typeof siteConfigSchema>
export type SiteConfigParsed = z.output<typeof siteConfigSchema>

export type Service = SiteConfigParsed['services'][number]
export type ServiceArea = SiteConfigParsed['serviceAreas'][number]
export type Review = SiteConfigParsed['reviews'][number]
export type Faq = SiteConfigParsed['faqs'][number]
export type Hours = NonNullable<SiteConfigParsed['hours']>

/** Derived fields that are computed, never authored. */
export type SiteConfig = SiteConfigParsed & {
  phoneDisplay: string
  /** The first service in config, used in the home and area page titles. */
  primaryService: Service
}

/** "+15555550123" -> "(555) 555-0123". Authored nowhere; derived from config.phone. */
export function formatPhoneDisplay(e164: string): string {
  const d = e164.replace(/\D/g, '').slice(-10)
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export function deriveConfig(parsed: SiteConfigParsed): SiteConfig {
  const primaryService = parsed.services[0]
  if (!primaryService) throw new Error('services must have at least one entry')
  return { ...parsed, phoneDisplay: formatPhoneDisplay(parsed.phone), primaryService }
}
