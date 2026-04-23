import type * as z from "zod";

type AiBody = z.infer<typeof ragSearchSchema>;

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, ragSearchSchema.parse);
  return aiSearch(body);
});

async function aiSearch(body: AiBody) {
  checkAiConfiguration();

  const locationData = extractLocationForfiltering(body.location, body.radius);

  const { propertyIds, locationContext } = await handleLocationFilter(
    locationData.lat,
    locationData.lon,
    locationData.radius,
    locationData.bbox,
    locationData.boundaryPolygon,
  );

  const { whereClause, queryAnalysis } = await constructPrismaWhereClause(
    body.listingType,
    body.query,
    propertyIds,
  );

  const effectiveListingType: "sale" | "rent" | "all" = whereClause.saleListing
    ? "sale"
    : whereClause.rentalListing
      ? "rent"
      : "all";

  const baseResponse = {
    query: body.query,
    effectiveListingType,
    generatedWhereClause: whereClause,
    queryAnalysis,
    locationContext,
    searchType: "rag_sql" as const,
  };

  // No properties found in the given area — skip the DB query entirely
  if (Array.isArray(propertyIds) && propertyIds.length === 0) {
    return buildAISearchResponse({
      ...baseResponse,
      results: [],
      count: 0,
      totalPages: 0,
      currentPage: 0,
      totalResults: 0,
    });
  }

  const orderBy = buildListingOrderBy(body.sortBy);
  const shouldPaginate = body.page != null && body.limit != null;

  const listings = shouldPaginate
    ? await fetchPaginatedListingsForCard(
        whereClause,
        body.page!,
        body.limit!,
        orderBy,
      )
    : await fetchListingsForCard(whereClause, orderBy);

  const totalCount = listings.length;

  const response = buildAISearchResponse({
    ...baseResponse,
    results: listings,
    count: totalCount,
    currentPage: body.page ?? 1,
    totalPages: shouldPaginate ? Math.ceil(totalCount / body.limit!) : 1,
    totalResults: totalCount,
  });

  // When a hash is already provided by the client, skip storing a new one
  if (body.hash) {
    return response;
  }

  // Store the original body so the hash endpoint can replay it directly.
  const hashKey = await storeSearchHash(body, {
    query: body.query,
    locationData,
    orderBy,
  });

  return { ...response, hashKey };
}
