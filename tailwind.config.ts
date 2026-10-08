import type { Config } from 'tailwindcss'

// Colors, radius, and shadow resolve to CSS variables that app/layout.tsx sets
// from theme.ts, so re-theming a site touches theme.ts and app/fonts.ts only.
// Alpha modifiers (bg-primary/50) are not supported with this approach; use the
// explicit *-soft tokens instead.
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--c-primary)',
        'primary-dark': 'var(--c-primary-dark)',
        'primary-soft': 'var(--c-primary-soft)',
        accent: 'var(--c-accent)',
        'accent-dark': 'var(--c-accent-dark)',
        'accent-on-dark': 'var(--c-accent-on-dark)',
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        ink: 'var(--c-ink)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        'on-primary': 'var(--c-on-primary)',
        'on-accent': 'var(--c-on-accent)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // The one radius. Use `rounded-site`; never a literal rounded-lg/xl.
        site: 'var(--radius)',
      },
      boxShadow: {
        // The one shadow. Use `shadow-site`; never shadow-md/lg/xl.
        site: 'var(--shadow)',
      },
      fontSize: {
        /*
         * The floor dropped from 2.5rem to 2.25rem when the display face
         * changed. Archivo is wider than the Oswald it replaced, and at 40px
         * "Junk Removal in Houston, TX" fell to three lines on a 360px screen
         * where it had been two. 36px puts it back to two. The ceiling and the
         * growth rate are untouched, so nothing changes above about 420px.
         */
        hero: ['clamp(2.25rem, 6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
      },
      maxWidth: { page: '72rem' },
    },
  },
  plugins: [],
}

export default config
