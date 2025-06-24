<template>
  <div class="| container flow flow-lg">
    <h1 class="| title-md">AI Search Test</h1>

    <div class="| flow">
      <p>Test AI-powered property search using RAG (Retrieval-Augmented Generation) where AI generates exact SQL filters
        for perfect matching.</p>
    </div>

    <h2 class="| title-sm">Search Properties</h2>

    <!-- Search Suggestions -->
    <div class="search-suggestions">
      <h2 class="title-xs">Suggestion searches</h2>
      <div class="suggestions-grid">
        <button v-for="suggestion in allSuggestions" :key="suggestion" @click="selectExampleQuery(suggestion)"
          class="suggestion-item">
          {{ suggestion }}
        </button>
      </div>
    </div>

    <div class="search-container">
      <form @submit.prevent="searchProperties" class="search-form">
        <div class="input-group">
          <input v-model="searchQuery" type="text"
            placeholder="Try: '3 bedroom house in Cardiff', 'detached house near Newport'" class="search-input"
            :disabled="isSearching" />
          <button type="submit" class="search-button" :disabled="isSearching || !searchQuery.trim()">
            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
        </div>

        <!-- Location info -->
        <div class="location-info">
          <p class="location-note">
            <strong>Demo searching Cardiff & Newport properties</strong> - Use location terms in your query (e.g., "in
            Cardiff", "near Newport city centre")
          </p>
        </div>
      </form>
    </div>

    <!-- Applied Filters -->
    <div v-if="appliedFilters.length > 0" class="applied-filters-section">
      <h3 class="filters-title">Applied Filters:</h3>
      <div class="filters-container">
        <div v-for="filter in appliedFilters" :key="filter.key" class="filter-chip">
          <span class="filter-label">{{ filter.label }}</span>
          <span class="filter-value">{{ filter.value }}</span>
          <button @click="removeFilter(filter.key)" class="filter-remove" title="Remove filter">×</button>
        </div>
        <button @click="clearAllFilters" class="clear-all-button" v-if="appliedFilters.length > 1">
          Clear All
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isSearching" class="loading-section">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <h3 class="| title-xs">Searching Properties...</h3>
      <p class="loading-text">AI is analyzing your query and finding matching properties</p>
      <div class="loading-details">
        <span class="loading-query">"{{ searchQuery }}"</span>
      </div>
    </div>

    <div v-else-if="searchResults.length > 0" class="results-section">
      <div class="results-header">
        <h3 class="| title-xs">Search Results ({{ searchResults.length }})</h3>
        <span v-if="detectedListingType" class="detected-type">
          Searching for:
          <span class="type-badge" :class="`type-${detectedListingType}`">
            {{ detectedListingType === 'sale' ? 'Sale Properties' :
              detectedListingType === 'rental' ? 'Rental Properties' :
                'Sale & Rental Properties' }}
          </span>
        </span>
        <span v-if="detectedPriceRange" class="detected-price">
          Price range:
          <span class="price-badge">
            <span v-if="detectedPriceRange.minPrice && detectedPriceRange.maxPrice">
              £{{ detectedPriceRange.minPrice.toLocaleString() }} - £{{ detectedPriceRange.maxPrice.toLocaleString() }}
            </span>
            <span v-else-if="detectedPriceRange.minPrice">
              Over £{{ detectedPriceRange.minPrice.toLocaleString() }}
            </span>
            <span v-else-if="detectedPriceRange.maxPrice">
              Under £{{ detectedPriceRange.maxPrice.toLocaleString() }}
            </span>
          </span>
        </span>
      </div>

      <div class="results-grid">
        <div v-for="result in searchResults" :key="result.id" class="result-card">
          <div class="result-header">
            <h4 class="result-title">{{ result.title }}</h4>
            <span class="similarity-score">{{ Math.round(result.similarity * 100) }}% match</span>
          </div>
          <p class="result-description">{{ result.description }}</p>
          <div class="result-details">
            <span class="price">£{{ result.price?.toLocaleString() }}</span>
            <span v-if="result.property?.numberBedrooms" class="bedrooms">
              {{ result.property.numberBedrooms }} bed
            </span>
            <span v-if="result.property?.numberBathrooms" class="bathrooms">
              {{ result.property.numberBathrooms }} bath
            </span>
            <span v-if="result.property?.address?.city" class="location">
              {{ result.property.address.city }}
            </span>
            <span v-if="result.property?.type?.name" class="property-type">
              {{ result.property.type.name }}
            </span>
            <span class="listing-type" :class="`type-${result.listingType}`">
              {{ result.listingType === 'rent' ? 'Rental' : 'Sale' }}
            </span>
          </div>

          <!-- Property Features -->
          <div v-if="getPropertyFeatures(result).length > 0" class="result-features">
            <h5 class="features-title">Features:</h5>
            <div class="features-list">
              <span v-for="feature in getPropertyFeatures(result)" :key="feature" class="feature-tag">
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="hasSearched && !isSearching" class="no-results">
      <h3 class="| title-xs">No Results Found</h3>
      <p>Sorry, we couldn't find any properties matching your search criteria for <strong>"{{ lastSearchQuery
      }}"</strong>.</p>
      <p class="suggestions">Try:</p>
      <ul class="suggestions-list">
        <li>Removing some specific requirements</li>
        <li>Searching for a different property type</li>
        <li>Expanding your location search area</li>
        <li>Using more general terms</li>
      </ul>
    </div>

    <div v-if="searchError" class="error-message">
      <p>Error: {{ searchError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt composables
const route = useRoute()

// Types
interface SearchResult {
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
    size?: number | null
    yearBuilt?: string | null
    chainFree?: boolean
    vacant?: boolean
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
    diningroomFeatures?: any
    kitchenFeatures?: any
    livingAreaFeatures?: any
    reception?: any
    utility?: any
    additionalToilet?: any
    outdoorSpace?: any
    energyAndUtilities?: any
    securityFeatures?: any
    storageFeatures?: any
  }
}

interface SearchResponse {
  results: SearchResult[]
  query: string
  count: number
  searchType: string
  generatedConditions?: any  // For RAG search
}

// Search functionality
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const isSearching = ref(false)
const hasSearched = ref(false)
const lastSearchQuery = ref('')
const searchError = ref('')
const detectedListingType = ref('')
const detectedPriceRange = ref<{ minPrice?: number, maxPrice?: number } | null>(null)

// Track the last executed search to prevent duplicates
const lastExecutedQuery = ref('')
const isInitialLoad = ref(true)
let searchTimeout: NodeJS.Timeout | null = null

// Check for query parameter on page load and auto-search
onMounted(() => {
  const queryParam = route.query.q as string
  if (queryParam) {
    const decodedQuery = decodeURIComponent(queryParam)
    searchQuery.value = decodedQuery
    lastExecutedQuery.value = decodedQuery
    // Auto-search after a brief delay to ensure the page is fully loaded
    nextTick(() => {
      searchProperties() // Auto-search on page load
    })
  }
  isInitialLoad.value = false
})

// Page metadata that updates based on search query
useHead(() => ({
  title: searchQuery.value
    ? `AI Search: ${searchQuery.value} | Property Search`
    : 'AI Property Search - Smart Property Discovery',
  meta: [
    {
      name: 'description',
      content: searchQuery.value
        ? `AI search results for "${searchQuery.value}" - Advanced property search with intelligent filtering and natural language understanding.`
        : 'Revolutionary AI-powered property search. Use natural language to find your perfect home with intelligent filtering and smart matching.'
    }
  ]
}))

// Watch for route changes (if user navigates with different query)
watch(() => route.query.q, (newQuery) => {
  if (newQuery && typeof newQuery === 'string' && !isInitialLoad.value) {
    const decodedQuery = decodeURIComponent(newQuery)
    // Only search if this is a different query than what we just executed
    if (decodedQuery !== lastExecutedQuery.value) {
      searchQuery.value = decodedQuery
      lastExecutedQuery.value = decodedQuery
      searchProperties()
    }
  }
})

// Cleanup search timeout on component unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

// Applied filters functionality
interface AppliedFilter {
  key: string
  label: string
  value: string
  originalField: string
  originalValue: any
}

const appliedFilters = ref<AppliedFilter[]>([])
const currentWhereClause = ref<any>(null)

// Extract filters from AI-generated where clause
function extractFiltersFromWhereClause(whereClause: any) {
  const filters: AppliedFilter[] = []

  if (!whereClause || !whereClause.property) return filters

  const property = whereClause.property

  // Property type
  if (property.type?.name) {
    filters.push({
      key: 'property-type',
      label: 'Property Type',
      value: property.type.name,
      originalField: 'property.type.name',
      originalValue: property.type.name
    })
  }

  // Classification
  if (property.classification?.name) {
    filters.push({
      key: 'classification',
      label: 'Classification',
      value: property.classification.name,
      originalField: 'property.classification.name',
      originalValue: property.classification.name
    })
  }

  // Number of bedrooms
  if (property.numberBedrooms !== undefined) {
    filters.push({
      key: 'bedrooms',
      label: 'Bedrooms',
      value: property.numberBedrooms === 0 ? 'Studio' : `${property.numberBedrooms} bed`,
      originalField: 'property.numberBedrooms',
      originalValue: property.numberBedrooms
    })
  }

  // Number of bathrooms
  if (property.numberBathrooms !== undefined) {
    filters.push({
      key: 'bathrooms',
      label: 'Bathrooms',
      value: `${property.numberBathrooms} bath`,
      originalField: 'property.numberBathrooms',
      originalValue: property.numberBathrooms
    })
  }

  // Price range
  if (whereClause.price) {
    let priceText = ''
    if (whereClause.price.gte && whereClause.price.lte) {
      priceText = `£${whereClause.price.gte.toLocaleString()} - £${whereClause.price.lte.toLocaleString()}`
    } else if (whereClause.price.gte) {
      priceText = `Over £${whereClause.price.gte.toLocaleString()}`
    } else if (whereClause.price.lte) {
      priceText = `Under £${whereClause.price.lte.toLocaleString()}`
    }

    if (priceText) {
      filters.push({
        key: 'price',
        label: 'Price',
        value: priceText,
        originalField: 'price',
        originalValue: whereClause.price
      })
    }
  }

  // Listing type (sale/rental)
  if (whereClause.saleListing && !whereClause.rentalListing) {
    filters.push({
      key: 'listing-type',
      label: 'Listing Type',
      value: 'For Sale',
      originalField: 'saleListing',
      originalValue: whereClause.saleListing
    })
  } else if (whereClause.rentalListing && !whereClause.saleListing) {
    filters.push({
      key: 'listing-type',
      label: 'Listing Type',
      value: 'To Rent',
      originalField: 'rentalListing',
      originalValue: whereClause.rentalListing
    })
  }

  // Rental features
  if (whereClause.rentalListing) {
    if (whereClause.rentalListing.furnishedStatus) {
      const status = whereClause.rentalListing.furnishedStatus
      const statusText = status === 'FURNISHED' ? 'Furnished' :
        status === 'UNFURNISHED' ? 'Unfurnished' : 'Part Furnished'
      filters.push({
        key: 'furnished',
        label: 'Furnished',
        value: statusText,
        originalField: 'rentalListing.furnishedStatus',
        originalValue: status
      })
    }

    if (whereClause.rentalListing.isBillsIncluded !== undefined) {
      filters.push({
        key: 'bills',
        label: 'Bills',
        value: whereClause.rentalListing.isBillsIncluded ? 'Included' : 'Excluded',
        originalField: 'rentalListing.isBillsIncluded',
        originalValue: whereClause.rentalListing.isBillsIncluded
      })
    }
  }

  // Sale features
  if (whereClause.saleListing) {
    if (whereClause.saleListing.tenureType) {
      filters.push({
        key: 'tenure',
        label: 'Tenure',
        value: whereClause.saleListing.tenureType.charAt(0) + whereClause.saleListing.tenureType.slice(1).toLowerCase().replace('_', ' '),
        originalField: 'saleListing.tenureType',
        originalValue: whereClause.saleListing.tenureType
      })
    }

    if (whereClause.saleListing.chain === false) {
      filters.push({
        key: 'chain',
        label: 'Chain Status',
        value: 'Chain Free',
        originalField: 'saleListing.chain',
        originalValue: false
      })
    }
  }

  // Property features (simplified - just show if any are present)
  const featureCategories = ['parking', 'accessibilityFeatures', 'securityFeatures', 'additionalFeatures',
    'kitchenFeatures', 'outdoorSpace', 'energyAndUtilities']

  featureCategories.forEach(category => {
    if (property[category] && Object.keys(property[category]).length > 0) {
      const features = Object.entries(property[category])
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
        .join(', ')

      if (features) {
        filters.push({
          key: category,
          label: category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1'),
          value: features,
          originalField: `property.${category}`,
          originalValue: property[category]
        })
      }
    }
  })

  return filters
}

// Update search query by removing words related to the removed filter
function updateSearchQueryAfterFilterRemoval(removedFilter: AppliedFilter) {
  let currentQuery = searchQuery.value.toLowerCase()

  // Define patterns to remove based on filter type
  const patternsToRemove: string[] = []

  switch (removedFilter.key) {
    case 'property-type':
      // Remove property type words
      const propertyType = removedFilter.value.toLowerCase()
      patternsToRemove.push(propertyType, `${propertyType}s`) // singular and plural
      break

    case 'classification':
      // Remove classification words
      const classification = removedFilter.value.toLowerCase()
      patternsToRemove.push(classification)
      if (classification === 'detached') patternsToRemove.push('detached')
      if (classification === 'semi-detached') patternsToRemove.push('semi-detached', 'semi detached')
      if (classification === 'terraced') patternsToRemove.push('terraced')
      if (classification === 'studio flat') patternsToRemove.push('studio', 'studio flat')
      break

    case 'bedrooms':
      // Remove bedroom-related words
      const bedroomCount = removedFilter.originalValue
      if (bedroomCount === 0) {
        patternsToRemove.push('studio')
      } else {
        patternsToRemove.push(
          `${bedroomCount} bedroom`,
          `${bedroomCount} bed`,
          `${bedroomCount}-bedroom`,
          `${bedroomCount}-bed`,
          `${bedroomCount}bed`,
          `${bedroomCount}bedroom`
        )
        // Handle written numbers
        const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
        if (bedroomCount <= 10) {
          const wordNumber = numberWords[bedroomCount - 1]
          patternsToRemove.push(`${wordNumber} bedroom`, `${wordNumber} bed`)
        }
      }
      break

    case 'bathrooms':
      // Remove bathroom-related words
      const bathroomCount = removedFilter.originalValue
      patternsToRemove.push(
        `${bathroomCount} bathroom`,
        `${bathroomCount} bath`,
        `${bathroomCount}-bathroom`,
        `${bathroomCount}-bath`
      )
      break

    case 'price':
      // Remove price-related words
      patternsToRemove.push(
        'under £\\d+[k,\\d]*',
        'over £\\d+[k,\\d]*',
        'above £\\d+[k,\\d]*',
        'below £\\d+[k,\\d]*',
        'between £\\d+[k,\\d]* and £\\d+[k,\\d]*',
        '£\\d+[k,\\d]*-£\\d+[k,\\d]*',
        'per month',
        'pcm',
        'per week',
        'pw'
      )
      break

    case 'listing-type':
      // Remove listing type words
      if (removedFilter.value === 'For Sale') {
        patternsToRemove.push('for sale', 'to buy', 'sale')
      } else if (removedFilter.value === 'To Rent') {
        patternsToRemove.push('to rent', 'for rent', 'to let', 'rental')
      }
      break

    case 'furnished':
      // Remove furnished status words
      const furnishedStatus = removedFilter.value.toLowerCase()
      patternsToRemove.push(furnishedStatus, 'furnished', 'unfurnished', 'part furnished')
      break

    case 'bills':
      // Remove bills-related words
      patternsToRemove.push('bills included', 'bills excluded', 'including bills', 'excluding bills', 'with bills', 'bills')
      break

    case 'tenure':
      // Remove tenure words
      const tenure = removedFilter.value.toLowerCase()
      patternsToRemove.push(tenure, 'freehold', 'leasehold')
      break

    case 'chain':
      // Remove chain status words
      patternsToRemove.push('chain free', 'no chain', 'no onward chain')
      break

    default:
      // For property features, try to remove related words
      if (removedFilter.key === 'parking') {
        patternsToRemove.push('garage', 'parking', 'driveway', 'carport')
      } else if (removedFilter.key === 'outdoorSpace') {
        patternsToRemove.push('garden', 'balcony', 'patio', 'terrace')
      } else if (removedFilter.key === 'accessibilityFeatures') {
        patternsToRemove.push('wheelchair accessible', 'elevator', 'lift', 'wet room')
      } else if (removedFilter.key === 'securityFeatures') {
        patternsToRemove.push('cctv', 'security', 'alarm', 'gated')
      } else if (removedFilter.key === 'kitchenFeatures') {
        patternsToRemove.push('modern kitchen', 'breakfast bar', 'kitchen island')
      } else if (removedFilter.key === 'energyAndUtilities') {
        patternsToRemove.push('solar panels', 'epc rating', 'biomass', 'heating')
      }
      break
  }

  // Apply removals to the query
  let updatedQuery = currentQuery

  patternsToRemove.forEach(pattern => {
    // Use regex for more flexible matching
    const regex = new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    updatedQuery = updatedQuery.replace(regex, '')
  })

  // Clean up extra spaces and trim
  updatedQuery = updatedQuery
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s+and\s+/g, ' ') // Remove standalone 'and' words
    .replace(/\s+with\s+/g, ' ') // Remove standalone 'with' words  
    .replace(/^\s+|\s+$/g, '') // Trim start and end
    .replace(/^and\s+|^with\s+/, '') // Remove leading 'and' or 'with'
    .replace(/\s+and$|\s+with$/, '') // Remove trailing 'and' or 'with'

  // Update the search query
  searchQuery.value = updatedQuery
}

