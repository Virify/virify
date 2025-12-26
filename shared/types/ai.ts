import type { ListingWithFullProperty } from "./listing";

export type QueryAnalysis = {
  usedTerms: string[];
  ignoredTerms: string[];
};

export type AISearchResponse = {
  results: ListingWithFullProperty[];
  query: string;
  generatedWhereClause: any;
  queryAnalysis: QueryAnalysis | null;
  locationContext: any;
  count: number;
  searchType: string;
  totalPages: number;
  currentPage: number;
  totalResults: number;
};
