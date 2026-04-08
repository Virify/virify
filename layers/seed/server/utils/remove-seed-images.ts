#!/usr/bin/env tsx
/**
 * Delete all seed images from Cloudflare Images using IDs in images-to-seed.generated.ts
 *
 * Usage:
 *   pnpm seed:remove-images           — delete all IDs listed in the generated file
 *   pnpm seed:remove-images --dry-run — preview which IDs would be deleted, no changes
 *
 * Requires in .env:
 *   CF_ACCOUNT_ID
 *   CF_IMAGES_API_KEY
 */

import { config } from 'dotenv'
config()

import { readFile, writeFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const GENERATED_FILE = resolve(__dirname, 'images-to-seed.generated.ts')

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID
const CF_IMAGES_API_KEY = process.env.CF_IMAGES_API_KEY

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract all Cloudflare image IDs from the generated file via regex */
async function readIdsFromGeneratedFile(): Promise<string[]> {
  let content: string
  try {
    content = await readFile(GENERATED_FILE, 'utf-8')
  } catch {
    console.error(`❌  Generated file not found: ${GENERATED_FILE}`)
    console.error('    Run `pnpm seed:upload-images` first to create it.')
    process.exit(1)
  }

  // Match UUID-like strings and stable seed IDs (seed-{folder}-{n})
  const matches = content.match(/'([0-9a-f-]{36}|seed-[a-z-]+-\d+)'/g) ?? []
  return [...new Set(matches.map(m => m.slice(1, -1)))]
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type CloudflareDeleteResponse = {
  success: boolean
  errors?: Array<{ message: string }>
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  if (!CF_ACCOUNT_ID || !CF_IMAGES_API_KEY) {
    console.error('❌  Missing CF_ACCOUNT_ID or CF_IMAGES_API_KEY in environment')
    process.exit(1)
  }

  const ids = await readIdsFromGeneratedFile()

  if (ids.length === 0) {
    console.log('ℹ️  No image IDs found in generated file — nothing to delete.')
    return
  }

  console.log(`🗑  Found ${ids.length} image ID${ids.length !== 1 ? 's' : ''} in images-to-seed.generated.ts\n`)

  if (dryRun) {
    console.log('🔍 Dry run — no deletions will be made:\n')
    ids.forEach(id => console.log(`   ${id}`))
    console.log('\n🔍 Dry run complete.')
    return
  }

  let deleted = 0
  let skipped = 0
  let failed = 0

  for (const id of ids) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${CF_IMAGES_API_KEY}` },
      }
    )

    if (response.status === 404) {
      console.log(`  ↩  Not found (already deleted?): ${id}`)
      skipped++
      continue
    }

    const data = await response.json() as CloudflareDeleteResponse

    if (data.success) {
      console.log(`  ✓  Deleted: ${id}`)
      deleted++
    } else {
      const msg = data.errors?.[0]?.message ?? `HTTP ${response.status}`
      console.error(`  ✗  ${id} — ${msg}`)
      failed++
    }
  }

  console.log(`\n✅  Done — ${deleted} deleted, ${skipped} not found, ${failed} failed`)

  // Reset the generated file to empty arrays so the repo stays consistent
  const emptyContent = [
    '// ⚠️  AUTO-GENERATED — do not edit by hand.',
    '// Run `pnpm seed:upload-images` to regenerate this file.',
    '',
    'export const houseImages: string[] = []',
    '',
    'export const gardenImages: string[] = []',
    '',
    'export const bedroomImages: string[] = []',
    '',
    'export const homeofficeImages: string[] = []',
    '',
    'export const kitchenImages: string[] = []',
    '',
    'export const diningroomImages: string[] = []',
    '',
    'export const livingroomImages: string[] = []',
    '',
    'export const bathroomImages: string[] = []',
    '',
    'export const garageImages: string[] = []',
    '',
  ].join('\n')

  await writeFile(GENERATED_FILE, emptyContent, 'utf-8')
  console.log('📝 Reset: layers/seed/server/utils/images-to-seed.generated.ts')
}

main().catch(err => {
  console.error('❌  Unexpected error:', err)
  process.exit(1)
})
