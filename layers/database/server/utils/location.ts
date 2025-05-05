import { Prisma } from "@prisma/client";
import type { AddressLocation } from "~~/shared/types/location";

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
export async function updateLocationsByAddressList(
  locations: { id: number; lat: number; lon: number }[]
) {
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
export async function getPropertyIdsByDistance(lat: number, lon: number, distanceMiles: number): Promise<{ propertyId: number }[]> {
  const meters = convertMilesToMeters(distanceMiles);
  const nearbyProperties = await prisma.$queryRaw<{ propertyId: number }[]>(
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

  return nearbyProperties;
}

/**
 * Get Nearby Property IDs by Latitude and Longitude with a distance threshold.
 * 
 * @param lat latitude number
 * @param lon longitude number
 * @param distanceMiles number
 * @returns number
 */
export async function getNearbyPropertyIds(
  lat: number,
  lon: number,
  radius: number
): Promise<{ propertyId: number }[]> {
  const meters = convertMilesToMeters(radius);

  return await prisma.$queryRaw<{ propertyId: number }[]>(
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
 * Get Nearby Properties by Latitude and Longitude with a distance threshold.
 * Filters by property types as well.
 *
 * @param lat Latitude of the location
 * @param lon Longitude of the location
 * @param distanceMiles Distance in miles for proximity filtering
 * @param propertyTypes Array of property types to filter (e.g., ['House', 'Cottage'])
 * @returns List of nearby propertyID's
 */
export async function getPropertyIdsByDistanceAndTypes(
  lat: number,
  lon: number,
  distanceMiles: number,
  propertyTypes: string[] // e.g., ['House', 'Cottage']
): Promise<{ propertyId: number }[]> {
  const meters = convertMilesToMeters(distanceMiles);

  // Return properties filtered by distance and property type
  const nearbyProperties = await prisma.$queryRaw<{ propertyId: number }[]>(
    Prisma.sql`
      SELECT p.id as "propertyId"
      FROM "Property" p
      JOIN "Address" a ON p."addressId" = a.id
      JOIN "PropertyType" pt ON pt.id = p."propertyTypeId"  -- Join PropertyType table
      WHERE ST_DWithin(
        ST_Transform(a.location, 3857),
        ST_Transform(ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), 3857),
        ${meters}
      )
      AND pt.name IN (${Prisma.join(propertyTypes)})  -- Filter by property type
    `
  );

  return nearbyProperties;
}

