# COPY CLAIMS REVIEW: what EJC is said to do, and whether FACTS supports it

Rule 2 of the build brief: describing what a service **is** in general terms is
fine, but any promise about how **this** company does it has to come from
`seo/FACTS.md` or go to `CLIENT-TODO.md`.

This business is under a year old, so it has no track record to describe. Any
sentence saying what it *routinely*, *normally* or *usually* does is an
experience claim it cannot make, even when the sentence is flattering and
probably true.

## How this was done

**Pass one** scanned every MDX body, every FAQ question and answer in
`site.config.ts`, and the prose in every component and page. It flagged 88
candidate sentences.

**Pass two** scanned the RENDERED text of all 20 built pages with a wider
pattern set, after the first round of rewrites. It caught 6 more that pass one
had missed, including "the debris leaves with us", "so you are not left with a
pile", "taken apart and hauled off in the same visit", and an appliance
description saying units are "disconnected", which implies this company
performs gas and plumbing disconnection. None of those are in FACTS.

That second pass is the useful lesson: a keyword scan over source files is a
net, not a guarantee. Reading the rendered page is what caught the rest.

**89 sentences were rewritten.** The scan now returns 8 matches,
all of them service names, general descriptions of the trade, or questions.

---

## REWRITTEN

### `app/privacy-policy/page.tsx`

**1. Why:** promised an action

Before:
```
and we will take care of it.
```
After:
```
and ask for it to be corrected or removed.
```

### `app/terms/page.tsx`

**2. Why:** 'every job' plus a promise about being told before work carries on

Before:
```
No price appears anywhere on this website. Every job is quoted individually, and a
free virtual estimate is offered before work begins. A quote covers the work described
when it was given. If what is actually on site differs, in volume, in weight, or in
how hard it is to reach, we will tell you before we carry on, not after.
```
After:
```
No price appears anywhere on this website. Prices are quoted per job, and a free
virtual estimate is offered. A quote covers the work described when it was given. If
what is actually on site differs, in volume, in weight, or in how hard it is to reach,
the quote may change, so ask before work continues.
```

### `components/AboutTeaser.tsx`

**3. Why:** 'you deal with Earl' is a claim about who answers; the rest is a claim about competitors

Before:
```
You deal with Earl. Not a call centre, not a franchise script.
```
After:
```
Houston, seven days a week, 8:00am to 5:00pm. Free virtual estimates, and $50 off a
first service.
```

### `components/CtaBand.tsx`

**4. Why:** implied a response

Before:
```
Call <Phone className="text-primary-dark" /> or send a message and we will get back to
you with a quote.
```
After:
```
Call <Phone className="text-primary-dark" /> or send a message to start a free
estimate.
```

### `components/HoursPanel.tsx`

**5. Why:** promised a notification sequence for an unconfirmed charge

Before:
```
Call <Phone className="text-primary-dark" /> and we will tell you the charge before
anyone is dispatched, not after.
```
After:
```
Call <Phone className="text-primary-dark" /> and ask what the charge is before you
book.
```

### `components/HowItWorks.tsx`

**6. Why:** 'the quote will match the real job' is a promise about accuracy

Before:
```
body: 'Tell us what you have and where it is sitting. Upstairs, out back, behind a
shed: say so now and the quote will match the real job.',
```
After:
```
body: 'Tell us what you have and where it is sitting. Upstairs, out back, behind a
shed: say so on the call so it is part of the quote.',
```

**7. Why:** estimate mechanic

Before:
```
body: 'You get a price before anyone comes out and before you have agreed to anything.
The estimate costs nothing either way.',
```
After:
```
body: 'You get a price before you commit to anything, and the estimate costs nothing
whether or not you book.',
```

**8. Why:** 'you point, we load, it goes' is a promise about how the work is carried out

Before:
```
body: 'Same-day service is available, and we work seven days a week from 8:00am to
5:00pm. You point, we load, it goes.',
```
After:
```
body: 'Same-day service is available, and scheduling runs seven days a week from
8:00am to 5:00pm.',
```

### `components/OffersBand.tsx`

**9. Why:** implied how a dispute would go

Before:
```
{ headline: '$50 off', body: 'your first service with us. Mention it when you call so
it is on the quote, not an argument afterwards.' },
```
After:
```
{ headline: '$50 off', body: 'your first service with us. Mention it when you call so
it is applied to the quote.' },
```

**10. Why:** estimate mechanic

