<template>
  <div class="| container flow flow-lg">
    <h1 class="| title-md">AI Search Test</h1>

    <div class="| flow">
      <p>Test AI-powered property search using RAG (Retrieval-Augmented Generation) where AI generates exact SQL filters
        for perfect matching.</p>
    </div>

    <h2 class="| title-sm">Search Properties</h2>

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
    </div>

    <div v-if="searchResults.length > 0" class="results-section">
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

    <AtomsDivider />

    <h2 class="| title-sm">Form Components Test</h2>

    <MoleculesMultiselect :options="options" v-model="selected" @all-unselected="allUnselected"
      @all-selected="allSelected" />

    <h2 class="| title-sm">Accordion multi-select</h2>

    <MoleculesAccordionMultiselect title="House" :options="options" v-model="accordionSelected"
      @expanded="toggleExpanded" />

    <AtomsDivider />

    <h2 class="| title-xs">Debug</h2>

    <pre>Search Query: {{ searchQuery }}
Search Results Count: {{ searchResults.length }}
Multi-select: {{ selected }}
Accordion multi-select: {{ accordionSelected }}
      </pre>
  </div>
</template>

<script setup lang="ts">
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

// All search suggestions in a flat list
const allSuggestions = [
  // Basic searches
  '3 bedroom house',
  'studio flat',
  'house with garage',
  'flat with balcony',
  'house with garden',

  // Sale/Rental specific searches
  '3 bedroom house for sale',
  'flat to rent with parking',
  'detached house for sale in Cardiff',
  'studio flat to let in Newport',
  'house for sale with garden',
  'property to rent with pets allowed',

  // Price-based searches
  'house for sale under £300k',
  'flat to rent under £1000 per month',
  '3 bedroom house for sale over £250000',
  'property to rent under £800 pcm',
  'house for sale between £200k and £400k',
  'flat to rent under £250 per week',
  'detached house for sale over £500k',
  'studio flat to rent under £600 per month',

  // Feature-based searches
  'house with washing machine in utility',
  'pet friendly house with garden',
  'house with modern kitchen and breakfast bar',
  'flat with allocated parking and intercom',
  'house with fireplace and patio',

  // Location-based searches (only valid locations)
  'house with 3 bedrooms 10 miles in Cardiff',
  'all properties within 40 miles of Cardiff',
  'detached house in Newport',
  'flat within 5 miles of Cardiff',
  'house in Cardiff city centre',

  // Premium searches
  'mansion with gated community and concierge',
  'penthouse with home cinema and balcony',
  'house with pool and summer house and garden office',
  'luxury flat with elevator and wet room',
  'gated community with CCTV and security and intercom',

  // Advanced searches
  'wheelchair accessible flat with elevator and wet room',
  'house with solar panels and EV charging and smart meter',
  'eco house with biomass heating and solar PV and EPC rating A',
  'family house with 4 bedrooms and 3 bathrooms with front and rear garden',
  'chain free vacant house with garage and driveway and basement storage'
]

async function searchProperties() {
  if (!searchQuery.value.trim()) return

  isSearching.value = true
  searchError.value = ''
  lastSearchQuery.value = searchQuery.value

  try {
    const endpoint = '/api/search/rag/'
    console.log('Making RAG search request with query:', searchQuery.value)

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

    console.log('Final searchResults.value:', searchResults.value)
    console.log('Final searchResults.value.length:', searchResults.value.length)

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