# CLIENT-TODO: EJC Demo Junk & Haul

Open questions for Earl, and the launch steps that depend on them. Ordered by
what blocks the most.

Anything answered here becomes a fact in `seo/FACTS.md` **first**, then goes
into `site.config.ts`. Nothing gets written straight into page copy.

---

## DONE


### 1. Business slug. DONE, 2026-10-06
`businessSlug` is `houston-waste-removal-1791303748120`. The contact form is
live: `components/PendingFormGate.tsx` is now a pure pass-through, the "not
connected yet" notice is gone from the built HTML, and the form posts to
`https://www.alignandacquire.com/api/contact` with that slug.

Verify check 2 is green. **Check 3 is still red**, and it is the one item from
this list that nobody here can close: the platform has not shipped
`/api/verify-slug`, so the check cannot confirm the slug against the database
no matter what it is set to. Until that endpoint exists, the slug is confirmed
by a live form submission and nothing else.

### 2. Domain. DONE, 2026-10-06
`houstonwasteremoval.com`, canonical host `www`. `domain` is
`https://www.houstonwasteremoval.com` and `indexable` is `true`, set in one
commit, which is the only way the config will accept them.

Verified live: the apex returns a 308 to www; canonicals, the sitemap, the
og:image and every `@id` and `url` in the JSON-LD are on the www host; no
`vercel.app` string and no bare-apex URL survives anywhere in the build;
`robots.txt` allows crawling and names the 12 AI crawlers.

---

## BLOCKING LAUNCH

### 3. Confirm each service area with Earl. EIGHT PAGES ARE LIVE ON AN ASSUMPTION

There are now eight area pages plus Houston. **Earl has not confirmed a single
one of them individually.** The list was drawn from a driving radius he gave,
and that figure is deliberately not published anywhere on the site.

**Why this matters more than it looks.** A page for a place he will not drive
to is worse than no page at all: it ranks, the phone rings, and he either turns
the job down or takes a drive that loses money. The fix is one conversation.

Go through these one at a time and get a yes or a no:

| Place | Status | Confirmed? |
|---|---|---|
| Houston | Incorporated city, Harris County | **confirm with Earl** |
| Katy | Incorporated city, Harris / Fort Bend / Waller tripoint | **confirm with Earl** |
| Sugar Land | Incorporated city, Fort Bend County | **confirm with Earl** |
| Pearland | Incorporated city, mostly Brazoria County | **confirm with Earl** |
| Cypress | Unincorporated community, Harris County | **confirm with Earl** |
| Spring | Census-designated place, Harris / Montgomery | **confirm with Earl** |
| The Woodlands | Township, Montgomery County | **confirm with Earl** |
| Pasadena | Incorporated city, Harris County | **confirm with Earl** |
| Humble | Incorporated city, Harris County | **confirm with Earl** |

A no means deleting that entry from `serviceAreas` in `site.config.ts` and its
file in `content/areas/`. Nothing else has to change; the routes, sitemap,
footer and llms.txt all derive from that array.

Legal status and county for every one of them is sourced in
`seo/AREA-SOURCES.md`. Three of these are **not cities** and the copy says so.

### 3b. One real detail per place, from Earl

Right now every area page is built from public geography: the county, the legal
status, and which services tend to come up there. That is honest, and it is
also the ceiling of what can be written without him.

**Each page needs one true, specific thing only Earl knows.** Not a
testimonial, not a job count. Something like: the kind of property that calls
most often there, an access quirk he has run into, a type of job he gets there
and nowhere else, or a reason he likes or dislikes working there.

One sentence per place is enough to lift all eight out of template territory:

- Houston
- Katy
- Sugar Land
- Pearland
- Cypress
- Spring
- The Woodlands
- Pasadena
- Humble

Until those exist, the pages are accurate but generic, and the similarity check
in `scripts/proof/area-similarity.mjs` is the only thing keeping them honest.

---

## FACTS WE COULD NOT PUBLISH

### 4. Insurance and licensing
Unknown, so the site makes **no** insurance, licensing or bonding claim
anywhere. Competitors lead with "INSURED" badges, so this is a real
disadvantage. If Earl carries general liability, say so and it goes on the
homepage, the about page and the footer.

