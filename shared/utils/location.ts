import type { SearchLocation } from "../types/location";

/**
 *
 * @param body
 * @returns
 */
export const extractLocationForfiltering = (
  location: any,
  radius: number,
): SearchLocation => {
  return {
    lat: location?.geometry?.coordinates?.[1],
    lon: location?.geometry?.coordinates?.[0],
    boundaryPolygon: location?.boundaryPolygon,
    bbox: location?.bbox,
    radius: radius,
  };
};