// Remove a specific filter
function removeFilter(filterKey: string) {
  const filterIndex = appliedFilters.value.findIndex(f => f.key === filterKey)
  if (filterIndex === -1) return

  const filter = appliedFilters.value[filterIndex]
  if (!filter) return

  // Remove the corresponding words from the search query
  updateSearchQueryAfterFilterRemoval(filter)

  // Remove the filter from our list
  appliedFilters.value.splice(filterIndex, 1)

  // If no filters remain, clear the search
  if (appliedFilters.value.length === 0) {
    searchResults.value = []
    hasSearched.value = false
    currentWhereClause.value = null
    return
  }

  // Modify the current WHERE clause by removing this filter
  if (currentWhereClause.value) {
    const newWhereClause = JSON.parse(JSON.stringify(currentWhereClause.value)) // Deep clone

    // Remove the specific filter from the WHERE clause
    switch (filter.key) {
      case 'property-type':
        if (newWhereClause.property?.type) delete newWhereClause.property.type
        break
      case 'classification':
        if (newWhereClause.property?.classification) delete newWhereClause.property.classification
        break
      case 'bedrooms':
        if (newWhereClause.property?.numberBedrooms !== undefined) delete newWhereClause.property.numberBedrooms
        break
      case 'bathrooms':
        if (newWhereClause.property?.numberBathrooms !== undefined) delete newWhereClause.property.numberBathrooms
        break
      case 'price':
        if (newWhereClause.price) delete newWhereClause.price
        break
      case 'listing-type':
        if (newWhereClause.saleListing) delete newWhereClause.saleListing
        if (newWhereClause.rentalListing) delete newWhereClause.rentalListing
        break
      case 'furnished':
        if (newWhereClause.rentalListing?.furnishedStatus) delete newWhereClause.rentalListing.furnishedStatus
        break
      case 'bills':
        if (newWhereClause.rentalListing?.isBillsIncluded !== undefined) delete newWhereClause.rentalListing.isBillsIncluded
        break
      case 'tenure':
        if (newWhereClause.saleListing?.tenureType) delete newWhereClause.saleListing.tenureType
        break
      case 'chain':
        if (newWhereClause.saleListing?.chain !== undefined) delete newWhereClause.saleListing.chain
        break
      default:
        // Handle property feature categories
        if (filter.originalField.startsWith('property.')) {
          const fieldPath = filter.originalField.replace('property.', '')
          if (newWhereClause.property?.[fieldPath]) {
            delete newWhereClause.property[fieldPath]
          }
        }
        break
    }

    // Clean up empty objects
    if (newWhereClause.property && Object.keys(newWhereClause.property).length === 0) {
      delete newWhereClause.property
    }
    if (newWhereClause.rentalListing && Object.keys(newWhereClause.rentalListing).length === 0) {
      delete newWhereClause.rentalListing
    }
    if (newWhereClause.saleListing && Object.keys(newWhereClause.saleListing).length === 0) {
      delete newWhereClause.saleListing
    }

    // Execute search with modified WHERE clause
    executeSearchWithWhereClause(newWhereClause)
  }
}

