#!/usr/bin/env tsx
/**
 * Upload seed images to Cloudflare Images and regenerate images-to-seed.ts
 *
 * Usage:
 *   pnpm seed:upload-images          — upload new, reuse existing, update file
 *   pnpm seed:upload-images --dry-run — preview what would be uploaded, no changes
 *
 * Idempotent: each image is assigned a stable ID (seed-{folder}-{n}).
 * Re-running skips already-uploaded images and keeps their existing IDs.
 *
 * Requires in .env:
 *   CF_ACCOUNT_ID
 *   CF_IMAGES_API_KEY
 */

import { config } from 'dotenv'
config()

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, extname, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ─── Config ──────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))

const IMAGES_DIR = resolve(__dirname, '../../images')
const OUTPUT_FILE = resolve(__dirname, 'images-to-seed.generated.ts')

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID
const CF_IMAGES_API_KEY = process.env.CF_IMAGES_API_KEY

// Maps folder name → variable name + room key used in getAllImagesByRoom()
const FOLDER_MAP: Record<string, { varName: string; roomKey: string }> = {
  'main-home':   { varName: 'houseImages',     roomKey: 'house' },
  'garden':      { varName: 'gardenImages',     roomKey: 'garden' },
  'bedroom':     { varName: 'bedroomImages',    roomKey: 'bedroom' },
  'home-office': { varName: 'homeofficeImages', roomKey: 'homeoffice' },
  'kitchen':     { varName: 'kitchenImages',    roomKey: 'kitchen' },
  'dining-room': { varName: 'diningroomImages', roomKey: 'diningroom' },
  'living-room': { varName: 'livingroomImages', roomKey: 'livingroom' },
  'bathroom':    { varName: 'bathroomImages',   roomKey: 'bathroom' },
  'garage':      { varName: 'garageImages',     roomKey: 'garage' },
}

// Process in this order so the generated file matches the original structure
const FOLDER_ORDER = [
  'main-home', 'garden', 'bedroom', 'home-office', 'kitchen',
  'dining-room', 'living-room', 'bathroom', 'garage',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  }
  return map[ext.toLowerCase()] ?? 'application/octet-stream'
}

type CloudflareResponse = {
  success: boolean
  result?: { id: string }
  errors?: Array<{ message: string }>
}

type UploadResult =
  | { status: 'uploaded'; id: string }
  | { status: 'existing'; id: string }
  | { status: 'failed' }

async function uploadImage(filePath: string, stableId: string): Promise<UploadResult> {
  const buffer = await readFile(filePath)
  const ext = extname(filePath)
  const blob = new Blob([buffer], { type: getMimeType(ext) })

  const form = new FormData()
  form.append('file', blob, `${stableId}${ext}`)
  form.append('id', stableId)

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${CF_IMAGES_API_KEY}` },
      body: form,
    }
  )

  const data = await response.json() as CloudflareResponse

  if (data.success && data.result) {
    return { status: 'uploaded', id: data.result.id }
  }

  const errorMsg = data.errors?.[0]?.message ?? ''

  // Cloudflare returns an error when the custom ID already exists
  if (
    response.status === 409 ||
    errorMsg.toLowerCase().includes('already exist') ||
    errorMsg.includes('9422')
  ) {
    return { status: 'existing', id: stableId }
  }

  console.error(`  ✗  Failed: ${errorMsg || `HTTP ${response.status}`}`)
  return { status: 'failed' }
}

function generateFileContent(
  roomData: Array<{ folder: string; varName: string; roomKey: string; ids: string[] }>
): string {
  const arrays = roomData.map(({ varName, ids }) => {
    const entries = ids.map(id => `  '${id}'`).join(',\n')
    return `export const ${varName} = [\n${entries}\n]`
  })

  return `// ⚠️  AUTO-GENERATED — do not edit by hand.\n// Run \`pnpm seed:upload-images\` to regenerate this file.\n\n${arrays.join('\n\n')}\n`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  if (!CF_ACCOUNT_ID || !CF_IMAGES_API_KEY) {
    console.error('❌  Missing CF_ACCOUNT_ID or CF_IMAGES_API_KEY in environment')
    process.exit(1)
  }

  if (dryRun) {
    console.log('🔍 Dry run — no uploads or file changes will be made\n')
  }

  console.log('📁 Scanning seed images...\n')

  const roomData: Array<{ folder: string; varName: string; roomKey: string; ids: string[] }> = []

  for (const folder of FOLDER_ORDER) {
    const mapping = FOLDER_MAP[folder]
    if (!mapping) continue

    const folderPath = join(IMAGES_DIR, folder)

    let files: string[]
    try {
      files = (await readdir(folderPath))
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort()
    } catch {
      console.warn(`⚠  Folder not found: ${folder} — skipping`)
      continue
    }

    console.log(`📷 ${folder}/ (${files.length} image${files.length !== 1 ? 's' : ''})`)

    const ids: string[] = []

    for (let i = 0; i < files.length; i++) {
      const stableId = `seed-${folder}-${i + 1}`

      if (dryRun) {
        console.log(`   [dry-run] ${files[i]} → ${stableId}`)
        ids.push(stableId)
        continue
      }

      const result = await uploadImage(join(folderPath, files[i]), stableId)
      if (result.status === 'uploaded') {
        console.log(`   ✓  ${files[i]} → ${result.id}`)
        ids.push(result.id)
      } else if (result.status === 'existing') {
        console.log(`   ↩  ${files[i]} — already exists (${result.id})`)
        ids.push(result.id)
      } else {
        console.error(`   ✗  ${files[i]} — upload failed, skipping`)
      }
    }

    roomData.push({ folder, ...mapping, ids })
  }

  const totalImages = roomData.reduce((sum, r) => sum + r.ids.length, 0)
  console.log(`\n✅ ${totalImages} image IDs collected across ${roomData.length} rooms\n`)

  if (dryRun) {
    console.log('🔍 Dry run complete — images-to-seed.ts was not modified')
    return
  }

  const fileContent = generateFileContent(roomData)
  await writeFile(OUTPUT_FILE, fileContent, 'utf-8')
  console.log(`📝 Updated: layers/seed/server/utils/images-to-seed.generated.ts`)
}

main().catch(err => {
  console.error('❌ Unexpected error:', err)
  process.exit(1)
})
