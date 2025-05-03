import { getPropertyIdsByDistance } from "../../utils/location";

export default defineEventHandler(async (event) => {
  const { buyOrRent, radius } = await readBody(event);

  console.log("buyOrRent", buyOrRent);
  console.log("radius", radius);
  const fakeaddressId = 1; // TODO: remove this when we have a real addressId
  try {
    if (!radius) {
      throw createError({ statusCode: 400, statusMessage: "Missing addressId or radius" });
    }

    // Get location coordinates from Address
    const location = await getLocationByAddressId(fakeaddressId);

    if (!location) throw createError({ statusCode: 404, statusMessage: "Address not found" });

    const { lat, lon } = location;

    const nearbyProperties = await getPropertyIdsByDistance(lat, lon, radius);

    if(buyOrRent === "rent") {
      const listings = await getRentalListingsByPropertyIds(nearbyProperties.map((p) => p.propertyId));
      return listings
    }
    if(buyOrRent === "buy") {
      const listings = await getSaleListingsByPropertyIds(nearbyProperties.map((p) => p.propertyId));
      return listings
    }
  } catch (error) {
    throw error;
  }
});