// Execute search directly with a WHERE clause
async function executeSearchWithWhereClause(whereClause: any) {
  isSearching.value = true
  searchError.value = ''

  try {
    // Make direct API call with the WHERE clause
    const response = await $fetch('/api/search/direct/', {
      method: 'POST',
      body: { whereClause }
    })

    if (response && typeof response === 'object') {
      const results = Array.isArray((response as any).results) ? (response as any).results : []
      searchResults.value = results as SearchResult[]
      currentWhereClause.value = whereClause

      console.log('Updated search results:', searchResults.value.length)
    }

  } catch (error: any) {
    console.error('Direct search error:', error)
    // Fallback: try to regenerate the search query and use RAG
    fallbackToRAGSearch()
  } finally {
    isSearching.value = false
  }
}

// Fallback method: reconstruct query from remaining filters and use RAG search
async function fallbackToRAGSearch() {
  const remainingFilters = appliedFilters.value
  let newQuery = ''

  // Build a query from remaining filters
  const propertyType = remainingFilters.find(f => f.key === 'property-type')?.value
  const bedrooms = remainingFilters.find(f => f.key === 'bedrooms')?.originalValue
  const listingType = remainingFilters.find(f => f.key === 'listing-type')?.value
  const price = remainingFilters.find(f => f.key === 'price')?.value

  // Construct query parts
  const queryParts: string[] = []

  if (bedrooms !== undefined && propertyType) {
    queryParts.push(`${bedrooms === 0 ? 'studio' : bedrooms + ' bedroom'} ${propertyType.toLowerCase()}`)
  } else if (propertyType) {
    queryParts.push(propertyType.toLowerCase())
  }

  if (listingType) {
    queryParts.push(listingType === 'For Sale' ? 'for sale' : 'to rent')
  }

  if (price) {
    queryParts.push(price.toLowerCase())
  }

  // Add other features
  const features = remainingFilters
    .filter(f => !['property-type', 'bedrooms', 'listing-type', 'price'].includes(f.key))
    .map(f => f.value.toLowerCase())

  if (features.length > 0) {
    queryParts.push(`with ${features.join(' and ')}`)
  }

  newQuery = queryParts.join(' ')

  if (newQuery.trim()) {
    searchQuery.value = newQuery
    searchProperties()
  } else {
    // No meaningful query could be constructed
    searchResults.value = []
    hasSearched.value = false
    currentWhereClause.value = null
  }
}