### 5. How virtual estimates work
"Free virtual estimates" is advertised but the mechanism is unknown. Does the
customer text photos? Send a video walkthrough? Do a live video call? Right now
every page says only that estimates are free and tells people to call. Describe
the process and it becomes a conversion step instead of a question.

### 6. Does the phone accept texts?
There is no "text us" option anywhere on the site, because we do not know
whether (713) 291-9440 receives SMS. The nearest competitor's primary call to
action is *"Send us a text."* If this number texts, that is a one-line change
with real upside.

### 7. Emergency after-hours fee
Earl mentioned "$220 after midnight." Published as **"Emergency after-hours
service is available. A trip charge applies."** with no number and no hours,
because neither is confirmed.
- Is it exactly $220?
- Does it start at midnight, or whenever the 8:00am to 5:00pm window closes?
- Is it in addition to the job price, or does it include some work?

### 8. $50 off first service, terms
Published exactly as stated, with no fine print, because none was supplied.
- Any minimum job size?
- Expiry date?
- Does it stack with the referral program?
- New customers only, or per property?

### 9. Referral program terms
Published as $20 for a verified lead that requests a quote and $75 for a lead
that books and completes. Unanswered:
- What makes a lead "verified"?
- How and when does a referrer get paid?
- Is it open to anyone, or trade contractors only? (The site currently says
  realtors, property managers and trade contractors, following the fact as
  given.)
- Does the referrer need to sign up first?

### 10. Items you will NOT take
There is no "what we can't take" list on the site because none was supplied.
Most junk haulers refuse or restrict hazardous waste, paint, solvents, asbestos,
tires, propane tanks and medical waste. Visitors look for this, and finding out
on the day wastes a trip for both sides. What is Earl's actual list?

### 11. How pricing works
No prices appear anywhere. FAQ answers say price is set by a free virtual
estimate. Is pricing by truck volume, by item, by labour hour, or by job? Even
without numbers, saying *how* it is calculated removes the main reason people
bounce to a competitor who explains it.

### 12. Spanish-language service
Not mentioned on the site. Houston is roughly 45% Hispanic or Latino. If Earl
or anyone on the job speaks Spanish, that is worth stating plainly, and
eventually worth a Spanish version of the site.

### 13. Earl's last name, and whether he wants an owner story
The about page names him as Earl and nothing more: no last name, no bio, no
backstory, no military branch. Veteran-owned businesses that tell a short,
specific owner story convert better than ones that do not. Does he want one?
What is he comfortable sharing?

---

## ASSETS

### 14. Real photographs, the single biggest quality win available
Every photograph on this site is **licensed stock** from Unsplash and Pexels.
Full inventory in `seo/STOCK-PHOTOS.md`.

Under the rules this build follows, stock appears only in the hero, service
page banners and section backgrounds. There is **no gallery, no "our work"
section, and no before-and-after**, and no caption or alt text anywhere implies
a photo shows EJC, its truck, its crew or its jobs. No stock image shows a
truck, trailer, dumpster or crew at all, because next to the EJC name those
read as Earl's equipment.

That restraint is correct, and it also means the site cannot yet show the one
thing that sells this trade: a full load and an empty garage. Ask Earl for
phone photos from real jobs, with the customer's permission:
- Before and after of the same space, taken from the same spot
- A loaded truck or trailer
- Earl and the crew working
- Anything with the EJC logo visible on a vehicle or shirt

Each replacement is one line in `lib/stock-images.ts`.

### 15. A proper logo file
The logo in this repo came from a 225×253 screenshot with a driveway visible
behind it. It has been circle-masked to transparency and is **never rendered
larger than 225px**, which is why it is modest in the header and on the social
card. Nothing was redrawn, vectorized or AI-upscaled.

Ask the designer for the original vector (`.svg`, `.ai` or `.eps`) or a
high-resolution PNG with a transparent background. Everything then gets sharper
for free.

### 16. Social profile URLs, UNVERIFIED
`https://www.facebook.com/ejcdjh75` and `https://www.instagram.com/ejcdjh75`
were built from the handles Earl gave and are live on the site in the footer
and in `sameAs` schema. **Neither could be confirmed to resolve**: Facebook
returns 400 to non-browser requests and Instagram serves a login wall.

