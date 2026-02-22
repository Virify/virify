/**
 * Shared types for KV-backed search state management
 * Used by both frontend composables and backend API endpoints
 */

import type { QueryAnalysis } from "./ai"
import type { ListingWithFullProperty } from "./listing"
import type { GeocodingFeature } from "./map"
import type { ListingType } from "./search"

/**
 * Map viewport state for preserving user's map interaction
 */
export interface MapViewportState {
  /** Current map zoom level */
  zoom: number

  /** Current map center coordinates [longitude, latitude] */
  center: [number, number]

  /** Current map bounds [west, south, east, north] */
  bounds?: [number, number, number, number]
}

/**
 * Complete search state structure stored in KV storage
 * This represents all the search context for a user session
 */
export interface SearchState {
  /** User's search query text */
  query: string

  /** Type of search being performed (traditional or enhanced/AI) */
  searchType: 'traditional' | 'ai'

  /** Listing type filter */
  listingType: ListingType

  /** Selected location from geocoding service */
  location: GeocodingFeature | null

  /** Search radius in kilometers */
  radius: number

  /** Current sort preference (relevance, price_asc, price_desc, etc.) */
  sortBy: string

  /** Flag indicating if user has performed at least one search */
  hasSearched: boolean

  /** Flag for whether search is being processed  */
  searchPending?: boolean

  /** Cached search results for navigation preservation */
  results: ListingWithFullProperty[] | null

  /** AI analysis result of the search query */
  queryAnalysis: QueryAnalysis | null

  /** Current page in paginated results */
  currentPage: number | null

  /** Total pages available in current search */
  totalPages: number | null

  /** Total number of results found */
  totalResults: number

  /** Preserved database WHERE clause for pagination consistency */
  whereClause: any

  /** Preserved location context for search refinement */
  locationContext: any

  /** User's preferred view mode for results display */
  viewMode: 'grid' | 'map' | 'split'

  /** Map viewport state for preserving zoom, center, and bounds */
  mapViewport?: MapViewportState

  /** Preserved traditional search form data for re-running search */
  traditionalSearchForm?: any
}

/**
 * Default values for search state
 */
export const defaultSearchState: SearchState = {
  searchType: 'ai',
  listingType: 'all',
  searchPending: false,
  query: '',
  location: null,
  radius: 0,
  sortBy: 'relevance',
  hasSearched: false,
  results: null,
  queryAnalysis: null,
  currentPage: null,
  totalPages: null,
  totalResults: 0,
  whereClause: null,
  locationContext: null,
  viewMode: 'grid',
  mapViewport: undefined,
  traditionalSearchForm: null
}

/**
 * API request body for saving search state
 */
export interface SaveSearchStateRequest {
  sessionId: string
  state: SearchState
}

/**
 * API response for search state operations
 */
export interface SearchStateResponse {
  success: boolean
}

/**
 * API request query parameters for getting/deleting search state
 */
export interface SearchStateParams {
  sessionId: string
}