// Clear all filters
function clearAllFilters() {
  appliedFilters.value = []
  searchResults.value = []
  hasSearched.value = false
  currentWhereClause.value = null
  searchQuery.value = ''
}

// All search suggestions in a flat list
const allSuggestions = [
  // Basic property types
  '3 bedroom house',
  'studio flat to rent',

  // Property types with prices
  'detached house for sale under £400k',
  'penthouse flat over £1500 per month',

  // Feature-focused searches
  'house with modern kitchen and breakfast bar',
  'flat with balcony and parking',
  'property with garden and garage',

  // Location-based searches
  'house in Cardiff city centre',
  'flat near Newport with parking',

  // Lifestyle/accessibility searches
  'pet friendly house with garden',
  'wheelchair accessible flat with elevator',

  // Advanced/eco searches
  'eco house with solar panels and EPC rating A',

  // Additional varied searches
  'furnished flat with bills included',
  'chain free house with driveway',
  'cottage with fireplace and patio'
]

async function searchProperties() {
  if (!searchQuery.value.trim()) return

  // Clear any existing search timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }

  // Prevent duplicate searches
  if (searchQuery.value === lastExecutedQuery.value && hasSearched.value) {
    console.log('Skipping duplicate search for:', searchQuery.value)
    return
  }

  // Update URL with current search query only if it's different from current URL
  const currentUrlQuery = route.query.q as string
  const encodedQuery = encodeURIComponent(searchQuery.value)
  if (currentUrlQuery !== encodedQuery) {
    await navigateTo({
      path: '/search/ai',
      query: { q: encodedQuery }
    }, { replace: true })
  }

  // Update tracking variables
  lastExecutedQuery.value = searchQuery.value
  isSearching.value = true
  searchError.value = ''
  lastSearchQuery.value = searchQuery.value

  console.log('Executing search for:', searchQuery.value)

  try {
    const endpoint = '/api/search/rag/'
    console.log('Making RAG search request with query:', searchQuery.value)
    console.log('Last executed query was:', lastExecutedQuery.value)

    const requestBody = {
      query: searchQuery.value
    }

    const response = await $fetch(endpoint, {
      method: 'POST',
      body: requestBody
    })

    console.log('RAG search response:', response)
    console.log('Response type:', typeof response)
    console.log('Results array:', (response as any)?.results)
    console.log('Results length:', (response as any)?.results?.length)

    if ((response as any)?.generatedConditions) {
      console.log('Generated SQL conditions:', (response as any).generatedConditions)
    }

    // Check if response has results
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response from server')
    }

    // Type-safe assignment
    const results = Array.isArray((response as any).results) ? (response as any).results : []
    searchResults.value = results as SearchResult[]
    hasSearched.value = true
    detectedListingType.value = (response as any).detectedListingType || 'both'
    detectedPriceRange.value = (response as any).detectedPriceRange || null

    // Extract and store the applied filters from the generated where clause
    const whereClause = (response as any).generatedWhereClause
    if (whereClause) {
      currentWhereClause.value = whereClause
      appliedFilters.value = extractFiltersFromWhereClause(whereClause)
    }

    console.log('Final searchResults.value:', searchResults.value)
    console.log('Final searchResults.value.length:', searchResults.value.length)
    console.log('Applied filters:', appliedFilters.value)

    if (searchResults.value.length === 0) {
      console.log('No results found for query:', searchQuery.value)
    }

  } catch (error: any) {
    console.error('Search error:', error)
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      data: error.data
    })

    searchError.value = error.statusMessage || error.message || 'Failed to search properties'
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Handle example query clicks
function selectExampleQuery(example: string) {
  searchQuery.value = example
  // Auto-search when clicking an example
  searchProperties()
}

