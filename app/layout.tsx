import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileCallBar from '@/components/MobileCallBar'
import Motion from '@/components/Motion'
import PromoBar from '@/components/PromoBar'
import { config } from '@/lib/config'
import { buildTitle, renderTitle, TITLE_TEMPLATE } from '@/lib/seo'
import theme from '@/theme'
import { bodyFont, headingFont } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(config.domain),
  title: {
    default: renderTitle(buildTitle({ kind: 'home' })),
    template: TITLE_TEMPLATE,
  },
  applicationName: config.displayName,
  // Mirrors config.indexable, like every page's own metadata. A hardcoded
  // index:true here would be the default for anything that ever forgets to
  // call buildMetadata.
  robots: config.indexable ? { index: true, follow: true } : { index: false, follow: false },
}

const cssVars = {
  '--c-primary': theme.palette.primary,
  '--c-primary-dark': theme.palette.primaryDark,
  '--c-primary-soft': theme.palette.primarySoft,
  '--c-accent': theme.palette.accent,
  '--c-accent-dark': theme.palette.accentDark,
  '--c-accent-on-dark': theme.palette.accentOnDark,
  /*
   * The same darkest token as space-separated RGB channels, so a gradient can
   * put alpha on it. A CSS custom property holding "#050D07" cannot be given
   * an alpha channel; one holding "5 13 7" can, via rgb(var(--x) / 0.3).
   *
   * This exists because the hero scrim was three hardcoded rgb(10 11 13 / ...)
   * stops living in the component. They were the OLD cool near-black, so when
   * the palette went green the scrim quietly stayed the previous brand's
   * colour and nothing failed to tell anyone.
   */
  '--c-primary-dark-rgb': theme.palette.primaryDark
    .replace('#', '')
    .match(/.{2}/g)!
    .map((h) => parseInt(h, 16))
    .join(' '),
  '--c-bg': theme.palette.bg,
  '--c-surface': theme.palette.surface,
  '--c-ink': theme.palette.ink,
  '--c-muted': theme.palette.muted,
  '--c-line': theme.palette.line,
  '--c-on-primary': theme.palette.onPrimary,
  '--c-on-accent': theme.palette.onAccent,
  '--radius': `${theme.radius}rem`,
  '--shadow': theme.shadow,
} as CSSProperties

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`} style={cssVars}>
      <body className="flex min-h-screen flex-col pb-16 md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-site focus:bg-surface focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <PromoBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileCallBar />
        <Motion />
      </body>
    </html>
  )
}