Before:
```
{ headline: 'Free virtual estimates', body: 'You get a price before anyone drives out.
No charge whether you book or not.' },
```
After:
```
{ headline: 'Free virtual estimates', body: 'A price before you commit, at no charge
whether you book or not.' },
```

### `components/QuoteSection.tsx`

**11. Why:** estimate mechanic

Before:
```
Tell {config.displayName} what you have and where it is. You get a price before anyone
comes out, and before you have agreed to anything.
```
After:
```
Tell {config.displayName} what you have and where it is. You get a price before you
commit to anything.
```

### `content/about.mdx`

**12. Why:** sequence mechanic of the estimate + two promises about handling and notification; rewritten as customer instructions

Before:
```
You call or send the form, describe what you have, and get a free virtual estimate
before anyone comes out. Nothing is removed that you have not cleared, and if what is
on site turns out to be different from what was described, you hear about it before
the work carries on rather than after.
```
After:
```
You call or send the form, describe what you have, and get a free virtual estimate
before you commit to anything. Mark anything that is staying before work starts, and
if what is on site turns out to be different from what you described, raise it and ask
for the quote to be looked at again.
```

**13. Why:** who answers the phone is not in FACTS

Before:
```
It is run by Earl, and when you call, Earl is who you are dealing with.
```
After:
```
It is run by Earl.
```

**14. Why:** 'come apart here' and 'the debris leaves with us' are claims about how the company works and how a job ends; replaced with what the service list covers

Before:
```
Demolition. It is in the name because it is genuinely part of the work: sheds, decks,
fences, playground sets and interior fixtures come apart here, and the debris leaves
with us rather than sitting in your yard waiting on a second contractor.
```
After:
```
Demolition. It is in the name because light demolition is on the service list
alongside hauling: sheds, decks, fences, playground sets and interior fixtures.
Because both are services here, the teardown and the debris can be quoted together
rather than as two jobs.
```

### `content/contact.mdx`

**15. Why:** describes the estimate mechanic; FACTS says only that virtual estimates are free

Before:
```
We cover {config.primaryCity}, {config.primaryState}, and you get a free virtual
estimate before anyone drives out, and before you have agreed to anything.
```
After:
```
We cover {config.primaryCity}, {config.primaryState}, and the virtual estimate is free
whether or not you book.
```

**16. Why:** promised a notification sequence for a charge whose amount is not even confirmed

Before:
```
After-hours calls are answered too, and emergency after-hours service is available
with a trip charge that you will hear before anyone is dispatched.
```
After:
```
After-hours calls are answered too, and emergency after-hours service is available. A
trip charge applies; ask what it is when you call.
```

### `content/home.mdx`

**17. Why:** estimate mechanic

Before:
```
Veteran owned, open seven days a week, and the estimate is free before anyone drives
out.
```
After:
```
Veteran owned, open seven days a week, and the estimate is free.
```

**18. Why:** claim about competitors + a same-visit timing promise; replaced with what the service list actually covers

Before:
```
That is the part most haulers skip: a shed still standing, a deck that has to come
apart, a hot tub nobody can lift. We do that and then take it away in the same visit,
which is usually the difference between one phone call and three.
```
After:
```
That covers the things that have to come apart before they can be hauled: a shed still
standing, a deck that has to come apart, a hot tub nobody can lift. Demolition and
hauling are both on the service list, so it is one call rather than one for each.
```

### `content/referral-program.mdx`

**19. Why:** frequency claim about other trades

Before:
```
You see the pile before anyone else does, and most of the time you walk past it
because hauling is not your trade.
```
After:
```
You see the pile before anyone else does, and if hauling is not your trade there is
nothing you can do with it.
```

### `content/services.mdx`

**20. Why:** two frequency claims and an implied pricing promise

Before:
```
Usually, yes, and it is almost always cheaper than booking twice. A garage cleanout
plus a shed that has to come down plus the brush pile out back is one job to us.
```
After:
```
Ask when you call. A garage cleanout plus a shed that has to come down plus the brush
pile out back can be quoted as one job rather than three.
```

**21. Why:** frequency claim

Before:
```
This list is the work that comes up most, not a boundary.
```
After:
```
This list is not a boundary.
```

### `content/services/appliance-removal.mdx`

**22. Why:** frequency claim wrapped around the hours fact; hours and same-day are FACTS and are kept

Before:
```
Yes, and it is worth raising when you book. Delivery windows move, so the fact that we
run seven days a week from 8:00am to 5:00pm with same-day service available is usually
what makes the timing work.
```
After:
```
Yes, and it is worth raising when you book. Delivery windows move, so it helps to know
that scheduling runs seven days a week from 8:00am to 5:00pm and same-day service is
available.
```

