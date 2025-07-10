import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * !! This file is only to be used for seeding - because it instantiates a new PrismaClient which does not work in production.
 */

/**
 * Returns the location of a given addressId.
 * PostGIS always returns an array.
 * 
 * @param addressId Number
 * @returns AddressLocation
 */
export async function getLocationByAddressIdForSeed(addressId: number): Promise<AddressLocation> {
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
export async function updateLocationByAddressIdForSeed(addressId: number, long: number, lat: number) {
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
export async function updateLocationsByAddressListForSeed(
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