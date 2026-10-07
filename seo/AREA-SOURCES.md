# AREA-SOURCES: every geographic fact on an area page, and where it came from

Area pages are the easiest place on a service site to invent something. The
temptation is to write "we have served Katy homeowners for years" or "we are
20 minutes from Sugar Land", and both are claims this business cannot make.

So the rule on these pages is narrow: **public geography only.** County, legal
status, and adjacent or nearby communities. Every one of those facts is listed
below with the source it came from. Anything not in this table does not appear
on an area page.

## Banned on area pages, explicitly

- Any claim of past jobs, customers or projects in that place. **Earl has
  supplied none, so there are none to describe.**
- Drive times, response times, or distance from a depot.
- Crews, trucks or staff based in or near a place.
- Being "local to", "based in", or "your neighbour in" anywhere but Houston.
- Named landfills, transfer stations or disposal sites.
- The radius Earl is willing to drive. He gave a figure; it is not published.

## Status matters, and most of these are not cities

Three of the nine places are **not incorporated cities**, and the copy and the
schema both have to say so correctly. Calling The Woodlands a city is wrong in
the same way that calling it a county would be wrong, and a reader who lives
there notices immediately.

schema.org has no type for "census-designated place", so incorporated cities
use `City` and everything else uses `Place`, which is accurate for all of them
and is on the verify.ts type allowlist.

| Place | Legal status | schema type | County | Source |
|---|---|---|---|---|
| **Houston** | Incorporated city, 1837 | `City` | Harris, with portions in Fort Bend and Montgomery | [Houston](https://en.wikipedia.org/wiki/Houston) |
| **Katy** | Incorporated city, 1945 | `City` | At the tripoint of Harris, Fort Bend and Waller | [Katy, Texas](https://en.wikipedia.org/wiki/Katy,_Texas) |
| **Sugar Land** | Incorporated city, 1959 | `City` | Fort Bend | [Sugar Land, Texas](https://en.wikipedia.org/wiki/Sugar_Land,_Texas) |
| **Pearland** | Incorporated city, 1959 | `City` | Brazoria, with portions in Fort Bend and Harris | [Pearland, Texas](https://en.wikipedia.org/wiki/Pearland,_Texas) |
| **Pasadena** | Incorporated city, 1923 | `City` | Harris | [Pasadena, Texas](https://en.wikipedia.org/wiki/Pasadena,_Texas) |
| **Humble** | Incorporated city, 1933 | `City` | Harris | [Humble, Texas](https://en.wikipedia.org/wiki/Humble,_Texas) |
| **Cypress** | **Unincorporated community**, inside Houston's extraterritorial jurisdiction | `Place` | Harris | [Cypress, Texas](https://en.wikipedia.org/wiki/Cypress,_Texas) |
| **Spring** | **Census-designated place**, not incorporated | `Place` | Harris, with a smaller area in Montgomery | [Spring, Texas](https://en.wikipedia.org/wiki/Spring,_Texas) |
| **The Woodlands** | **Special-purpose district and census-designated place.** Residents voted against incorporation in 2021 | `Place` | Montgomery, with portions in Harris | [The Woodlands, Texas](https://en.wikipedia.org/wiki/The_Woodlands,_Texas) |

### Exact wording from each source, for the three that are not cities

- **Cypress:** "unincorporated community", and "located completely inside the
  extraterritorial jurisdiction of the city of Houston".
- **Spring:** "a census-designated place (CDP) in Harris County, Texas". The
  name "is popularly applied to a large area of northern Harris County and a
  smaller area of southern Montgomery County."
- **The Woodlands:** "a special-purpose district and census-designated place".
  The Woodlands Township was "created by the 73rd Texas Legislature in 1993"
  and is run by "a seven-member board of directors". Residents "voted against
  incorporation by a wide margin" in 2021.

### One pronunciation note worth having

**Humble is pronounced UM-bəl**, with a silent H. It is not used in the copy,
but it is the kind of thing that tells a local whether the person writing has
any idea where they are, and it is worth Earl knowing the page was not written
by someone who thinks otherwise.

## How each fact is allowed to be used

| Fact | Allowed | Not allowed |
|---|---|---|
| County | "Katy sits at the tripoint of Harris, Fort Bend and Waller counties." | "We cover all of Harris County." |
| Legal status | "The Woodlands is a township rather than an incorporated city." | Any implication this changes the service |
| Adjacency | "Cypress sits inside Houston's extraterritorial jurisdiction." | "We are just down the road." |

## Confirm with Earl

**None of these eight has been confirmed by Earl one by one.** He gave a
driving radius and the list was drawn from inside it. See `CLIENT-TODO.md`
item 3: every area page is live on an assumption until he confirms the place
individually, and a page for somewhere he will not drive is worse than no page,
because it ranks, the phone rings, and he either turns the job down or takes an
unprofitable drive.
