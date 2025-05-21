import { prisma } from "./prisma-client";
import type { AddressLocation } from "~~/shared/types/location";
import { prepareFullTextSearch } from "./address";
import type { PropertySearchResult } from "~~/shared/types/property";
import { Prisma } from "@prisma/client";
/**
 * Convert meters to miles. For PostGIS, we need to convert meters to miles.
 *
 * @param miles Number
 * @returns Numer
 */
export const convertMilesToMeters = (miles: number): number => {
  return miles * 1609.34;
};

/**
 * Returns the location of a given addressId.
 * PostGIS always returns an array.
 *
 * @param addressId Number
 * @returns AddressLocation
 */
export async function getLocationByAddressId(addressId: number): Promise<AddressLocation> {
  const result = await prisma.$queryRaw<{ lat: number; lon: number }[]>(
    Prisma.sql`
      SELECT ST_Y(location) as lat, ST_X(location) as lon
      FROM "Address"
      WHERE id = ${addressId}
    `
  );

  if (!result[0]) throw createError({ statusCode: 404, statusMessage: "location not found" });

  return result[0];
}

/**
 * Creates a location from a given addressId and longitude and latitude.
 *
 * @param addressId Number
 * @param longitude Number
 * @param latitude Number
 * @returns
 */
export async function updateLocationByAddressId(addressId: number, long: number, lat: number) {
  return await prisma.$executeRaw(
    Prisma.sql`
      UPDATE "Address"
      SET location = ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)
      WHERE id = ${addressId}
    `
  );
}

/**
 * Update multiple locations in a batch.
 *
 * @param locations List of locations with id, lat, and lon
 * @returns
 */
export async function updateLocationsByAddressList(locations: { id: number; lat: number; lon: number }[]) {
  const queries = locations.map((loc) =>
    prisma.$executeRaw(
      Prisma.sql`
        UPDATE "Address"
        SET location = ST_SetSRID(ST_MakePoint(${loc.lon}, ${loc.lat}), 4326)
        WHERE id = ${loc.id}
      `
    )
  );

  return await prisma.$transaction(queries);
}

/**
 * Get Nearby Properties by Latitude and Longitude with a distance threshold.
 *
 * @param lat Latitude of the location
 * @param lon Longitude of the location
 * @param distanceMeters Distance in meters for proximity filtering
 * @returns List of nearby propertyID's
 */
export async function getPropertyIdsByDistance(lat: number, lon: number, distanceMiles: number): Promise<PropertySearchResult> {
  const meters = convertMilesToMeters(distanceMiles);
  return await prisma.$queryRaw<PropertySearchResult>(
    Prisma.sql`
      SELECT p.id as "propertyId"
      FROM "Property" p
      JOIN "Address" a ON p."addressId" = a.id
      WHERE ST_DWithin(
        ST_Transform(a.location, 3857),
        ST_Transform(ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), 3857),
        ${meters}
      )
    `
  );
}

/**
 * Get property IDs within any of the provided bounding boxes.
 *
 * Accepts an array of bboxes, each in [minLon, minLat, maxLon, maxLat] format (WGS84).
 * This uses PostGIS's && (bounding box intersection) operator for fast spatial filtering.
 *
 * @param bboxes Array of bounding boxes: [minLon, minLat, maxLon, maxLat][]
 * @returns List of nearby propertyID's
 */
export async function getPropertyIdsByBoundingBoxes(
  bboxes: BBox
): Promise<PropertySearchResult> {
  if (!bboxes || bboxes.length === 0) return [];

  // Build SQL for multiple envelopes
  const envelopes = bboxes.map((bbox) =>
    `a.location && ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326)`
  );

  // Join with OR for any bbox match
  const whereClause = envelopes.join(' OR ');

  // Use Prisma's $queryRawUnsafe for dynamic SQL
  const query = `
    SELECT p.id as "propertyId"
    FROM "Property" p
    JOIN "Address" a ON p."addressId" = a.id
    WHERE ${whereClause}
  `;

  return await prisma.$queryRawUnsafe(query);
}

/**
 *
 * @param query string
 * @param distanceMeters number
 *
 * @returns propertyId
 */
export async function getNearbyPropertiesByTextQuery(query: string, distanceMiles: number): Promise<PropertySearchResult> {
  const meters = convertMilesToMeters(distanceMiles);
  const sanitizedQuery = prepareFullTextSearch(query);

  return await prisma.$queryRaw<PropertySearchResult>`
  -- Find the most relevant address based on the full-text search query
  WITH matched_address AS (
    SELECT id, location
    FROM "Address"
    WHERE to_tsvector('english', COALESCE(street, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(postcode, ''))
          @@ to_tsquery('english', ${sanitizedQuery})
    ORDER BY ts_rank(
      to_tsvector('english', COALESCE(street, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(postcode, '')),
      to_tsquery('english', ${sanitizedQuery})
    ) DESC
    LIMIT 1
  )

-- Select property IDs and distance from the matched address
  SELECT p.id as "propertyId", 
    ST_Distance(
      ST_Transform(a.location, 3857), 
      ST_Transform(ma.location, 3857)
    ) / 1609.34 AS "distanceMiles"  -- distance in miles
  FROM "Property" p

  -- Join each property to its address (to get its coordinates)
  JOIN "Address" a ON p."addressId" = a.id

  -- Join to the matched address from the CTE (cross join, since it's a single row)
  JOIN matched_address ma ON TRUE

  -- Spatial filter: only include addresses within the distance threshold
  WHERE ST_DWithin(
    ST_Transform(a.location, 3857),
    ST_Transform(ma.location, 3857),
    ${meters}
  )
`;
}