// Extract property features for display - now grouped by category
function getPropertyFeatures(result: SearchResult): string[] {
  const features: string[] = []

  if (!result.property) return features

  // Type and classification
  if (result.property.type?.name) features.push(result.property.type.name)
  if (result.property.classification?.name) features.push(result.property.classification.name)

  // Basic property features
  if (result.property.chainFree) features.push('Chain Free')
  if (result.property.vacant) features.push('Vacant')

  // Outdoor features (grouped)
  if (result.property.outdoorSpace) {
    const outdoor = result.property.outdoorSpace as any
    const outdoorItems: string[] = []
    if (outdoor.frontGarden || outdoor.rearGarden) outdoorItems.push('Garden')
    if (outdoor.balcony) outdoorItems.push('Balcony')
    if (outdoor.terrace) outdoorItems.push('Terrace')
    if (outdoor.patio) outdoorItems.push('Patio')
    if (outdoor.pool) outdoorItems.push('Pool')
    if (outdoorItems.length > 0) {
      features.push(`Outdoor: ${outdoorItems.join(', ')}`)
    }
  }

  // Parking features (grouped)
  if (result.property.parking) {
    const parking = result.property.parking as any
    const parkingItems: string[] = []
    if (parking.garage) parkingItems.push('Garage')
    if (parking.driveway) parkingItems.push('Driveway')
    if (parking.allocatedParking) parkingItems.push('Allocated Parking')
    if (parking.evCharging) parkingItems.push('EV Charging')
    if (parkingItems.length > 0) {
      features.push(`Parking: ${parkingItems.join(', ')}`)
    }
  }

  // Additional features (grouped)
  if (result.property.additionalFeatures) {
    const additional = result.property.additionalFeatures as any
    const additionalItems: string[] = []
    if (additional.petFriendly) additionalItems.push('Pet Friendly')
    if (additional.homeOffice) additionalItems.push('Home Office')
    if (additional.gym) additionalItems.push('Gym')
    if (additional.concierge) additionalItems.push('Concierge')
    if (additional.pool) additionalItems.push('Pool')
    if (additional.internet) additionalItems.push('Internet')
    if (additional.cableTv) additionalItems.push('Cable TV')
    if (additional.phone) additionalItems.push('Phone')
    if (additional.laundry) additionalItems.push('Laundry')
    if (additional.shop) additionalItems.push('Shop')
    if (additionalItems.length > 0) {
      features.push(`Special: ${additionalItems.join(', ')}`)
    }
  }

  // Accessibility features (grouped)
  if (result.property.accessibilityFeatures) {
    const accessibility = result.property.accessibilityFeatures as any
    const accessibilityItems: string[] = []
    if (accessibility.wheelchairFriendly) accessibilityItems.push('Wheelchair Friendly')
    if (accessibility.stepFreeAccess) accessibilityItems.push('Step Free')
    if (accessibility.elevator) accessibilityItems.push('Elevator')
    if (accessibilityItems.length > 0) {
      features.push(`Accessibility: ${accessibilityItems.join(', ')}`)
    }
  }

  // Security features (grouped)
  if (result.property.securityFeatures) {
    const security = result.property.securityFeatures as any
    const securityItems: string[] = []
    if (security.alarmSystem) securityItems.push('Alarm')
    if (security.cctv) securityItems.push('CCTV')
    if (security.gatedCommunity) securityItems.push('Gated Community')
    if (security.neighborhoodWatch) securityItems.push('Neighbourhood Watch')
    if (security.intercomSystem) securityItems.push('Intercom')
    if (security.security) securityItems.push('Security')
    if (security.reception) securityItems.push('Reception')
    if (securityItems.length > 0) {
      features.push(`Security: ${securityItems.join(', ')}`)
    }
  }

  // Kitchen features (grouped)
  if (result.property.kitchenFeatures) {
    const kitchen = result.property.kitchenFeatures as any
    const kitchenItems: string[] = []
    if (kitchen.breakfastBar) kitchenItems.push('Breakfast Bar')
    if (kitchen.island) kitchenItems.push('Kitchen Island')
    if (kitchen.pantry) kitchenItems.push('Pantry')
    if (kitchenItems.length > 0) {
      features.push(`Kitchen: ${kitchenItems.join(', ')}`)
    }
  }

  // Living area features (grouped)
  if (result.property.livingAreaFeatures) {
    const living = result.property.livingAreaFeatures as any
    const livingItems: string[] = []
    if (living.fireplace) livingItems.push('Fireplace')
    if (living.airConditioning) livingItems.push('Air Conditioning')
    if (living.floorToeCeiling) livingItems.push('Floor to Ceiling Windows')
    if (livingItems.length > 0) {
      features.push(`Living: ${livingItems.join(', ')}`)
    }
  }

  // Bathroom features (grouped)
  if (result.property.bathroomFeatures && Array.isArray(result.property.bathroomFeatures)) {
    const bathroomItems = new Set<string>() // Use Set to prevent duplicates
    for (const bathroom of result.property.bathroomFeatures) {
      if (bathroom.enSuite) bathroomItems.add('En-Suite')
      if (bathroom.bathtub) bathroomItems.add('Bathtub')
      if (bathroom.walkInShower) bathroomItems.add('Walk-in Shower')
      if (bathroom.downstairs) bathroomItems.add('Downstairs Bathroom')
      if (bathroom.upstairs) bathroomItems.add('Upstairs Bathroom')
    }
    if (bathroomItems.size > 0) {
      features.push(`Bathroom: ${Array.from(bathroomItems).join(', ')}`)
    }
  }

  // Bedroom features (grouped)
  if (result.property.bedroomFeatures && Array.isArray(result.property.bedroomFeatures)) {
    const bedroomItems = new Set<string>() // Use Set to prevent duplicates
    for (const bedroom of result.property.bedroomFeatures) {
      if (bedroom.enSuite) bedroomItems.add('En-Suite')
      if (bedroom.builtInStorage) bedroomItems.add('Built-in Storage')
      if (bedroom.walkInWardrobe) bedroomItems.add('Walk-in Wardrobe')
      // Bed types
      if (bedroom.bed && Array.isArray(bedroom.bed)) {
        const bedTypes = bedroom.bed.map((type: string) => {
          switch (type) {
            case 'SINGLE': return 'Single Bed'
            case 'DOUBLE': return 'Double Bed'
            case 'QUEEN': return 'Queen Bed'
            case 'KING': return 'King Bed'
            case 'SUPER_KING': return 'Super King Bed'
            case 'BUNK': return 'Bunk Bed'
            default: return type
          }
        })
        bedTypes.forEach((bedType: string) => bedroomItems.add(bedType))
      }
    }
    if (bedroomItems.size > 0) {
      features.push(`Bedroom: ${Array.from(bedroomItems).join(', ')}`)
    }
  }

  // Reception features (grouped)
  if (result.property.reception && Array.isArray(result.property.reception)) {
    const receptionItems = new Set<string>() // Use Set to prevent duplicates
    for (const reception of result.property.reception) {
      if (reception.homeCinema) receptionItems.add('Home Cinema')
      if (reception.gamesRoom) receptionItems.add('Games Room')
      if (reception.fireplace) receptionItems.add('Fireplace')
      if (reception.openPlan) receptionItems.add('Open Plan')
    }
    if (receptionItems.size > 0) {
      features.push(`Reception: ${Array.from(receptionItems).join(', ')}`)
    }
  }

  // Storage features (grouped)
  if (result.property.storageFeatures) {
    const storage = result.property.storageFeatures as any
    const storageItems: string[] = []
    if (storage.basement) storageItems.push('Basement')
    if (storage.attic) storageItems.push('Attic')
    if (storage.walkinCloset) storageItems.push('Walk-in Closet')
    if (storageItems.length > 0) {
      features.push(`Storage: ${storageItems.join(', ')}`)
    }
  }

  // Dining room features (grouped)
  if (result.property.diningroomFeatures) {
    const dining = result.property.diningroomFeatures as any
    const diningItems: string[] = []
    if (dining.openConcept) diningItems.push('Open Concept')
    if (diningItems.length > 0) {
      features.push(`Dining: ${diningItems.join(', ')}`)
    }
  }

  // Utility features (grouped)
  if (result.property.utility) {
    const utility = result.property.utility as any
    const utilityItems: string[] = []
    if (utility.storage) utilityItems.push('Storage')
    if (utility.sink) utilityItems.push('Sink')
    if (utility.plumbing) utilityItems.push('Plumbing')
    if (utility.appliances && Array.isArray(utility.appliances) && utility.appliances.length > 0) {
      utilityItems.push(...utility.appliances)
    }
    if (utilityItems.length > 0) {
      features.push(`Utility: ${utilityItems.join(', ')}`)
    }
  }

  // Energy and utilities (grouped)
  if (result.property.energyAndUtilities) {
    const energy = result.property.energyAndUtilities as any
    const energyItems: string[] = []
    if (energy.solarPanels) energyItems.push('Solar Panels')
    if (energy.heatPump) energyItems.push('Heat Pump')
    if (energy.smartHome) energyItems.push('Smart Home')
    if (energyItems.length > 0) {
      features.push(`Energy: ${energyItems.join(', ')}`)
    }
  }

  return features
}

