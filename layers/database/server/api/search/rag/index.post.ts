import * as z from "zod";

// Schema for validating the request body
const ragSearchSchema = z.object({
  listingType: z.enum(['sale', 'rent', 'all']).optional().default('all'),
  query: z.string().min(1, "Query is required"),
  location: z.object({
    geometry: z.object({
      coordinates: z.tuple([z.number(), z.number()])
    }).optional(),
    boundaryPolygon: z.object({
      type: z.enum(['Polygon', 'MultiPolygon']),
      coordinates: z.union([
        z.array(z.array(z.array(z.number()))),
        z.array(z.array(z.array(z.array(z.number()))))
      ])
    }).optional(),
    bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional()
  }).passthrough().optional(),
  radius: z.coerce.number().optional().default(40),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});

export default defineEventHandler(async (event) => {
  try {
    checkAiConfiguration();

    const { listingType, query, location, radius, page, limit } = await readValidatedBody(event, ragSearchSchema.parse);

    // Extract location data from the full location object
    const lat = location?.geometry?.coordinates?.[1];
    const lon = location?.geometry?.coordinates?.[0];
    const boundaryPolygon = location?.boundaryPolygon;
    const bbox = location?.bbox;

    const { propertyIds, locationContext } = await handleLocationFilter(lat, lon, radius, bbox as [number, number, number, number] | undefined, boundaryPolygon);

    const { whereClause, queryAnalysis } = await constructPrismaWhereClause(listingType, query, propertyIds);

    // If propertyIds is an empty array, no properties were found, so we can return early.
    if (Array.isArray(propertyIds) && propertyIds.length === 0) {
      return {
        results: [],
        query,
        generatedWhereClause: whereClause,
        queryAnalysis,
        locationContext,
        count: 0,
        searchType: "rag_sql",
        totalPages: 0,
        currentPage: page,
        totalResults: 0,
      };
    }

    // Fetch listings with or without pagination
    const shouldPaginate = page && limit;
    const listings = shouldPaginate
      ? await fetchPaginatedListingsForCard(whereClause, page, limit)
      : await fetchListingsForCard(whereClause);

    const resultsWithListingType = listings.map((listing) => ({
      ...listing,
      listingType: listing.rentalListing ? "rent" : "buy",
    }));

    const totalCount = resultsWithListingType.length;

    return {
      results: resultsWithListingType,
      query,
      generatedWhereClause: whereClause,
      queryAnalysis,
      locationContext,
      count: listings.length,
      searchType: "rag_sql",
      currentPage: page,
      totalResults: totalCount,
    };
  } catch (error: any) {
    console.error("Error performing RAG search:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to perform AI search",
      message: error.message || "An error occurred during the search"
    });
  }
});
