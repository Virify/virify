import { getPropertyIdsByDistance } from "../../../utils/location";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const addressId = Number(query.addressId);
  const distanceMiles = Number(query.distanceMiles);

  try {
    if (!addressId || !distanceMiles) {
      throw createError({ statusCode: 400, statusMessage: "Missing addressId or distanceMiles" });
    }

    // Get location coordinates from Address
    const location = await getLocationByAddressId(addressId);
    console.log("Location:", location);

    if (!location) throw createError({ statusCode: 404, statusMessage: "Address not found" });

    const { lat, lon } = location;

    const nearbyProperties = await getPropertyIdsByDistance(lat, lon, distanceMiles);
    const listings = await getSaleListingsByPropertyIds(nearbyProperties.map((p) => p.propertyId));

    return {
      count: listings.length,
      distance: distanceMiles,
      listings,
    };
  } catch (error) {
    console.log("Error in distance-by-id.ts:", error);
    throw error;
  }
});
