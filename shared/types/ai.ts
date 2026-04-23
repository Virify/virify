import type { ListingCardType } from "./listing";

export type QueryAnalysis = {
  usedTerms: string[];
  ignoredTerms: string[];
};

export type AISearchResponse = {
  results: ListingCardType[];
  query: string;
  effectiveListingType: "sale" | "rent" | "all";
  generatedWhereClause: any;
  queryAnalysis: QueryAnalysis | null;
  locationContext: any;
  count: number;
  searchType: string;
  totalPages: number;
  currentPage: number;
  totalResults: number;
};