**23. Why:** promised a response

Before:
```
Ask about your specific unit during the free virtual estimate and you will be told
what applies to it rather than a general promise.
```
After:
```
Ask about your specific unit when you call rather than assuming from this page.
```

**24. Why:** frequency claim

Before:
```
Kitchen remodels, rental turnovers and estate clearances often mean several at once.
```
After:
```
Kitchen remodels, rental turnovers and estate clearances can mean several at once.
```

### `content/services/commercial-cleanouts.mdx`

**25. Why:** promised a response

Before:
```
Tell us the window you need and you will be told what fits before anything is booked.
```
After:
```
Tell us the window you need when you call and ask what fits it.
```

**26. Why:** frequency claim about their own customer base

Before:
```
## Who usually books this?
```
After:
```
## Who is this for?
```

### `content/services/construction-debris-removal.mdx`

**27. Why:** claim about what most builds want, a frequency claim, and a reference to a crew

Before:
```
Yes, and most builds want that rather than one clear at the end. Working seven days a
week from 8:00am to 5:00pm is usually what makes it possible to get a site clear
before the next crew shows up.
```
After:
```
Yes. Repeat visits across a build are scheduled the same way as a single clear, and
scheduling runs seven days a week from 8:00am to 5:00pm.
```

### `content/services/estate-cleanouts.mdx`

**28. Why:** stated how the company approaches the work; replaced with an instruction

Before:
```
{config.displayName} handles estate cleanouts in {config.primaryCity},
{config.primaryState} for executors and families clearing a property after a death or
a move into care. The job is to get the house empty without rushing anybody through
it.
```
After:
```
{config.displayName} handles estate cleanouts in {config.primaryCity},
{config.primaryState} for executors and families clearing a property after a death or
a move into care. Say what pace suits the family when you call.
```

**29. Why:** handling promise plus a frequency claim

Before:
```
Then we work around it. Mark or set aside anything that stays, and nothing else is
touched. The job can be split across several visits if that is what the family needs,
which is more common than doing it in one day.
```
After:
```
Then say so when you call. Mark or set aside anything that stays before work starts,
and ask about splitting the job across several visits if that suits the family better
than one day.
```

**30. Why:** promised ongoing updates

Before:
```
Arrange property access with us and you will be kept updated as it goes.
```
After:
```
Arrange property access when you book.
```

**31. Why:** promised a response

Before:
```
Say during the estimate which items you would rather see go to someone than to a load,
and you will be told what is workable.
```
After:
```
Say during the estimate which items you would rather see donated, and ask what is
workable for them.
```

### `content/services/furniture-removal.mdx`

**32. Why:** frequency claim about their own jobs

Before:
```
That is the normal case, not the hard one. Sectionals, sleeper sofas and armoires
regularly have to come apart to get out.
```
After:
```
Sectionals, sleeper sofas and armoires can have to come apart to get out.
```

### `content/services/garage-cleanouts.mdx`

**33. Why:** frequency claim

Before:
```
The one difference worth planning around is facility access hours, which are usually
narrower than ours.
```
After:
```
The one difference worth planning around is facility access hours, which may be
narrower than ours.
```

**34. Why:** estimate mechanic

Before:
```
The free virtual estimate exists so you have both the scope and the price before
anyone is standing in your driveway.
```
After:
```
The free virtual estimate is there so you have the scope and the price before you
commit.
```

**35. Why:** 'the rest goes' is a handling promise; the pricing aside was also an unsupported claim about what the price depends on

Before:
```
No. Point out what stays and the rest goes. Plenty of people would rather sort first,
and that is fine too, but it is not a condition of booking and it is not what the
price depends on.
```
After:
```
No. Point out anything that stays before work starts. Plenty of people would rather
sort first, and that is fine too, but it is not a condition of booking.
```

### `content/services/hoarder-cleanouts.mdx`

**36. Why:** 'routine work' is an experience claim from a business under a year old, and 'treated that way' is a promise about conduct

Before:
```
{config.displayName} clears heavily filled homes in {config.primaryCity},
{config.primaryState}. This is routine work here and it is treated that way: the job
is to get the space back, not to have an opinion about how it got that way.
```
After:
```
{config.displayName} clears heavily filled homes in {config.primaryCity},
{config.primaryState}. If discretion, pacing, or who is present matter to you, raise
them when you call and ask how each one can be handled.
```

**37. Why:** promised how people will behave, and claimed a crew size, which FACTS bans outright

