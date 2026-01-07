import { existsSync } from 'node:fs'
import { consola } from 'consola'
import { isArrayOfUrls } from './is-array-of-urls'

/**
 *  Remove missing directories from a list
 *
 */
export function filterNonExistentDirectories(dirs: string[]): string[] {
  if (!isArrayOfUrls(dirs)) return []

  return dirs.filter(dir => {
    const dirExists = existsSync(dir)

    // Warn about missing directories
    if (!dirExists) {
      consola.warn(`The sprites input directory ${String(dir)} does not exist - this path is being ignored`)
    }

    return dirExists
  })
}