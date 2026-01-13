import { isNonEmptyURL } from 'ufo'
import { resolve } from 'pathe'

/**
 *  Check that a changed file is within a watched directory
 *
 */
export function checkIsWatched(file: string, watchedDirs: string[]) {
  // If watched file is not a valid string, it can't be watched
  if (!isNonEmptyURL(file)) return false

  // Resolve changed file
  file = resolve(file)

  // Ensure watched dirs is an array
  if (!Array.isArray(watchedDirs)) {
    watchedDirs = [watchedDirs]
  }

  // Check if changed file is being watched
  return watchedDirs.some(dir => file.startsWith(dir))
}