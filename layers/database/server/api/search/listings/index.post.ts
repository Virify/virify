import * as z from "zod";
import type { ListingSearch, ListingSearchOptional } from "~~/shared/types/listing";
import { calculateDateFromDays } from "~~/shared/utils/format-date";
import { convertToValidEnum } from "~~/shared/utils/enums";

const searchSchema = z.object({
  buyOrRent: z.enum(["rent", "buy"]),
  radius: z.coerce.number().min(0).max(40).optional(),
  propertyTypes: z.record(z.coerce.string(), z.array(z.coerce.number())).optional(),
  priceRange: z.array(z.coerce.number()).optional(),
  location: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
  geometries: z
    .array(z.object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.array(z.number()))),
    }))
    .optional(),
  bedrooms: z.array(z.coerce.number()).optional(),
  bathrooms: z.array(z.coerce.number()).optional(),
  addedToSite: z.enum(["0", "1", "3", "7", "14"]).optional(),
  availabilityOptions: z.string().optional(),
  featured: z.array(z.object({ key: z.string(), group: z.enum(["parking", "additionalFeatures", "accessibilityFeatures", "outdoorSpace"]) })).optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
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
    const { buyOrRent, radius, coordinates, geometries, propertyTypes, priceRange, bedrooms, bathrooms, addedToSite, availabilityOptions, featured, page, pageSize } = await readValidatedBody(event, searchSchema.parse);

    /**
     * Required for search
     */
    const listingSearch: ListingSearch = {
      coordinates,
      geometries,
      radius: radius || undefined,
      type: buyOrRent,
    };

    /**
     * Pagination
     */
    const pagination = caluclatePagination(page, pageSize);

    /**
     * Map featured filters to Prisma query format
     */
    const mappedFeatured = mapFeatureToFilters(featured);

    /**
     * Enums are always uppercase and _ instead of space
     */
    const availabilityOptionsToEnum = convertToValidEnum(availabilityOptions);

    /**
     * optional filters
     */
    const optional: ListingSearchOptional = {
      bedrooms: bedrooms && bedrooms[0] === 0 && bedrooms[1] === 0 ? undefined : bedrooms,
      bathrooms: bathrooms && bathrooms[0] === 0 && bathrooms[1] === 0 ? undefined : bathrooms,
      propertyTypes,
      priceRange,
      addedToSite: addedToSite && addedToSite !== "0" ? calculateDateFromDays(addedToSite) : undefined,
      availabilityOptions: availabilityOptionsToEnum,
      featured: mappedFeatured,
      skip: pagination?.skip,
      take: pagination?.take,
    };

    const listings = await getListingByDistanceAndFilters(listingSearch, optional);

    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    errorResponse(error, event);
  }
});
