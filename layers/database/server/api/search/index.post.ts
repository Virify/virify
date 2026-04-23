import * as z from "zod";
import { hash } from "ohash";

const searchTypeSchema = z.object({
  type: z.enum(["traditional", "ai"]).default("traditional"),
});

export default defineEventHandler(async (event) => {
  const storage = useStorage();
  try {
    const { type } = await readValidatedBody(event, searchTypeSchema.parse);

    if (type === "traditional") {
      const body = await readValidatedBody(
        event,
        traditionalSearchSchema.parse,
      );

      const locationData = extractLocationForfiltering(
        body.location,
        body.radius,
      );

      let locationPropertyIds: number[] | null = null;

      if (locationData.lat && locationData.lon) {
        const { propertyIds } = await handleLocationFilter(
          locationData.lat,
          locationData.lon,
          locationData.radius,
          locationData.bbox,
          locationData.boundaryPolygon,
        );
        locationPropertyIds = propertyIds;
      }

      const params = buildTraditionalParams(body);
      const orderBy = buildListingOrderBy(body.sortBy);

      const results = await fetchTraditionalSearchListings(
        params,
        locationPropertyIds,
        orderBy,
      );

      let hashKey: string | undefined = body.hash;

      if (!body.hash) {
        const response = {
          type,
          params,
          locationData,
          orderBy,
        };

        let hashKey = hash(response);
        const hashValue = JSON.stringify(response);

        await storage.setItem(`search:${hashKey}`, hashValue);
        console.log(
          `Stored search result for hashKey: ${hashKey} ${hashValue}`,
        );
      }

      return {
        results,
        hashKey,
      };
    } else {
      checkAiConfiguration();

      const {
        listingType,
        query,
        location,
        radius,
        page,
        limit,
        sortBy,
        hash,
      } = await readValidatedBody(event, ragSearchSchema.parse);

      const locationData = extractLocationForfiltering(location, radius);

      const { propertyIds, locationContext } = await handleLocationFilter(
        locationData.lat,
        locationData.lon,
        locationData.radius,
        locationData.bbox,
        locationData.boundaryPolygon,
      );

      const { whereClause, queryAnalysis } = await constructPrismaWhereClause(
        listingType,
        query,
        propertyIds,
      );

      // Derive the effective listing type from what the AI put in the where clause
      const effectiveListingType: "sale" | "rent" | "all" =
        whereClause.saleListing
          ? "sale"
          : whereClause.rentalListing
            ? "rent"
            : "all";

      const baseResponse = {
        query,
        effectiveListingType,
        generatedWhereClause: whereClause,
        queryAnalysis,
        locationContext,
        searchType: "rag_sql" as const,
      };

      // If propertyIds is an empty array, no properties were found, so we can return early.
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

      // Fetch listings with or without pagination
      const shouldPaginate = page && limit;
      const orderBy = buildListingOrderBy(sortBy);
      const listings = shouldPaginate
        ? await fetchPaginatedListingsForCard(whereClause, page, limit, orderBy)
        : await fetchListingsForCard(whereClause, orderBy);

      const totalCount = listings.length;

      return buildAISearchResponse({
        ...baseResponse,
        results: listings,
        count: totalCount,
        currentPage: page!,
        totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
        totalResults: totalCount,
      });
    }
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
});
