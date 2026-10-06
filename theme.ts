/**
 * Visual theme for EJC Demo Junk & Haul.
 *
 * Direction: HEAVY IRON (AGENT.md Phase 2b lists junk removal and demolition
 * under it by name). The logo is already speaking this language: a hard black
 * circular badge, a dump truck, and distressed condensed white lettering that
 * breaks the badge edge.
 *
 * The logo is monochrome, so it contributes no hue at all and the accent is an
 * additive decision rather than a derived one. It is hazard AMBER, not orange,
 * deliberately: the nearest Houston competitor is orange, the national
 * franchise is green and orange, and the whole category is saturated with
 * orange. Amber reads as caution stripe, matches the dump truck, and is
 * distinguishable at thumbnail size on a search results page.
 *
 * Every photograph on this site is licensed stock, so the layout is built to
 * hold on type, rule weight and color alone. A rejected photo degrades to a
 * flat charcoal field and the page still looks finished.
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
    accentDark: string
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
    // Cool near-black. Not #000: pure black on a screen reads as a hole rather
    // than as material, and it kills the distressed texture in the logo.
    primary: '#15171A',
    primaryDark: '#0B0D0F',
    // Light cool gray for interior page headers. Cool, because the logo and
    // every photograph here are neutral; a warm tint would fight both.
    primarySoft: '#E5E8EB',
    // Hazard amber. Dark text sits on it; white on amber fails AA and is used
    // nowhere. See scripts/proof/contrast.mjs.
    accent: '#F5A524',
    // Darkened enough to carry small text on the off-white ground, which is
    // what the form's validation messages need.
    accentDark: '#8A5A00',
    bg: '#F3F4F6',
    surface: '#FCFCFD',
    ink: '#16191D',
    muted: '#53585F',
    // Dark enough to clear 3:1 against the surface, because this token is the
    // BORDER ON EVERY FORM INPUT and WCAG 1.4.11 treats that as a UI component
    // boundary. A prettier hairline would make the fields invisible to anyone
    // with low vision. Heavier rules suit this direction anyway.
    line: '#848B94',
    onPrimary: '#F3F4F6',
    onAccent: '#14161A',
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