Before:
```
No. Nobody is going to make a remark, and nobody needs an explanation. You will be
dealing with a small operation rather than a rotating crew, which is usually what
people are actually worried about when they ask.
```
After:
```
You do not owe anyone an explanation of how the house got this way, and you do not
have to give one to get a quote. Ask about discretion directly when you call.
```

**38. Why:** frequency claim plus a promise that the schedule bends to the customer

Before:
```
Yes, and often that is easier on everyone than one long day. Say what pace suits the
household during the free virtual estimate and the plan is built around that rather
than around our schedule.
```
After:
```
Ask about splitting the work across several visits. Say what pace suits the household
during the free virtual estimate and ask for the schedule to be set around it.
```

**39. Why:** handling promise

Before:
```
Stop us and set it aside. Nothing leaves that you have not cleared, and changing your
mind halfway is expected rather than a problem.
```
After:
```
Say so and set it aside. Anything you want to keep is worth marking before work
starts, and worth saying straight away if you change your mind partway.
```

### `content/services/hot-tub-removal.mdx`

**40. Why:** reference to a crew

Before:
```
If that is not something you can do yourself, raise it during the estimate rather than
when the crew arrives.
```
After:
```
If that is not something you can do yourself, raise it during the estimate rather than
on the day.
```

**41. Why:** promised the approach would be planned around them

Before:
```
Point out anything you are worried about before work starts, including decking boards,
pavers and sprinkler heads on the path out, and the approach is planned around them.
```
After:
```
Point out anything you are worried about before work starts, including decking boards,
pavers and sprinkler heads on the path out, and ask how the route out will be handled.
```

### `content/services/light-demolition.mdx`

**42. Why:** same-visit timing promise; demolition AND removal are both on the FACTS service list, so the pairing is kept and only the timing dropped

Before:
```
{config.displayName} takes down small structures across {config.primaryCity},
{config.primaryState} and removes what is left in the same visit: sheds, decks,
fences, playground sets, carpet and interior fixtures.
```
After:
```
{config.displayName} takes down small structures across {config.primaryCity},
{config.primaryState} and removes what is left: sheds, decks, fences, playground sets,
carpet and interior fixtures.
```

**43. Why:** promised a response

Before:
```
If you are not certain yours qualifies, describe it during the free virtual estimate
rather than guessing, and you will be told plainly whether it is a job for us.
```
After:
```
If you are not certain yours qualifies, describe it during the free virtual estimate
rather than guessing, and ask plainly whether it is a job for us.
```

**44. Why:** 'you are not left with a pile' is a promise about the finished state; replaced with what the service list covers

Before:
```
Yes. Taking it apart and hauling it off are the same job here, which is the whole
point. You are not left with a pile in the yard waiting on a second contractor and a
second bill.
```
After:
```
Yes. Demolition and removal are both on the service list, so clearing the debris can
be quoted with the teardown rather than as a second job with a second contractor.
```

### `content/services/mattress-disposal.mdx`

**45. Why:** frequency claim

Before:
```
Move-outs, rental turnovers and furnished properties often mean three or four.
```
After:
```
Move-outs, rental turnovers and furnished properties can mean three or four.
```

### `content/services/property-cleanouts.mdx`

**46. Why:** a coverage claim about turnover windows plus a promised response

Before:
```
Same-day service is available and we work seven days a week from 8:00am to 5:00pm,
which covers most turnover windows. Call with the date it has to be empty by and you
will be told what is open rather than what is convenient.
```
After:
```
Same-day service is available and we work seven days a week from 8:00am to 5:00pm.
Call with the date it has to be empty by and ask what is open.
```

### `content/services/yard-waste-removal.mdx`

**47. Why:** promised a notification sequence for an unconfirmed charge

Before:
```
Emergency after-hours service is available and a trip charge applies, which you will
hear before anyone is dispatched rather than afterwards.
```
After:
```
Emergency after-hours service is available and a trip charge applies. Ask what it is
when you call.
```

**48. Why:** future-action promise restated as what the service is

Before:
```
Get it dropped first and we will clear what is left.
```
After:
```
Get it dropped first, and clearing the debris is a job for us.
```

### `site.config.ts`

**49. Why:** sequence claim on all 13 price notes

Before:
```
set by a free virtual estimate before any work starts
```
After:
```
set by a free virtual estimate
```

**50. Why:** estimate mechanic

