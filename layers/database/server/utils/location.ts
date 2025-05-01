/**
 * Retuns the location of a given addressId
 * 
 * @param addressId Number
 * @returns Latitude and Longitude of the address
 */
export async function getLocationByAddressId(addressId:number) {
  const result = await prisma.$queryRawUnsafe<{ lat: number; lon: number }[]>(
    `
    SELECT ST_Y(location) as lat, ST_X(location) as lon
    FROM "Address"
    WHERE id = $1
    `,
    addressId
  );

  return result[0]
}

/**
 * Creates a location from a given addressId and longitude and latitude
 * 
 * @param addressId Nunber
 * @param longitude Number
 * @param latitude Number
 * @returns 
 */
export async function updateLocationByAddressId(addressId:number, long:number, lat:number) {
  return await prisma.$executeRawUnsafe(
    `
    UPDATE "Address"
    SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
    WHERE id = $3
    `,
    ...[long, lat, addressId]
  );
}