/**
 * Visual theme for Houston Waste Removal, operated by EJC Demo Junk & Haul.
 *
 * The client supplied a new identity in October 2026 and it replaced the one
 * this file used to describe. The old direction was HEAVY IRON: a black badge,
 * a dump truck, distressed condensed lettering, and an additive hazard amber
 * chosen because the logo was monochrome and contributed no hue at all.
 *
 * NONE OF THAT IS TRUE ANY MORE. The new mark is a green rear-loader truck
 * under a Houston skyline, inside a green arc, with a leaf in place of the O.
 * It carries its own colour, so the palette is now DERIVED rather than
 * invented: every green below was sampled from the supplied artwork, and the
 * neutrals were tuned around them. There is no guidelines document, so the
 * sampled values in client-assets/brand-2026-10 are the only source there is.
 *
 * The artwork's mid green #008020 is sampled and deliberately UNUSED. Two
 * greens a step apart in the same role read as a mistake rather than as a
 * system, so the palette keeps the deep green and the lime, which are far
 * enough apart to be doing different jobs.
 *
 * THE SYSTEM, taken from how the artwork itself uses the colours:
 *
 *   DARK GROUNDS CARRY THE LIME. LIGHT GROUNDS CARRY THE DEEP GREEN.
 *
 * Every marketing piece follows it: lime brush lettering on black, deep green
 * wordmark on white. It is also what the contrast maths requires, which is the
 * useful part. The mid green reads 3.52:1 on the dark panel and fails AA as
 * text there; the lime reads 11.42:1. On the light ground it is the other way
 * round, lime at 1.44:1 against deep green at 6.22:1. So the rule is not a
 * style preference, it is the only arrangement where both work, and
 * `accentOnDark` exists to make it impossible to get backwards.
 *
 * Lime is NEVER text on a light ground.
 *
 * The neutrals carry a slight green cast so the page does not look like a
 * grey template with a green logo dropped on it. Slight is the operative word:
 * bg is #F4F6F4, which is 2 points of green off neutral and still reads as
 * white rather than mint.
 */
export type HeroVariant = 'full-bleed' | 'split'

export interface Theme {
  palette: {
    /** The dark neutral. Also the full-dark section background. */
    primary: string
    primaryDark: string
    primarySoft: string
    /** The single accent. Buttons, the call bar, small marks. Under 5% of any page. */
    accent: string
    /** The accent darkened for TEXT ON A LIGHT GROUND. Also the focus ring. */
    accentDark: string
    /**
     * The accent for use ON A DARK GROUND, which is a different colour, not a
     * shade of the same one. The brand's lime. Never text on a light ground:
     * it reads 1.44:1 there and is invisible.
     */
    accentOnDark: string
    /** The off-white page ground. */
    bg: string
    surface: string
    /** Body text. Never pure black. */
    ink: string
    muted: string
    line: string
    onPrimary: string
    onAccent: string
  }
  /**
   * 'full-bleed': client photo behind a dark scrim, headline and phone CTA
   * left-aligned in the lower third. Needs a photo that can carry it.
   * 'split': large photo one side, oversized type the other. For weaker photos.
   */
  heroVariant: HeroVariant
  /** The ONE corner radius for the site, in rem. 0 for hard edges. */
  radius: number
  /** The ONE shadow for the site, as a CSS box-shadow value. 'none' is valid. */
  shadow: string
}

const theme: Theme = {
  palette: {
    // Near-black with a green cast, not #000. Pure black on a screen reads as
    // a hole rather than as material, and the logo's own dark ground is a very
    // dark green in the gradients rather than true black.
    primary: '#0A1A0F',
    primaryDark: '#050D07',
    // The page ground with more green in it, for interior page headers.
    primarySoft: '#E8F0E9',
    // SAMPLED, unchanged: the deep green of the WASTE REMOVAL wordmark.
    //
    // This is the PRIMARY BUTTON FILL on light sections and the brand colour
    // for text on light. White sits on it at 6.82:1. It is deliberately the
    // `accent` token rather than `accentDark`, because components/ContactForm
    // is sealed and cannot be edited: it fills its submit button with
    // `bg-accent text-on-accent`, so making those two tokens the deep green
    // and white is what gives the sealed form the correct button without
    // touching it.
    accent: '#016A1C',
    // ADJUSTED, one step darker: the hover state for that fill, and the
    // colour for small text that wants more than 6:1. White on it is 9.46:1,
    // and as text on the page ground it is 8.71:1.
    accentDark: '#015215',
    // SAMPLED, unchanged: the lime of the brush lettering. DARK GROUNDS ONLY,
    // as fill or as text, 11.42:1 on primary. Never on a light ground, where
    // it reads 1.44:1 and vanishes.
    accentOnDark: '#A4E048',
    bg: '#F4F6F4',
    surface: '#FCFDFC',
    ink: '#141915',
    muted: '#4E5A52',
    // Dark enough to clear 3:1 against the surface, because this token is the
    // BORDER ON EVERY FORM INPUT and WCAG 1.4.11 treats that as a UI component
    // boundary. Unchanged in intent from the previous identity, retinted.
    line: '#7E8C83',
    onPrimary: '#F4F6F4',
    // White, for the deep green button fill. Near-black is used on the LIME
    // fill instead, which is a different pair and is spelled out at each of
    // the two dark-section buttons.
    onAccent: '#FFFFFF',
  },
  // The hero photo is a curbside pile: the customer's problem, shot wide, with
  // enough dead sky to carry a scrim and lower-third type.
  heroVariant: 'full-bleed',
  // Hard edges throughout. Zero radius is the whole point of this direction;
  // a 4px radius here would read as a softened default rather than a decision.
  radius: 0,
  // No shadow anywhere on the site. Depth comes from flat color blocks and
  // heavy rules between sections, not from floating cards.
  shadow: 'none',
}

export default theme
