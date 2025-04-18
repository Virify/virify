import { readdirSync, type Dirent } from 'node:fs'
import { join, extname } from 'pathe'
import { pushPathIfNotExist } from '../filesystem/push-path-if-not-exist'

export type FoundSVGs = {
  [key: string]: string[]
}

/**
 *  Build a recursive map of all SVG files and their appropriate key
 * 
 *  @TODO
 *  We can maybe use fs.globSync(...) in the future, but this feature
 *  is still experimental, and we ideally want to recursively set the
 *  key for each nested directory anyway, so doing it manually for
 *  the time being
 * 
 *  Alternatively, there is also readdirSync('...', { recursive }) but
 *  this again doesn't solve the nested key issue very elegantly
 *
 */
export function searchForSVGs(dir: string, svgs: FoundSVGs, key: string) {
  const entries = readdirSync(dir, { withFileTypes: true })

  // Loop through each entry
  entries.forEach((entry: Dirent) => {
    const { path, name } = entry

    // Get full path of entry
    const fullPath = join(path, name)

    // Check if entry is a directory
    if (entry.isDirectory()) {
      return searchForSVGs(fullPath, svgs, `${key}-${name}`)
    }

    // Skip if pathname is not an SVG
    if (extname(fullPath) !== '.svg') return

    // Add SVG to sprites key
    svgs[key] = pushPathIfNotExist(svgs[key], fullPath)
  })
}