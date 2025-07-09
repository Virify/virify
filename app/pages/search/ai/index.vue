<template>
  <div class="| container flow flow-lg">
    <h1 class="| title-md">AI Search Test</h1>

    <div class="| flow">
      <p>Test AI-powered property search using RAG (Retrieval-Augmented Generation) where AI generates exact SQL filters for perfect matching.</p>
    </div>

    <h2 class="| title-sm">Search Properties</h2>

    <!-- Search Suggestions -->
    <div class="search-suggestions">
      <h2 class="title-xs">Suggestion searches</h2>
      <div class="suggestions-grid">
        <button v-for="suggestion in allSuggestions" :key="suggestion" @click="selectExampleQuery(suggestion)" class="suggestion-item">
          {{ suggestion }}
        </button>
      </div>
    </div>

    <div class="search-container">
      <form @submit.prevent="searchProperties" class="search-form">
        <!-- Location and Radius Selection -->
        <div class="location-radius-row">
          <div class="location-input-wrapper">
            <label for="location-input" class="location-label">Location</label>
            <input id="location-input" v-model="locationQuery" type="text" placeholder="Enter location (e.g., Cardiff, Newport, CF37 1LN)" class="location-input" :disabled="isSearching" autocomplete="off" @input="onLocationInput" />
            <div v-if="locationSuggestions.length > 0" class="location-suggestions">
              <button v-for="suggestion in locationSuggestions" :key="suggestion.place_name_en" type="button" @click="selectLocation(suggestion)" class="suggestion-item">
                {{ suggestion.place_name_en }}
              </button>
            </div>
          </div>

          <div class="radius-input-wrapper">
            <label for="radius-select" class="radius-label">Radius</label>
            <select id="radius-select" v-model="searchRadius" class="radius-select" :disabled="isSearching">
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="15">15 miles</option>
              <option value="20">20 miles</option>
              <option value="25">25 miles</option>
              <option value="30">30 miles</option>
              <option value="40">40 miles</option>
              <option value="50">50 miles</option>
            </select>
          </div>
        </div>

        <!-- AI Search Query -->
        <div class="search-query-row">
          <div class="search-input-wrapper">
            <label for="search-input" class="search-label">What are you looking for?</label>
            <div class="styled-input-container">
              <div v-if="hasSearched && queryAnalysis" class="input-background-text" v-html="getAnalyzedQuery()"></div>
              <input
                id="search-input"
                v-model="searchQuery"
                type="text"
                placeholder="e.g., '3 bedroom house with modern kitchen', 'furnished flat with parking'"
                class="search-input"
                :class="{ 'has-styling': hasSearched && queryAnalysis }"
                :disabled="isSearching"
              />
            </div>
          </div>
          <button type="submit" class="search-button" :disabled="isSearching || !searchQuery.trim() || !selectedLocation">
            {{ isSearching ? "Searching..." : "Search" }}
          </button>
        </div>
      </form>
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
      </div>

      <div class="results-grid">
        <div v-for="result in searchResults" :key="result.id" class="result-card">
          <a :href="`/listing/${result.id}`" target="_blank" rel="noopener noreferrer" class="result-link">
            <div class="result-header">
              <h4 class="result-title">{{ result.title }}</h4>
              <span class="similarity-score">{{ Math.round(result.similarity * 100) }}% match</span>
            </div>
            <p class="result-description">{{ result.description }}</p>
            <div class="result-details">
              <span class="price">£{{ result.price?.toLocaleString() }}</span>
              <span v-if="result.property?.numberBedrooms" class="bedrooms"> {{ result.property.numberBedrooms }} bed </span>
              <span v-if="result.property?.numberBathrooms" class="bathrooms"> {{ result.property.numberBathrooms }} bath </span>
              <span v-if="result.property?.address?.city" class="location">
                {{ result.property.address.city }}
              </span>
              <span v-if="result.property?.type?.name" class="property-type">
                {{ result.property.type.name }}
              </span>
              <span class="listing-type" :class="`type-${result.listingType}`">
                {{ result.listingType === "rent" ? "Rental" : "Sale" }}
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
          </a>
        </div>
      </div>
    </div>

    <div v-else-if="hasSearched && !isSearching" class="no-results">
      <h3 class="| title-xs">No Results Found</h3>
      <p>
        Sorry, we couldn't find any properties matching your search criteria for <strong>"{{ lastSearchQuery }}"</strong>.
      </p>
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
/**
 * AI Search Page Logic
 *
 * - Handles user input, location autocomplete, and search suggestions.
 * - Calls backend API to perform AI-driven property search.
 * - Displays results, highlights query analysis, and manages UI state.
 * - Uses shared property feature extraction utility for result display.
 */

