import * as z from "zod";

// Schema for validating the request body
const ragSearchSchema = z.object({
  query: z.string().min(1, "Query is required"),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  radius: z.coerce.number().optional().default(40),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});

export default defineEventHandler(async (event) => {
  try {
    checkAiConfiguration();

    const { query, lat, lon, radius, page, limit } = await readValidatedBody(event, ragSearchSchema.parse);

    const { propertyIds, locationContext } = await handleLocationFilter(lat, lon, radius);

    const { whereClause, queryAnalysis } = await constructPrismaWhereClause(query, propertyIds);

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
      ? await fetchPaginatedListings(whereClause, page, limit)
      : await fetchListings(whereClause);

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
  }
});
