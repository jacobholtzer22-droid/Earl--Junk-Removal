/**
 * Runs scripts/proof/conversions.tsx twice: once against the real
 * site.config.ts, where both conversion labels are empty, and once with
 * `@/site.config` remapped to a fixture whose labels are test values.
 * The real config is never edited.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const entry = path.join(here, 'conversions.tsx')

console.log('PROOF: conversions fire exactly when they should, and never otherwise.')

let failed = 0
for (const [label, tsconfig] of [
  ['labels empty (real site.config.ts)', 'tsconfig.proof.json'],
  ['labels set (fixture)', 'tsconfig.labels.json'],
]) {
  const r = spawnSync('npx', ['tsx', entry], {
    stdio: 'inherit',
    env: { ...process.env, TSX_TSCONFIG_PATH: path.join(here, tsconfig) },
    cwd: path.join(here, '..', '..'),
  })
  if (r.status !== 0) {
    console.error(`\n  ^ ${label} FAILED`)
    failed++
  }
}
console.log('')
if (failed) {
  console.log(`${failed} of 2 label states FAILED.`)
  process.exit(1)
}
console.log('Both label states pass.')
