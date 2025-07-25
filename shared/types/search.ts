export type SearchParams = {
  location?: string | null;
  radius?: number | string | null;
  buyOrRent?: "buy" | "rent" | string | null;
  propertyTypes?: PropertyTypeWithOptions | null;
  priceRange?: number[] | null;
  bedrooms?: number[] | null;
  bathrooms?: number[] | null;
  addedToSite?: string | FormDataEntryValue | null;
  availabilityOptions?: string | FormDataEntryValue | null;
  featured?: any;
  coordinates?: { lat: number; lon: number } | null;
}

export interface SearchResult {
  id: number
  title: string
  description: string
  price?: number | null
  similarity: number
  listingType: 'rent' | 'buy' | 'unknown'
  publishedAt?: Date | string
  listingTier?: string
  moveInDate?: Date | string | null
  property?: {
    id: number
    numberBedrooms?: number | null
    numberBathrooms?: number | null
    numberReceptions?: number | null
    numberOtherRooms?: number | null
    size?: number | null
    yearBuilt?: string | null
    chainFree?: boolean
    vacant?: boolean
    constructionType?: string | null
    floorLevel?: number | null
    address?: {
      city?: string | null
      county?: string | null
      postcode?: string
      street?: string
      lat?: number | null
      lon?: number | null
    }
    type?: {
      name?: string
    }
    classification?: {
      name?: string
    }
    // All property features for comprehensive AI search
    bedroomFeatures?: any
    bathroomFeatures?: any
    parking?: any
    amenities?: any[]
    additionalFeatures?: any
    accessibilityFeatures?: any
    kitchenFeatures?: any
    reception?: any
    otherRooms?: any
    utility?: any
    outdoorSpace?: any
    energyAndUtilities?: any
    securityFeatures?: any
    storageFeatures?: any
  }
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  count: number
  searchType: string
  generatedConditions?: any  // For RAG search
}

// ai search result
export type aiSearchResult = {
  whereClause: any
  queryAnalysis: QueryAnalysis
}
