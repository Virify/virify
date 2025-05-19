import * as z from "zod";
import type { ListingSearchOptional } from "~~/shared/types/listing";
import { calculateDateFromDays } from "~~/shared/utils/format-date";
import { convertToValidEnum } from "~~/shared/utils/enums";
import { mapFeatureToFilters } from "../../utils/db-fields";
import { getListingsByPolygon } from "../../utils/polygon-search";

// Define schema for the request body
const searchSchema = z.object({
  buyOrRent: z.enum(["rent", "buy"]),
  polygons: z.array(z.object({
    type: z.string(),
    geometry: z.object({
      type: z.string(),
      coordinates: z.any().array(),
    }),
    properties: z.record(z.any()).optional(),
    id: z.union([z.string(), z.number()]).optional(),
  })),
  propertyTypes: z.record(z.coerce.string(), z.array(z.coerce.number())).optional(),
  priceRange: z.array(z.coerce.number()).optional(),
  bedrooms: z.array(z.coerce.number()).optional(),
  bathrooms: z.array(z.coerce.number()).optional(),
  addedToSite: z.enum(["0", "1", "3", "7", "14"]).optional(),
  availabilityOptions: z.string().optional(),
  featured: z.array(z.object({ key: z.string(), group: z.enum(["parking", "additionalFeatures", "accessibilityFeatures", "outdoorSpace"]) })).optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

/**
 * Fetches listings within the provided polygon(s).
 *
 * @param event The event object containing the request data.
 * @returns A promise that resolves to the listings data.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { 
      buyOrRent, 
      polygons, 
      propertyTypes, 
      priceRange, 
      bedrooms, 
      bathrooms, 
      addedToSite, 
      availabilityOptions, 
      featured, 
      page, 
      pageSize 
    } = await readValidatedBody(event, searchSchema.parse);

    // Map featured filters to Prisma query format
    const mappedFeatured = mapFeatureToFilters(featured);

    // Enums are always uppercase and _ instead of space
    const availabilityOptionsToEnum = convertToValidEnum(availabilityOptions);

    // Pagination
    const pagination = caluclatePagination(page, pageSize);

    // Optional filters
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

    // Get listings within the polygon
    const listings = await getListingsByPolygon(buyOrRent, polygons, optional);
    return listings;
  } catch (error) {
    console.error("Error fetching listings by polygon:", error);
    errorResponse(error, event);
  }
});

/**
 * Helper function to calculate pagination parameters
 */
function caluclatePagination(page?: number, pageSize?: number) {
  if (!page || !pageSize) return;

  const skip = (page - 1) * pageSize;
  return { skip, take: pageSize };
}
