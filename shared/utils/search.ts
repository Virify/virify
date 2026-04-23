import type { TraditionalSearchParams } from "../types/search";
import type { AISearchResponse } from "~~/shared/types/ai";

export type SortBy =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "date-desc"
  | "date-asc";

/**
 * Maps a sort key to a Prisma-compatible order-by object.
 * Returns undefined for 'relevance' (uses Prisma default ordering).
 */
export function buildListingOrderBy(
  sortBy: SortBy | string,
): { price: "asc" | "desc" } | { publishedAt: "asc" | "desc" } | undefined {
  switch (sortBy) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "date-desc":
      return { publishedAt: "desc" };
    case "date-asc":
      return { publishedAt: "asc" };
    default:
      return undefined;
  }
}

/**
 * Builds Params from Validated Schmea for Tradtional TraditionalSearch
 *
 * @param params TraditionalSearchParams
 * @returns TraditionalSearchParams
 */
export function buildTraditionalParams(params: any): TraditionalSearchParams {
  return {
    isSale: params.isSale,
    price: params.price,
    minBedrooms: params.minBedrooms,
    minBathrooms: params.minBathrooms,
    maxBathrooms: params.maxBathrooms,
    additionalFeatures: params.additionalFeatures,
    propertyTypes: params.propertyTypes,
    minSize: params.minSize,
    maxSize: params.maxSize,
    sizeUnit: params.sizeUnit,
    saleIncludes: params.saleIncludes,
    rentIncludes: params.rentIncludes,
  };
}

export function buildAISearchResponse(
  aiResponse: AISearchResponse,
): AISearchResponse {
  return {
    ...aiResponse,
  };
}