Before:
```
There is no flat rate, because a few bags and a full garage are not the same job. EJC
Demo Junk & Haul gives a free virtual estimate first, so you know the price before
anyone shows up and before you have agreed to anything.
```
After:
```
There is no flat rate, because a few bags and a full garage are not the same job. EJC
Demo Junk & Haul gives a free virtual estimate, so you have a price before you commit
to anything.
```

**51. Why:** frequency claim about availability

Before:
```
Same-day service is available. Call and ask what is open today. If it cannot be today,
we are open seven days a week from 8:00am to 5:00pm, so the next opening is rarely far
off.
```
After:
```
Same-day service is available. Call and ask what is open today. If it cannot be today,
we are open seven days a week from 8:00am to 5:00pm.
```

**52. Why:** promised the job would be planned around it, and promised quote accuracy

Before:
```
No. Tell us where the items are and we will plan the job around that. If it is
upstairs, in a back room, or behind a shed, say so during the estimate so the quote
reflects the real work.
```
After:
```
No. Say where the items are when you call. If it is upstairs, in a back room, or
behind a shed, mention it during the estimate so it is part of what gets quoted.
```

**53. Why:** service list is FACTS and is kept; the promised answer is not

Before:
```
Depending on the item, we offer recycling pickup, donation drop-off, scrap metal
recycling, and electronics recycling as part of what we do. Ask about a specific item
during your estimate and we will tell you what applies to it.
```
After:
```
Recycling pickup, donation drop-off, scrap metal recycling and electronics recycling
are all on the service list. Ask about a specific item during your estimate.
```

**54. Why:** promised quote accuracy and asserted job duration

Before:
```
Usually, yes, and it is worth mentioning during the estimate. Doorway width, stair
turns, and whether a piece comes apart all change how long the job takes, so flag them
early and the quote will be accurate.
```
After:
```
Often it has to come apart to get out, and that is worth mentioning during the
estimate. Doorway width, stair turns and whether a piece separates all affect the job,
so flag them early.
```

**55. Why:** frequency claim plus a promise about how it would be received

Before:
```
Yes. Single-item pickups are normal work, not an inconvenience. Call with what you
have and EJC Demo Junk & Haul will quote it the same way as a full room.
```
After:
```
Yes. A single piece is quoted the same way as a full room, so there is no minimum you
have to reach before calling.
```

**56. Why:** 'routine' is an experience claim, and the sentence promised what the crew would bring

Before:
```
Yes. Refrigerators and freezers are routine appliance removals. Mention the unit when
you call so the crew brings the right equipment for the size and where it sits.
```
After:
```
Yes. Refrigerators and freezers come under appliance removal. Mention the size and
where the unit sits when you call, so it is part of the quote.
```

**57. Why:** service list kept; promised answer removed

Before:
```
Appliance recycling and scrap metal recycling are both part of what EJC Demo Junk &
Haul offers. Ask about your specific unit during the free virtual estimate and we will
tell you what applies.
```
After:
```
Appliance recycling and scrap metal recycling are both on the service list. Ask about
your specific unit during the free virtual estimate.
```

**58. Why:** pricing claim we cannot support

Before:
```
Yes, and it is cheaper to handle them in one visit than to book twice. Mention both
when you call so the estimate covers the whole set rather than one piece of it.
```
After:
```
Yes. Mention both when you call so the estimate covers the whole set rather than one
piece of it.
```

**59. Why:** frequency claim plus a promise about the quote

Before:
```
Yes. Several at once is common for move-outs, rentals, and property turnovers. Tell us
how many during the free virtual estimate and the quote will reflect the full load.
```
After:
```
Yes. Move-outs, rentals and property turnovers can mean several at once. Give the
number during the free virtual estimate so the whole load is quoted.
```

**60. Why:** 'the rest goes' is a handling promise

Before:
```
No. Point out anything that stays and the rest goes. If you would rather sort first,
that works too, but a garage cleanout does not require it.
```
After:
```
No. Point out anything that stays before work starts. If you would rather sort first,
that works too, but a garage cleanout does not require it.
```

**61. Why:** estimate mechanic

Before:
```
It depends on how full it is and how much has to be carried. That is what the free
virtual estimate is for; you get the scope and the price before anyone is standing in
your driveway.
```
After:
```
It depends on how full it is and how much has to be carried, which is what the free
virtual estimate is for. Ask for the scope as well as the price.
```

**62. Why:** promised quote accuracy

Before:
```
Yes. Attic, basement, and storage cleanouts all fall under this service. Mention the
stairs, hatches, or pull-down ladders involved during the estimate so the quote
reflects the real access.
```
After:
```
Yes. Attic, basement and storage cleanouts all fall under this service. Mention the
stairs, hatches or pull-down ladders involved during the estimate so the access is
part of what gets quoted.
```

