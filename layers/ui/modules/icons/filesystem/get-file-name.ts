import { parse } from 'pathe'

/**
 *  Helper function to get file name from a path
 */
export function getFileName(path: string) {
  const { name } = parse(path)

  return name
}