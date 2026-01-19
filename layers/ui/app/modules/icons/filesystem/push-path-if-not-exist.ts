import { consola } from 'consola'
import { getFileName } from './get-file-name'

/**
 *  Add a path to a pathlist, if the path does not already exist
 *
 */
export function pushPathIfNotExist(pathList: string[], path: string) {
  // Ensure paths is an array
  if (!Array.isArray(pathList)) pathList = []

  // Get name of new path, existing pathList
  const pathName = getFileName(path)
  const pathListNames = pathList.map(getFileName)

  // If newPath already exists in the array, do not add it
  if (pathListNames.includes(pathName)) {
    consola.warn(`While generating SVG sprites duplicate file name were found for '${pathName}.svg' - all duplicates are being ignored`)

    return pathList
  }

  // Otherwise return the array with new paths added
  return [...pathList, path]
}