import * as z from "zod";
import { getSaleListingsByDistance, getRentalListingsByDistance } from "../../utils/listing";

const LISTING_FETCHERS = {
  rent: getRentalListingsByDistance,
  buy: getSaleListingsByDistance,
};

const searchSchema = z.object({
  buyOrRent: z.enum(["rent", "buy"]),
  radius: z.coerce.number().min(0).max(100),
  propertyTypes: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { buyOrRent, radius, propertyTypes } = await readValidatedBody(event, searchSchema.parse);

    if (radius === undefined || !buyOrRent) {
      throw createError({ statusCode: 400, statusMessage: "Missing required fields: radius or buyOrRent" });
    }

    const fakeAddressId = 2; // TODO: Replace with actual address ID when available

    const searchLocation = await getLocationByAddressId(fakeAddressId);

    if (!location) {
      throw createError({ statusCode: 404, statusMessage: "Address not found" });
    }

    const fetchListings = LISTING_FETCHERS[buyOrRent];

    if (!fetchListings) {
      throw createError({ statusCode: 400, statusMessage: `Unsupported listing type: ${buyOrRent}` });
    }
    const listings = await fetchListings(searchLocation, radius, propertyTypes);

    return listings;
  } catch (error) {
    errorResponse(error, event);
  }
});