const route = useRoute();
const { searchQuery, queryAnalysis, getAnalyzedQuery } = useAi();
import { extractPropertyFeatures } from "~~/shared/utils/property-features";
const { autoComplete } = useMap();
import type { SearchResult } from "~~/shared/types/search";
const searchResults = ref<SearchResult[]>([]);
const isSearching = ref(false);
const hasSearched = ref(false);
const lastSearchQuery = ref("");
const searchError = ref("");
const locationQuery = ref("");
const locationSuggestions = ref<any[]>([]);
const selectedLocation = ref<any>(null);
const searchRadius = ref(10);
const suppressLocationFetch = ref(false);
const lastExecutedQuery = ref("");
const lastSearchRadius = ref(searchRadius.value);
const isInitialLoad = ref(true);
let searchTimeout: NodeJS.Timeout | null = null;
let locationTimeout: NodeJS.Timeout | null = null;

// Reactive references for location and search state
onMounted(() => {
  const queryParam = route.query.q as string;
  if (queryParam) {
    const decodedQuery = decodeURIComponent(queryParam);
    searchQuery.value = decodedQuery;
    lastExecutedQuery.value = decodedQuery;
    nextTick(() => searchProperties());
  }
  isInitialLoad.value = false;
});


useHead(() => ({
  title: searchQuery.value ? `AI Search: ${searchQuery.value} | Property Search` : "AI Property Search - Smart Property Discovery",
  meta: [
    {
      name: "description",
      content: searchQuery.value
        ? `AI search results for "${searchQuery.value}" - Advanced property search with intelligent filtering and natural language understanding.`
        : "Revolutionary AI-powered property search. Use natural language to find your perfect home with intelligent filtering and smart matching.",
    },
  ],
}));

// Watch for changes in the search query from the URL
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && typeof newQuery === "string" && !isInitialLoad.value) {
      const decodedQuery = decodeURIComponent(newQuery);
      if (decodedQuery !== lastExecutedQuery.value) {
        searchQuery.value = decodedQuery;
        lastExecutedQuery.value = decodedQuery;
        searchProperties();
      }
    }
  }
);

// Cleanup on unmount
onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (locationTimeout) clearTimeout(locationTimeout);
});

/**
 * Handles location input changes and fetches autocomplete suggestions.
 * Uses a debounce mechanism to avoid excessive API calls.
 */
async function onLocationInput() {
  if (suppressLocationFetch.value) {
    suppressLocationFetch.value = false;
    return;
  }
  if (locationTimeout) clearTimeout(locationTimeout);
  locationTimeout = setTimeout(async () => {
    const query = locationQuery.value.toLowerCase().trim();
    if (query && query.length > 2) {
      try {
        const results = await autoComplete(query);
        locationSuggestions.value = results;
      } catch {
        locationSuggestions.value = [];
      }
    } else {
      locationSuggestions.value = [];
    }
  }, 300);
}

/**
 * Selects a location suggestion and updates the input field.
 * Suppresses further location fetches to avoid flickering.
 */
function selectLocation(suggestion: any) {
  suppressLocationFetch.value = true;
  locationQuery.value = suggestion.place_name_en;
  selectedLocation.value = suggestion;
  locationSuggestions.value = [];
}

watch(() => locationQuery.value, onLocationInput);

