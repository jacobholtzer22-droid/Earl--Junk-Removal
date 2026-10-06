# CLIENT-TODO — EJC Demo Junk & Haul

Open questions for Earl, and the launch steps that depend on them. Ordered by
what blocks the most.

Anything answered here becomes a fact in `seo/FACTS.md` **first**, then goes
into `site.config.ts`. Nothing gets written straight into page copy.

---

## BLOCKING LAUNCH

### 1. Business slug (blocks every lead from the site)
The platform `Business` row does not exist yet, so `businessSlug` is `''` and
**the contact form does not submit.** It renders normally and shows a notice
telling the visitor to call instead. No lead is silently lost, but no lead is
captured online either.

Create the Business row, then set the slug in `site.config.ts`. Verify checks 2
and 3 go green on their own. **A wrong slug is worse than an empty one**: the
form would appear to work and every submission would be dropped.

### 2. Domain
Not purchased. The site ships on a Vercel URL with `indexable: false`, which
means `noindex` on every page and a blanket `Disallow` in robots.txt. That is
correct for a temporary host — indexing a throwaway hostname and then moving is
how a new domain inherits duplicate-content problems on day one.

Buy the domain, point it at Vercel, set `domain` in `site.config.ts`, and flip
`indexable: true` in the same commit. The config refuses to build if you set
`indexable: true` while the slug is still empty.

### 3. Service city list
Houston only, provisionally. **No suburb, neighborhood or county is named
anywhere on the site**, because naming one we cannot confirm is an invented
fact. The service-area section currently reads "Serving the Houston, TX area."

Which cities does Earl actually drive to? Katy, Spring, Cypress, Sugar Land,
The Woodlands, Pasadena, Pearland? Once there is a real list, add it to
`serviceAreas` and revert the commit titled "remove city landing pages
(/areas)" to bring the city pages back.

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

### 8. $50 off first service — terms
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

### 14. Real photographs — the single biggest quality win available
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

### 16. Social profile URLs — UNVERIFIED
`https://www.facebook.com/ejcdjh75` and `https://www.instagram.com/ejcdjh75`
were built from the handles Earl gave and are live on the site in the footer
and in `sameAs` schema. **Neither could be confirmed to resolve**: Facebook
returns 400 to non-browser requests and Instagram serves a login wall.

Open both in a browser. If either 404s, fix or remove it — a schema `sameAs`
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
