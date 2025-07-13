/**
 * Map calculation utilities for zoom levels, distances, and coordinate transformations
 */

/**
 * Calculate zoom level based on search radius (in miles)
 * Ensures the radius circle fits within the viewport with some padding
 *
 * @param radius The search radius in miles
 * @returns The appropriate zoom level
 */
export function calculateZoomLevelFromRadius(radius?: number | null): number {
  if (!radius) return 10;
  const radiusNum = Number(radius);

  switch (true) {
    case radiusNum === 0:
      return 16;
    case radiusNum <= 0.25:
      return 15;
    case radiusNum <= 0.5:
      return 14;
    case radiusNum <= 1:
      return 13;
    case radiusNum <= 2:
      return 12.5;
    case radiusNum <= 3:
      return 12;
    case radiusNum <= 5:
      return 11;
    case radiusNum <= 10:
      return 10;
    case radiusNum <= 20:
      return 9;
    case radiusNum <= 30:
      return 8;
    case radiusNum <= 40:
      return 8;
    default:
      return 8;
  }
}

/**
 * Calculate zoom level to fit a bounding box
 * 
 * @param bbox Bounding box [west, south, east, north]
 * @param padding Optional padding factor (default: 1.2 for 20% padding)
 * @returns Appropriate zoom level
 */
export function calculateZoomFromBbox(bbox: [number, number, number, number], padding: number = 1.2): number {
  const [west, south, east, north] = bbox;
  const latDiff = Math.abs(north - south) * padding;
  const lonDiff = Math.abs(east - west) * padding;
  const maxDiff = Math.max(latDiff, lonDiff);
  
  // Calculate zoom based on bbox size
  if (maxDiff < 0.01) return 15; // Very small area
  if (maxDiff < 0.05) return 13; // Small area  
  if (maxDiff < 0.1) return 12;  // Medium area
  if (maxDiff < 0.5) return 10;  // Large area
  return 8; // Very large area
}

/**
 * Convert miles to meters
 * 
 * @param miles Distance in miles
 * @returns Distance in meters
 */
export function milesToMeters(miles: number): number {
  return miles * 1609.34;
}

/**
 * Convert meters to miles
 * 
 * @param meters Distance in meters
 * @returns Distance in miles
 */
export function metersToMiles(meters: number): number {
  return meters / 1609.34;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * 
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in miles
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the center point of a bounding box
 * 
 * @param bbox Bounding box [west, south, east, north]
 * @returns Center coordinates [longitude, latitude]
 */
export function getBboxCenter(bbox: [number, number, number, number]): [number, number] {
  const [west, south, east, north] = bbox;
  return [(west + east) / 2, (south + north) / 2];
}