/**
 * Runs scripts/proof/pending-form.tsx twice: once against the real
 * site.config.ts, once with `@/site.config` remapped to a fixture whose only
 * difference is a non-empty businessSlug. The real config is never edited.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const entry = path.join(here, 'pending-form.tsx')
const proofTsconfig = path.join(here, 'tsconfig.proof.json')
const slugTsconfig = path.join(here, 'tsconfig.slug.json')

console.log('PROOF: the contact form cannot post while businessSlug is empty,')
console.log('       and posts exactly once, unchanged, as soon as it is set.')

let failed = 0
for (const [label, env] of [
  ['pre-launch (real site.config.ts)', { TSX_TSCONFIG_PATH: proofTsconfig }],
  ['live (slug fixture)', { TSX_TSCONFIG_PATH: slugTsconfig }],
]) {
  const r = spawnSync('npx', ['tsx', entry], {
    stdio: 'inherit',
    env: { ...process.env, ...env },
    cwd: path.join(here, '..', '..'),
  })
  if (r.status !== 0) {
    console.error(`\n  ^ ${label} FAILED`)
    failed++
  }
}
console.log('')
if (failed) {
  console.log(`${failed} of 2 directions FAILED.`)
  process.exit(1)
}
console.log('Both directions pass.')