// Predefined search suggestions for quick access
const allSuggestions = [
  "3 bedroom house",
  "studio flat to rent",
  "2 bed cottage",
  "detached house for sale",
  "house under £400k",
  "rental under £1500 per month",
  "penthouse flat over £2000 per month",
  "bungalow under £350k",
  "house with modern kitchen and breakfast bar",
  "flat with balcony and parking",
  "property with garden and garage",
  "house with home office and fast broadband",
  "pet friendly house with garden",
  "wheelchair accessible flat with elevator",
  "furnished flat with bills included",
  "unfurnished house with parking",
  "eco house with solar panels and EPC rating A",
  "house with underfloor heating and smart meter",
  "chain free house with driveway",
  "cottage with fireplace and large garden",
  "flat with ensuite bathroom and built-in storage",
  "house with games room and home cinema",
];

/**
 * Performs the property search based on user input.
 */
async function searchProperties() {
  if (!searchQuery.value.trim() || !selectedLocation.value) return;
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }
  if (searchQuery.value === lastExecutedQuery.value && searchRadius.value === lastSearchRadius.value && hasSearched.value) {
    return;
  }
  lastSearchRadius.value = searchRadius.value;
  const currentUrlQuery = route.query.q as string;
  const encodedQuery = encodeURIComponent(searchQuery.value);
  if (currentUrlQuery !== encodedQuery) {
    await navigateTo(
      {
        path: "/search/ai",
        query: { q: encodedQuery },
      },
      { replace: true }
    );
  }
  lastExecutedQuery.value = searchQuery.value;
  isSearching.value = true;
  searchError.value = "";
  lastSearchQuery.value = searchQuery.value;
  try {
    const response = await $fetch("/api/search/rag/", {
      method: "POST",
      body: {
        query: searchQuery.value,
        lat: selectedLocation.value.center[1],
        lon: selectedLocation.value.center[0],
        radius: searchRadius.value,
      },
    });
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response from server");
    }
    const typedResponse = response as any;
    searchResults.value = Array.isArray(typedResponse.results) ? typedResponse.results : [];
    hasSearched.value = true;
    queryAnalysis.value = typedResponse.queryAnalysis || null;
  } catch (error: any) {
    searchError.value = error.statusMessage || error.message || "Failed to search properties";
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
}

/**
 * Selects an example query from the predefined suggestions.
 */
function selectExampleQuery(example: string) {
  searchQuery.value = example;
  searchProperties();
}

/**
 * Extracts property features from a search result.
 * Uses the shared utility function to get features from the property object.
 */
function getPropertyFeatures(result: SearchResult): string[] {
  return extractPropertyFeatures(result.property);
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

.location-radius-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-bottom: 1rem;
}

.location-input-wrapper {
  position: relative;
}

.location-label,
.radius-label,
.search-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.location-input,
.radius-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.location-input:focus,
.radius-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.location-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.location-suggestions .suggestion-item {
  display: block;
  width: 100%;
  padding: 0.75rem;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.location-suggestions .suggestion-item:hover {
  background-color: #f3f4f6;
}

.location-suggestions .suggestion-item:last-child {
  border-bottom: none;
}

.radius-input-wrapper {
  min-width: 120px;
}

.search-query-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
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

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.styled-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-background-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  z-index: 0;
  color: #1e293b;
  /* Default text color, will be overridden by inline styles */
}

.search-input {
  flex: 1;
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  position: relative;
  z-index: 1;
  font-family: inherit;
  line-height: 1.5;
  background: transparent;
}

.search-input.has-styling {
  color: transparent;
  caret-color: #1e293b;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Styling for analyzed query terms in background */
.input-background-text :deep(span[style*="color: #ea580c"]) {
  color: #ea580c !important;
}

.input-background-text :deep(span[style*="line-through"]) {
  color: #6b7280 !important;
  text-decoration: line-through !important;
  opacity: 0.7;
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

.location-note {
  font-size: 0.875rem;
  color: #0369a1;
  margin: 0;
  text-align: center;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.result-link:hover {
  text-decoration: none;
  color: inherit;
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
