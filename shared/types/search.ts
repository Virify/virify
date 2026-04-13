import type { QueryAnalysis } from "./ai";
import type { PropertyTypeWithOptions } from "./property-type";

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
    outdoorSpace?: {
      description?: string | null
      garden?: any[]
      land?: any[]
      totalGardenSize?: number | null
      totalLandSize?: number | null
      separateParcel?: boolean
    }
    energyAndUtilities?: any
    securityFeatures?: any
    storageFeatures?: any
  }
}

export interface TraditionalSearchParams {
  isSale: boolean
  price: [number, number]
  minBedrooms: number
  minBathrooms: number
  maxBathrooms: number
  additionalFeatures: {
    garden: boolean
    garage: boolean
    'off-street-parking': boolean
    pets: boolean
    'disabled-access': boolean
    'ev-charging': boolean
    'full-fibre': boolean
  }
  propertyTypes?: Record<string, string[]>
  minSize?: number | null
  maxSize?: number | null
  sizeUnit?: 'sqmtr' | 'sqft'
  saleIncludes: {
    'sold-stc': boolean
    'chain-free': boolean
    'freehold-only': boolean
  }
  rentIncludes: {
    'let-agreed': boolean
    'short-term-lets': boolean
    'long-term-lets': boolean
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

export type ListingType = 'sale' | 'rent' | 'all';

export interface SearchItemAddress {
  street?: string
  city?: string
  postcode?: string
}

export interface SearchItemSpecs {
  beds?: number
  baths?: number
}

export interface DashboardSearchItem {
  id: string | number
  label?: string
  icon?: string
  image?: string
  itemPrice?: number
  address?: SearchItemAddress
  specs?: SearchItemSpecs
  note?: string
  to?: string
  target?: string
}

interface Props {
  item: DashboardSearchItem;
}