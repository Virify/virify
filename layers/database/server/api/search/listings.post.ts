import * as z from "zod";
import { getSaleListingsByDistance, getRentalListingsByDistance } from "../../utils/listing";
import type { ListingSearch, ListingSearchOptional } from "~~/shared/types/listing";

const LISTING_FETCHERS = {
  rent: getRentalListingsByDistance,
  buy: getSaleListingsByDistance,
};

const searchSchema = z.object({
  buyOrRent: z.enum(["rent", "buy"]),
  radius: z.coerce.number().min(0).max(100),
  propertyTypes: z.array(z.string()).optional(),
  priceRange: z.array(z.coerce.number()).optional(),
  location: z.string(),
  bedrooms: z.array(z.coerce.number()).optional(),
  bathrooms: z.array(z.coerce.number()).optional(),
  addedToSite: z.coerce.number().optional(),
  include: z.string().optional(),
  featured: z.array(z.object({ key: z.string(), group: z.string() })).optional(),
});

/**
 * Fetches listings based on search parameters.
 * 
 * @param event The event object containing the request data.
 * @returns A promise that resolves to the listings data.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { buyOrRent, radius, propertyTypes, priceRange, location, bedrooms, bathrooms, addedToSite, include, featured } = await readValidatedBody(event, searchSchema.parse);
    console.log("Search parameters:", { buyOrRent, radius, propertyTypes, priceRange, location, bedrooms, bathrooms, addedToSite, include, featured });
    
    validateQueries(radius, buyOrRent, location);

    const fetchListings = LISTING_FETCHERS[buyOrRent];
    

    if (!fetchListings) {
      throw createError({ statusCode: 400, statusMessage: `Unsupported listing type: ${buyOrRent}` });
    }

    const listingSearch: ListingSearch = {
      location,
      radius,
    };

    const optional: ListingSearchOptional = {
      bedrooms,
      bathrooms,
      propertyTypes,
      priceRange,
    };

    // we won't need the location when we integrate with mapbox - we just get coords - reduces a read of the database
    const listings = await fetchListings(listingSearch, optional);

    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    errorResponse(error, event);
  }
});

/**
 * Validates the search queries.
 * 
 * @param radius number | undefined
 * @param buyOrRent string
 * @param location string
 */
function validateQueries(radius: number | undefined, buyOrRent: string, location: string): void {
  if (radius === undefined || !buyOrRent || !location) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields: radius, buy or rent or location" });
  }

}