// Form component testing
const selected = ref([])
const accordionSelected = ref([])

const options = [
  { key: 'option1', value: 'Option 1' },
  { key: 'option2', value: 'Option 2' },
  { key: 'option3', value: 'Option 3' },
  { key: 'option4', value: 'Option 4' },
  { key: 'option5', value: 'Option 5' },
]

function allUnselected() {
  console.log('Unselected')
}

function allSelected() {
  console.log('Selected')
}

function toggleExpanded(newValue: any) {
  console.log('Accordion expanded', newValue)
}
</script>

<style scoped>
/* Search styles */
.search-container {
  margin-bottom: 2rem;
}

.search-form {
  margin-bottom: 1rem;
}

.search-method-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.radio-group input[type="radio"] {
  margin: 0;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.location-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #0ea5e9;
}

/* Loading styles */
.loading-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  margin: 2rem 0;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-section h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.loading-text {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.loading-details {
  margin-top: 1rem;
}

.loading-query {
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-style: italic;
}

/* Search button loading state */
.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Applied Filters styles */
.applied-filters-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.filters-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.75rem 0;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.filter-chip {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-label {
  font-weight: 500;
  color: #64748b;
  margin-right: 0.25rem;
}

.filter-label::after {
  content: ':';
}

.filter-value {
  color: #1e293b;
  font-weight: 600;
  margin-right: 0.5rem;
}

.filter-remove {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  line-height: 1;
  transition: background-color 0.2s;
}

.filter-remove:hover {
  background: #dc2626;
}

.clear-all-button {
  background: #64748b;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.clear-all-button:hover {
  background: #475569;
}

.location-note {
  font-size: 0.875rem;
  color: #0369a1;
  margin: 0;
  text-align: center;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.search-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.example-searches {
  margin-top: 1rem;
}

.example-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.example-button:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.example-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-section {
  margin: 2rem 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detected-type {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-badge.type-sale {
  background-color: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.type-badge.type-rental {
  background-color: #dbeafe;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.type-badge.type-both {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.detected-price {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.price-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #fef3c7;
  color: #d97706;
  border: 1px solid #fed7aa;
}

.results-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.result-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.result-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.similarity-score {
  background-color: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 1rem;
}

.result-description {
  color: #6b7280;
  margin-bottom: 1rem;
}

.result-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.price {
  font-weight: 600;
  color: #059669;
  font-size: 1.125rem;
}

.bedrooms,
.bathrooms,
.location,
.property-type,
.listing-type {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #374151;
}

.listing-type.type-rent {
  background-color: #dbeafe;
  color: #1e40af;
}

.listing-type.type-buy {
  background-color: #dcfce7;
  color: #166534;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.no-results {
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

.no-results h3 {
  color: #92400e;
  margin: 0 0 0.5rem 0;
}

.no-results p {
  color: #78350f;
  margin: 0.5rem 0;
}

.no-results .suggestions {
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  text-align: left;
}

.suggestions-list {
  text-align: left;
  margin: 0;
  padding-left: 1.5rem;
  color: #78350f;
}

.suggestions-list li {
  margin: 0.25rem 0;
}

/* Feature styles */
.result-features {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.features-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.features-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background-color: #ede9fe;
  color: #6b46c1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.demo-nav {
  margin-top: var(--size-16);
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.button {
  display: inline-block;
  padding: 10px 16px;
  background-color: #3388ff;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2779e4;
}

/* Search Suggestions Tab Styles */
.search-suggestions {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.suggestion-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 1rem;
  border-radius: 6px;
  background-color: #e5e7eb;
  padding: 2px;
  overflow-x: auto;
}

.tab-button {
  flex: 1;
  min-width: fit-content;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button:hover {
  color: #374151;
  background-color: rgba(255, 255, 255, 0.5);
}

.tab-button.active {
  background-color: #ffffff;
  color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-content {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

.suggestion-item {
  width: 250px;
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  line-height: 1.4;
  min-height: 3rem;
  display: flex;
  align-items: center;
}

.suggestion-item:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.suggestion-item:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>