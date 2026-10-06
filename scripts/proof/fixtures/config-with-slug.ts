/**
 * The real site config with ONE field changed: a non-empty businessSlug.
 *
 * Used only by scripts/proof/pending-form.mjs to exercise the post-launch
 * direction, by mapping `@/site.config` here through
 * scripts/proof/tsconfig.slug.json. The real site.config.ts is never modified
 * by the test, so a crash cannot leave this repo in a wrong state.
 *
 * Imported by relative path on purpose: using the `@/` alias here would map
 * back to this file and recurse.
 */
import real from '../../../site.config'

const withSlug = { ...real, businessSlug: 'test-slug' }
export default withSlug