**63. Why:** handling promise

Before:
```
Say so. Mark or set aside whatever stays and we work around it. Nothing is removed
that you have not cleared, and the job can be split across visits if the family needs
time.
```
After:
```
Say so when you call. Mark or set aside whatever stays before work starts, and ask
about splitting the job across visits if the family needs time.
```

**64. Why:** promised ongoing updates

Before:
```
Yes. The estimate is virtual and free, so you do not need to be in Houston to get a
price. Arrange property access with us and we will keep you updated.
```
After:
```
Yes. The estimate is virtual and free, so you do not need to be in Houston to get a
price. Arrange property access when you book.
```

**65. Why:** promised answer

Before:
```
Donation drop-off is one of the services EJC Demo Junk & Haul offers. Tell us during
the estimate which items you would rather see donated than discarded and we will tell
you what is workable.
```
After:
```
Donation drop-off is on the service list. Say during the estimate which items you
would rather see donated than discarded, and ask what is workable for them.
```

**66. Why:** 'routine work' is an experience claim and 'treated that way' is a promise about conduct

Before:
```
No. This is routine work and it is treated that way. The job is to clear the space and
leave the household better off, not to comment on how it got there.
```
After:
```
You do not owe anyone an explanation of how the house got this way, and you do not
have to give one to get a quote. Ask about discretion directly when you call.
```

**67. Why:** frequency claim plus a promise that the plan bends to the customer

Before:
```
Yes. Stages are often easier on everyone than one long day. Say what pace suits you
during the free virtual estimate and the plan is built around that.
```
After:
```
Ask about splitting the work across several visits. Say what pace suits the household
during the free virtual estimate and ask for the schedule to be set around it.
```

**68. Why:** promised the visit would be planned around it

Before:
```
Tell us what discretion you need and when, and we will plan the visit around it.
Scheduling is flexible: EJC Demo Junk & Haul works seven days a week from 8:00am to
5:00pm.
```
After:
```
Say what discretion you need and when, and ask how the visit can be arranged around
it. EJC Demo Junk & Haul works seven days a week from 8:00am to 5:00pm.
```

**69. Why:** handling promise

Before:
```
Stop us and set them aside. Nothing leaves the property that you have not cleared, and
changing your mind mid-job is expected rather than a problem.
```
After:
```
Say so and set them aside. Anything you want to keep is worth marking before work
starts, and worth saying straight away if you change your mind partway.
```

**70. Why:** frequency claim plus an implied scheduling outcome

Before:
```
Yes. Repeat visits across a build are normal. We are open seven days a week from
8:00am to 5:00pm, which usually makes it possible to clear a site before the next
trade arrives.
```
After:
```
Yes. Repeat visits across a build are quoted the same way as a single clear, and we
are open seven days a week from 8:00am to 5:00pm.
```

**71. Why:** frequency claims plus a promise about quote accuracy

Before:
```
That is normal and it is why hot tubs are usually cut down on site rather than carried
out whole. Describe the access during the free virtual estimate so the quote matches
the real route out.
```
After:
```
That is why a hot tub is often cut down on site rather than carried out whole.
Describe the access during the free virtual estimate so the route out is part of what
gets quoted.
```

**72. Why:** promised the approach would be planned around it

Before:
```
Point out anything you are concerned about before work starts, including decking,
pavers, and sprinkler heads on the path out, and the approach can be planned around
it.
```
After:
```
Point out anything you are concerned about before work starts, including decking,
pavers and sprinkler heads on the path out, and ask how the route out will be handled.
```

**73. Why:** promised a response

Before:
```
Scheduling runs seven days a week from 8:00am to 5:00pm, after-hours calls are
answered, and emergency after-hours service is available with a trip charge. Tell us
the window you need and we will tell you what fits.
```
After:
```
Scheduling runs seven days a week from 8:00am to 5:00pm, after-hours calls are
answered, and emergency after-hours service is available with a trip charge. Say what
window you need when you call and ask what fits it.
```

**74. Why:** frequency claim about their own customer base

Before:
```
Who do you usually work with on commercial jobs?
```
After:
```
Who is commercial work for?
```

**75. Why:** coverage claim about turnover windows plus a promised response

Before:
```
Same-day service is available, and we work seven days a week from 8:00am to 5:00pm,
which covers most turnover windows. Call with the date you need it empty by and we
will tell you what is open.
```
After:
```
Same-day service is available, and we work seven days a week from 8:00am to 5:00pm.
Call with the date you need it empty by and ask what is open.
```

