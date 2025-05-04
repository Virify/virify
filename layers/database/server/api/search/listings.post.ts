import * as z from "zod";

const LISTING_FETCHERS = {
  rent: getRentalListingsByPropertyIds,
  buy: getSaleListingsByPropertyIds,
};

const searchSchema = z.object({
  buyOrRent: z.enum(["rent", "buy"]),
  radius: z.number().min(0).max(100),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { buyOrRent, radius }: { buyOrRent: keyof typeof LISTING_FETCHERS; radius: number } = await readValidatedBody(event, searchSchema.parse);

    const fakeAddressId = 1; // TODO: Replace with actual address ID when available

    // undefined check as 0 is a valid radius
    if (radius === undefined || !buyOrRent) throw createError({ statusCode: 400, statusMessage: "Missing required fields: radius or buyOrRent" });

    const location = await getLocationByAddressId(fakeAddressId);

    if (!location) throw createError({ statusCode: 404, statusMessage: "Address not found" });

    const nearbyProperties = await getPropertyIdsByDistance(location.lat, location.lon, radius);
    const propertyIds = nearbyProperties.map((p) => p.propertyId);

    const fetchListings = LISTING_FETCHERS[buyOrRent];

    if (!fetchListings) throw createError({ statusCode: 400, statusMessage: `Unsupported listing type: ${buyOrRent}` });

    const listings = await fetchListings(propertyIds);

    return listings;
  } catch (error) {
    errorResponse(error, event);
  }
});
