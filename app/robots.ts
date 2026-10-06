import type { MetadataRoute } from 'next'
import { config } from '@/lib/config'

export const dynamic = 'force-static'

/** AI crawlers explicitly allowed so answer engines can cite the site. */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Amazonbot',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  // Pre-launch: a blanket Disallow for everyone, including the AI agents.
  // The allow-list below is the shape this file takes the moment
  // config.indexable flips to true, so going live is one boolean, not a
  // rewrite of this file under time pressure.
  if (!config.indexable) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: new URL('/sitemap.xml', config.domain).toString(),
      host: config.domain,
    }
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }, ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/' }))],
    sitemap: new URL('/sitemap.xml', config.domain).toString(),
    host: config.domain,
  }
}