**76. Why:** promised a response about an unconfirmed charge

Before:
```
Yes. Storm debris cleanup is part of this service, along with brush and tree debris
removal. Emergency after-hours service is available and a trip charge applies; call
and we will tell you what it is for your job.
```
After:
```
Yes. Storm debris cleanup is part of this service, along with brush and tree debris
removal. Emergency after-hours service is available and a trip charge applies; call
and ask what it is for your job.
```

**77. Why:** future-action promise restated as what the service is

Before:
```
We remove brush, limbs, and debris that is already down. Felling a standing tree is a
different trade; if that is what you need, get it dropped first and we will clear what
is left.
```
After:
```
We remove brush, limbs and debris that is already down. Felling a standing tree is a
different trade; if that is what you need, get it dropped first, and clearing the
debris is a job for us.
```

**78. Why:** estimate mechanic

Before:
```
You get a free virtual estimate first, which means you know the cost before anyone
comes out and before you commit.
```
After:
```
You get a free virtual estimate, which means you have the cost before you commit to
anything.
```

**79. Why:** described the estimate mechanic, which FACTS explicitly says is unknown, and promised to walk the caller through it

Before:
```
It is a no-cost quote arranged before any visit, so you are not paying for someone to
come and look. Call EJC Demo Junk & Haul and we will walk you through how to set one
up.
```
After:
```
It is a quote that costs nothing, whether or not you go ahead. Call EJC Demo Junk &
Haul and ask how to set one up.
```

**80. Why:** 'normal hours' plus a promised notification sequence for an unconfirmed charge

Before:
```
Yes. After-hours calls are answered, and emergency after-hours service is available. A
trip charge applies for emergency calls outside normal hours; call and we will tell
you what it is before anyone is dispatched.
```
After:
```
Yes. After-hours calls are answered, and emergency after-hours service is available. A
trip charge applies for emergency calls outside the hours above; call and ask what it
is.
```

**81. Why:** 'in one visit' is a timing promise

Before:
```
'Household junk hauled away in one visit: boxes, bags, old furniture, electronics, and
whatever else has stacked up.'
```
After:
```
'Household junk hauled away: boxes, bags, old furniture, electronics, and whatever
else has stacked up.'
```

**82. Why:** 'disconnected' implies the company performs gas and plumbing disconnection, which is a different trade and is nowhere in FACTS

Before:
```
'Refrigerators, washers, dryers, ranges, water heaters, and freezers disconnected from
their spot and hauled out.'
```
After:
```
'Refrigerators, washers, dryers, ranges, water heaters, and freezers taken out of the
spot they have sat in and hauled away.'
```

**83. Why:** 'driving one to a dump' asserts a disposal destination

Before:
```
'Mattresses and box springs of any size taken out of the bedroom and hauled away, so
you are not driving one to a dump yourself.'
```
After:
```
'Mattresses and box springs of any size, taken out of the bedroom and hauled away.'
```

**84. Why:** 'worked at the pace the family sets' is a promise about conduct

Before:
```
'Whole-property clearing for executors and families settling an estate, worked at the
pace the family sets rather than a rushed schedule.'
```
After:
```
'Whole-property clearing for executors and families settling an estate, with the pace
agreed when the job is quoted.'
```

**85. Why:** 'discreetly and without judgment, at whatever pace' is three promises about conduct

Before:
```
'Heavily filled homes cleared discreetly and without judgment, at whatever pace the
household is comfortable with.'
```
After:
```
'Heavily filled homes cleared, with discretion and pacing agreed before any work
starts.'
```

**86. Why:** 'in the same visit' is a timing promise

Before:
```
'Sheds, decks, fences, playground sets, and similar structures taken apart and hauled
off in the same visit.'
```
After:
```
'Sheds, decks, fences, playground sets, and similar structures taken apart, with the
debris hauled off as well.'
```

**87. Why:** 'you are not left with a pile' is a promise about how a job ends

Before:
```
Yes. Taking the structure apart and removing what is left are the same job here, so
you are not left with a pile in the yard afterwards.
```
After:
```
Yes. Demolition and removal are both on the service list, so clearing the debris can
be quoted with the teardown rather than as a second job.
```

**88. Why:** 'the rest goes' is a handling promise

Before:
```
No. Point out what stays and the rest goes. If you would rather sort first, that works
too, but a garage cleanout does not require it.
```
After:
```
No. Point out anything that stays before work starts. If you would rather sort first,
that works too, but a garage cleanout does not require it.
```

