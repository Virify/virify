import * as z from "zod";
import type { ListingSearch, ListingSearchOptional } from "~~/shared/types/listing";
import { calculateDateFromDays } from "~~/shared/utils/format-date";
import { convertToValidEnum } from "~~/shared/utils/enums";

const searchSchema = z.object({
  buyOrRent: z.enum(["rent", "buy"]),
  radius: z.coerce.number().min(0).max(40),
  propertyTypes: z.array(z.string()).optional(),
  priceRange: z.array(z.coerce.number()).optional(),
  location: z.string(),
  bedrooms: z.array(z.coerce.number()).optional(),
  bathrooms: z.array(z.coerce.number()).optional(),
  addedToSite: z.coerce.number().optional(),
  availabilityOptions: z.string().optional(),
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
    const { buyOrRent, radius, propertyTypes, priceRange, location, bedrooms, bathrooms, addedToSite, availabilityOptions, featured } = await readValidatedBody(event, searchSchema.parse);

    console.log("Search Params: ", {
      buyOrRent,
      radius,
      propertyTypes,
      priceRange,
      location,
      bedrooms,
      bathrooms,
      addedToSite,
      availabilityOptions,
      featured,
    });

    validateQueries(radius, buyOrRent, location);

    /**
     * Required for search
     */
    const listingSearch: ListingSearch = {
      location,
      radius,
      type: buyOrRent,
    };

    /**
     * Enums are always uppercase and _ instead of space
     */
    const availabilityOptionsToEnum = convertToValidEnum(availabilityOptions);

    // TODO: Add include and popular filters
    const optional: ListingSearchOptional = {
      bedrooms: bedrooms && bedrooms[0] === 0 && bedrooms[1] === 0 ? undefined : bedrooms,
      bathrooms: bathrooms && bathrooms[0] === 0 && bathrooms[1] === 0 ? undefined : bathrooms,
      propertyTypes,
      priceRange,
      addedToSite: addedToSite && addedToSite !== 0 ? calculateDateFromDays(addedToSite) : undefined,
      availabilityOptions: availabilityOptionsToEnum,
    };

    const listings = await getListingByDistanceAndFilters(listingSearch, optional);
  
    return listings
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