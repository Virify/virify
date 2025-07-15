/**
 * Find a MapInstance by its map object
 *
 * @param map The map object to find
 * @param mapCache The map cache
 * @returns The MapInstance or undefined if not found
 */
export function findMapInstance(map: ExtendedMapTilerMap, mapCache: Map<string, MapInstance>): MapInstance | undefined {
  for (const [_, instance] of mapCache) {
    if (instance.map === map) {
      return instance;
    }
  }
  return undefined;
}