**89. Why:** asserted a pricing policy and a no-minimum policy, neither of which is in FACTS

Before:
```
Yes. A single piece is quoted the same way as a full room, so there is no minimum you
have to reach before calling.
```
After:
```
Yes. Call with whatever you have, however small, and ask for a quote on it.
```

---

## KEPT, with the FACTS line that supports each

- **{ headline: 'Same-day service', body: 'Available. Call and ask what is still open today rather than assuming it is too late.' },**
  - KEPT. FACTS: 'Same-day service' is a listed customer offer. The rest is an instruction to the caller, not a claim.

- **Yes. New customers get $50 off their first service. Mention it when you call or when you request your free estimate so it is applied to the quote rath**
  - KEPT. FACTS: '$50 off first service'. The rest is an instruction to the caller.

- **Renters, realtors, property managers, contractors, businesses, municipalities, senior citizens, estate executors, and storage facility operators. The **
  - KEPT. FACTS lists exactly these groups under 'Who they serve'.

- **Yes. It is a veteran owned business, owned by Earl. The "Demo" in the name is short for demolition, which is why light demolition sits alongside hauli**
  - KEPT. FACTS: 'Veteran owned business', 'Owner: Earl', and 'Demo means demolition'.

- **All 13 service pages and the homepage: "Same-day service is available"**
  - FACTS, Offers: "Same-day service"

- **All pages: "open seven days a week from 8:00am to 5:00pm"**
  - FACTS, Hours: "Monday through Sunday, 8:00am to 5:00pm Central"

- **All pages: "After-hours calls are answered" and "Emergency after-hours service is available. A trip charge applies."**
  - FACTS, Hours: "After-hours calls are answered. Emergency service is available." The AMOUNT and the exact hours stay withheld.

- **Homepage and service pages: "free virtual estimate"**
  - FACTS, Offers: "Free virtual estimates". The mechanics are never described, per FACTS, Withheld.

- **Promo bar, offers band, homepage FAQ: "$50 off your first service"**
  - FACTS, Offers: "$50 off first service"

- **Referral page and construction debris page: the $20 and $75 payouts**
  - FACTS, Offers: "$20 for a verified lead that requests a quote, $75 for a lead that books and has the job completed"

- **Homepage and about page: "veteran owned", "run by Earl"**
  - FACTS, Identity: "Veteran owned business", "Owner: Earl (first name only)". No branch, no bio, no tenure.

- **Homepage and about page: the "Demo" means demolition**
  - FACTS, Identity: '"Demo" means Demolition.'

- **Who we work for, and the homepage FAQ: the ten customer groups**
  - FACTS, Who they serve: the same ten groups, verbatim.

- **Service descriptions and FAQs naming recycling, donation drop-off, scrap metal, e-waste and appliance recycling**
  - FACTS, Services, Recycling and donation. Named as items on the service list, never as a disposal promise or a diversion rate.

- **Service names and what each service is: "we haul it off", "we remove brush, limbs and debris that is already down"**
  - FACTS, Services. Saying what a service IS is explicitly allowed; saying how this company performs it is not.

- **"Often it has to come apart to get out"; "a hot tub is often cut down on site"**
  - General description of the trade, not of this company. Allowed by rule 2.

---

## Patterns removed everywhere

| Pattern | Why it had to go |
|---|---|
| routine, normal, common, usually, often, most, rarely, always | Experience and frequency claims from a business with no track record to cite |
| any mention of a crew, or of crew size | FACTS bans crew size outright. One sentence claimed "a small operation rather than a rotating crew" |
| nothing is removed, nothing else is touched, nothing leaves, the rest goes | Promises about handling. Rewritten as instructions to the customer |
| we will plan, we will keep you updated, you will be told, the plan is built around that | Promises about conduct and responsiveness. Rewritten as "ask" |
| the quote will match the real job, the quote will be accurate | Promises about quote accuracy |
| in one visit, in the same visit, before anyone comes out, before anyone is dispatched | Timing and sequence promises, including the mechanics of the virtual estimate, which FACTS explicitly records as unknown |
| the debris leaves with us, you are not left with a pile, so you are not driving one to a dump | Promises about how a job ends, and an implied disposal destination |
| appliances "disconnected" | Implies gas and plumbing disconnection, a different trade, nowhere in FACTS |
| most haulers skip, not a call centre, not a franchise script | Claims about competitors |
| you deal with Earl | A claim about who answers the phone |
| no minimum, quoted the same way as a full room | Pricing policy claims |
