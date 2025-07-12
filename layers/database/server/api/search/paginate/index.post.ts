import * as z from "zod";

// Schema for pagination-only requests (reuses existing WHERE clause)
const paginateSearchSchema = z.object({
  whereClause: z.any(), // The previously generated WHERE clause
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  query: z.string(), // For response metadata
  queryAnalysis: z.any().optional(), // Pass through existing analysis
  locationContext: z.any().optional(), // Pass through existing context
});

export default defineEventHandler(async (event) => {
  try {
    const { whereClause, page, limit, query, queryAnalysis, locationContext } = await readValidatedBody(event, paginateSearchSchema.parse);

    const { listings, totalCount } = await fetchPaginatedListings(whereClause, page, limit);

    const resultsWithListingType = listings.map((listing) => ({
      ...listing,
      listingType: listing.rentalListing ? "rent" : "buy",
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      results: resultsWithListingType,
      query,
      generatedWhereClause: whereClause,
      queryAnalysis,
      locationContext,
      count: listings.length,
      searchType: "pagination_only",
      totalPages,
      currentPage: page,
      totalResults: totalCount,
    };
  } catch (error: any) {
    console.error("Error performing paginated search:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to paginate search results",
    });
  }
});