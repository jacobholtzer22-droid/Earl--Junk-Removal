/**
 * The real site config with TWO things changed: a non-empty businessSlug, so
 * the contact form can actually post, and non-empty conversion labels, so the
 * tracking has something to fire.
 *
 * Used by scripts/proof/conversions.mjs to exercise the labels-set direction.
 * The real site.config.ts is never modified, so a crash cannot leave the repo
 * in a state where the live site fires conversions against test labels.
 *
 * Imported by relative path on purpose: the `@/` alias would map back here
 * and recurse.
 */
import real from '../../../site.config'

const withLabels = {
  ...real,
  businessSlug: 'test-slug',
  tracking: {
    ...real.tracking,
    conversionLabels: { contact: 'TEST_CONTACT_LABEL', call: 'TEST_CALL_LABEL' },
  },
}
export default withLabels
