import * as z from "zod";
import { AISearchResponse } from "~~/shared/types/ai";

const searchTypeSchema = z.object({
  type: z.enum(["traditional", "ai"]).default("traditional"),
});

export default defineEventHandler(async (event) => {
  try {
    const { type } = await readValidatedBody(event, searchTypeSchema.parse);

    if (type === "traditional") {
      const body = await readValidatedBody(
        event,
        traditionalSearchSchema.parse,
      );
      const lat = body.location?.geometry?.coordinates?.[1];
      const lon = body.location?.geometry?.coordinates?.[0];
      const boundaryPolygon = body.location?.boundaryPolygon;
      const bbox = body.location?.bbox;

      let locationPropertyIds: number[] | null = null;

      if (lat && lon) {
        const { propertyIds } = await handleLocationFilter(
          lat,
          lon,
          body.radius,
          bbox,
          boundaryPolygon,
        );
        locationPropertyIds = propertyIds;
      }

      const params: TraditionalSearchParams = {
        isSale: body.isSale,
        price: body.price,
        minBedrooms: body.minBedrooms,
        minBathrooms: body.minBathrooms,
        maxBathrooms: body.maxBathrooms,
        additionalFeatures: body.additionalFeatures,
        propertyTypes: body.propertyTypes,
        minSize: body.minSize,
        maxSize: body.maxSize,
        sizeUnit: body.sizeUnit,
        saleIncludes: body.saleIncludes,
        rentIncludes: body.rentIncludes,
      };

      const orderBy = buildListingOrderBy(body.sortBy);
      return fetchTraditionalSearchListings(
        params,
        locationPropertyIds,
        orderBy,
      );
    } else {
      checkAiConfiguration();

      const { listingType, query, location, radius, page, limit, sortBy } =
        await readValidatedBody(event, ragSearchSchema.parse);

      // Extract location data from the full location object
      const lat = location?.geometry?.coordinates?.[1];
      const lon = location?.geometry?.coordinates?.[0];
      const boundaryPolygon = location?.boundaryPolygon;
      const bbox = location?.bbox;

      const { propertyIds, locationContext } = await handleLocationFilter(
        lat,
        lon,
        radius,
        bbox as [number, number, number, number] | undefined,
        boundaryPolygon,
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

      // If propertyIds is an empty array, no properties were found, so we can return early.
      if (Array.isArray(propertyIds) && propertyIds.length === 0) {
        return {
          results: [],
          query,
          effectiveListingType,
          generatedWhereClause: whereClause,
          queryAnalysis,
          locationContext,
          count: 0,
          searchType: "rag_sql",
          totalPages: 0,
          currentPage: page,
          totalResults: 0,
        } as AISearchResponse;
      }

      // Fetch listings with or without pagination
      const shouldPaginate = page && limit;
      const orderBy = buildListingOrderBy(sortBy);
      const listings = shouldPaginate
        ? await fetchPaginatedListingsForCard(whereClause, page, limit, orderBy)
        : await fetchListingsForCard(whereClause, orderBy);

      const totalCount = listings.length;

      return {
        results: listings,
        query,
        effectiveListingType,
        generatedWhereClause: whereClause,
        queryAnalysis,
        locationContext,
        count: totalCount,
        searchType: "rag_sql",
        currentPage: page,
        totalPages: shouldPaginate ? Math.ceil(totalCount / limit) : 1,
        totalResults: totalCount,
      } as AISearchResponse;
    }
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
});