Open both in a browser. If either 404s, fix or remove it, because a `sameAs`
pointing at a dead profile is worse than no `sameAs` at all.

### 17. Google Business Profile
Does not exist. For a local service business this is the highest-value missing
asset after the domain: it is what puts the business in the map pack and is
where reviews accumulate. `profiles.gbp` is `null` until it exists.

### 18. Reviews
None supplied, so there are **no testimonials and no Review or
aggregateRating schema** on this site. Both competitors lean heavily on review
walls. Once the Google Business Profile is live and real reviews exist, they
go in `config.reviews` with a source URL each, and the schema renders itself.

---

## DECISIONS WE MADE FOR EARL (easy to reverse)

### 19. Contact form fields
The form asks for name, phone, optional email and a message. Nothing else.
The template also supports an address field, a ZIP, a service dropdown and a
"how soon do you need this" dropdown. All are off, because every extra field
is a reason someone abandons the form and nothing in the brief said he needs
them to quote. Worth asking: does a street address or ZIP up front actually
save him a phone call?

### 20. No prices anywhere
Not even a "starting at". If Earl ever wants a floor price published, it goes
in `priceFrom` per service and renders itself.

---

## FROM THE OCTOBER 2026 BRAND HANDOVER

### 21. A vector logo file, and a simple icon mark
The supplied brand is twelve PNGs. **There is no vector file and no written
guideline**, so every colour on this site was sampled out of the artwork
(`client-assets/brand-2026-10`, palette recorded in `theme.ts`).

Two things are needed from whoever made the logo:

- **A vector file.** SVG, EPS or AI. A raster lockup caps how large the mark
  can ever be drawn, it cannot be used for vehicle livery or signage, and it
  rules out a crisp monochrome version. The current PNG is 1222x1237, which
  is enough for this website and not much else.
- **A simple icon mark.** The full lockup stacks a skyline, a truck, the name
  and a two-line tagline. It needs to be 100px tall before the words read,
  which is why the header is taller than it was. Something that works in a
  32px square, a map pin and an app tile, probably the leaf or the truck
  alone, would fix that everywhere at once. The favicon today is the circular
  badge, masked to a circle, and the words in it are decorative at that size.

### 22. Open questions from the marketing pieces, NOT used on the site
The business cards and door hangers carry several things the website does not
say. **None of them has been added**, because none is confirmed and the brief
for that round was explicit that copy does not change. Each needs a yes or no:

| Found on | What it says | Why it is not on the site |
|---|---|---|
| Business card | Owner is **Earl Morris** | The site says "Earl". A surname is a fact about a person and wants confirming before it is published |
| Card, door hanger | **houstonwasteremoval@gmail.com** | The site uses `ejcdjh75@gmail.com`. Two addresses means one of them is going to be missed. Which is live? |
| Logo, every piece | **"A Cleaner Houston, A Brighter Tomorrow"** | It is inside the logo artwork, which is on every page. It is not repeated as text anywhere |
| Door hanger, card | **Curbside pickup**, as a named service | Not one of the thirteen services. Is it a real offering, and is it recurring or one-off? |
| Every piece | **"Eco-friendly", "responsible disposal", "recycling", "donation services"** | These are disposal claims. `scripts/proof/content-audit.mjs` bans the whole family outright, because the site cannot say where material ends up without evidence. Recycling and donation ARE already listed as services; what is banned is the claim about outcomes |
| Card | **"Reliable, professional, eco-friendly"** and "Clean spaces, stronger communities" | Slogans, unverifiable as written |

### 23. The logo says waste collection, the business sells junk removal
Worth raising with Earl rather than quietly living with. The mark is a
municipal-style rear-loader truck with a recycling symbol, and the collateral
leans on curbside pickup and recycling. The site sells junk removal,
cleanouts and light demolition, which is a different job a customer searches
for differently. The brand works; it just points somewhere slightly to the
side of what he is being paid for. If he wants the site to follow the logo
rather than the other way round, that is a bigger conversation about what the
business is selling, not a website change.
