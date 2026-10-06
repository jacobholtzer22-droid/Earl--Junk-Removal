# STOCK-PHOTOS: every photograph on this site

**Every photograph on this site is licensed stock. Not one of them shows EJC
Demo Junk & Haul, its truck, its crew, or any job it has done.** No alt text,
caption or surrounding copy says or implies otherwise, and the site has no
gallery, no "our work" section and no before-and-after, for exactly that reason.

All nine are from **Pexels**, under the [Pexels
Licence](https://www.pexels.com/license/): free for commercial use, no
attribution required, modification permitted. Credit is recorded here anyway so
it can be given, and so every image can be traced to its source.

Every file was downloaded into this repo (`public/images/originals/`) and
converted to WebP by `npm run images`. **Nothing is hotlinked.** Every one was
viewed at full size before it was used.

Swapping any of these for a real photo is one line in
[`lib/stock-images.ts`](../lib/stock-images.ts).

---

## In use (9)

| File | Photographer | Source | Used on |
|---|---|---|---|
| `uprooted-tree-on-lawn.jpg` | April Yang | [pexels.com/photo/…-32394146](https://www.pexels.com/photo/uprooted-tree-after-severe-storm-in-urban-area-32394146/) | Homepage hero; Yard Waste and Storm Debris Removal |
| `stacked-cardboard-boxes.jpg` | cottonbro studio | [pexels.com/photo/…-4553261](https://www.pexels.com/photo/brown-cardboard-box-on-white-wooden-door-4553261/) | About |
| `basement-with-old-furniture.jpg` | Đỗ Huy Hoàng | [pexels.com/photo/…-10847200](https://www.pexels.com/photo/old-fashioned-furniture-10847200/) | Junk Removal |
| `discarded-sofa-at-kerb.jpg` | Sami Aksu | [pexels.com/photo/…-14356376](https://www.pexels.com/photo/abandoned-broken-couch-on-city-street-14356376/) | Furniture Removal |
| `residential-garage-with-shelving.jpg` | hi room | [pexels.com/photo/…-17181949](https://www.pexels.com/photo/garage-hall-in-house-17181949/) | Garage Cleanouts |
| `attic-with-stored-paintings-and-furniture.jpg` | Ekaterina Kobzareva | [pexels.com/photo/…-11495626](https://www.pexels.com/photo/paintings-in-attic-11495626/) | Estate Cleanouts |
| `broken-concrete-and-brick-pile.jpg` | Jan van der Wolf | [pexels.com/photo/…-23940504](https://www.pexels.com/photo/rubble-along-fence-23940504/) | Construction Debris Removal |
| `emptied-hall-with-stacked-chairs.jpg` | cottonbro studio | [pexels.com/photo/…-6344445](https://www.pexels.com/photo/wooden-chairs-inside-the-hall-6344445/) | Commercial Cleanouts |
| `moving-boxes-in-empty-room.jpg` | SHVETS production | [pexels.com/photo/…-7203775](https://www.pexels.com/photo/pile-of-carton-containers-on-floor-in-new-house-7203775/) | Property Cleanouts |

### Placements

Hero, service page banners and the About page image. **That is the whole list.**
No gallery, no "recent work", no before-and-after. `config.images.gallery` is an
empty array and the Gallery section does not render.

### Edits made

Two files were cropped to remove incidental brand marks. No other alteration
was made to any photograph: no retouching, no compositing, no colour grading.

| File | Crop | Why |
|---|---|---|
| `basement-with-old-furniture.jpg` | 520px off the left (2400×1602 → 1880×1602) | Removed a shelf carrying a readable Keurig/McCafé carton and a Ball canning-jar box |
| `residential-garage-with-shelving.jpg` | 650px off the left (2400×1600 → 1750×1600) | Removed a wheelbarrow with a readable "PROJECT SOURCE" brand mark |

---

## Pages that run with no photograph (5)

Not oversights. Each was searched for and nothing honest was found, so the page
runs on type and colour, which the layout is built to do.

| Page | Why there is no photo |
|---|---|
| Appliance Removal | Every "old appliance" result is a styled vintage prop or a decayed unit with a readable manufacturer badge. |
| Mattress Disposal | Every discarded-mattress photograph available is shot as urban decay: squats, graffiti, abandonment. |
| **Hoarder Cleanouts** | **Deliberate and permanent.** A photograph of a hoarded home is somebody's house and somebody's circumstances used as advertising. Do not add one, stock or real. |
| Light Demolition | No photograph of a deck or shed mid-dismantling without machinery or a crew in frame. |
| Hot Tub Removal | Nothing that is not a lifestyle spa shoot. |

---

## Rejected after viewing (6)

Recorded so nobody re-finds and re-uses them.

| Photo | Reason |
|---|---|
| Pexels 12786908, packed shed interior | Derelict and abandoned rather than cluttered; also edges into hoarded-home territory, and too busy to carry headline type. Was the original hero pick. |
| Pexels 31249540, demolition rubble | A yellow skip/dumpster with lettering in the right of frame. Dumpsters read as Earl's own equipment next to his name. |
| Pexels 30405805, old enamel appliance | A readable "Саратов" manufacturer badge on the unit. |
| Pexels 11017880, garage with open door | Foreign architecture (razor-wire fence, European gates); sparse and off-message. |
| Pexels 9714416, "storage with boxes" | Actually a wall of firearms. |
| Pexels 16013448, cluttered cabinet | Readable "Katco" and "SAK" brand packaging. |

---

## Rules for any replacement

Applies to real client photos as much as to stock.

1. **No trucks, trailers, dumpsters or crews, even unbranded.** Not until the
   vehicle and the crew genuinely are Earl's. Next to the EJC name, anything
   else reads as his equipment, which makes it a claim about the business.
2. No company branding, logos, readable lettering or licence plates.
3. No identifiable people who could be taken for Earl or his crew.
4. Alt text describes what is literally in the frame. It never says "our", "we"
   or "this job".
5. Sources: Unsplash or Pexels only. Never Google Images, never a competitor's
   site.
6. Download into `public/images/originals/`, run `npm run images`, write the alt
   in `public/images/manifest.json`, update `lib/stock-images.ts`, and add a row
   to this file.
