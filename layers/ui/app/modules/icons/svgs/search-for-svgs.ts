import { readdirSync, type Dirent } from 'node:fs'
import { join, extname } from 'pathe'
import { pushPathIfNotExist } from '../filesystem/push-path-if-not-exist'

export type FoundSVGs = {
  [key: string]: string[]
}

/**
 * Build a recursive map of all SVG files and their appropriate key
 */
export function searchForSVGs(dir: string, svgs: FoundSVGs, key: string) {
  // Read the directory using types
  const entries = readdirSync(dir, { withFileTypes: true })

  // Loop through each entry
  entries.forEach((entry: Dirent) => {
    const { name } = entry

    // This guarantees the absolute path chain is never broken across Linux/WSL/Mac
    const fullPath = join(dir, name)

    // Check if entry is a directory
    if (entry.isDirectory()) {
      // Pass the fully qualified fullPath to the recursive call
      return searchForSVGs(fullPath, svgs, `${key}-${name}`)
    }

    // Skip if pathname is not an SVG
    if (extname(fullPath) !== '.svg') return

    // Add SVG to sprites key
    svgs[key] = pushPathIfNotExist(svgs[key] ?? [], fullPath)
  })
}