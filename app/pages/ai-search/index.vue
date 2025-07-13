<template>
  <div class="ai-search-page-wrapper"
    :class="{ 'initial-state': !hasSearched, 'form-expanded': !isSearchFormCollapsed && hasSearched }">

    <!-- Hero Image (shown in initial state, even when form expanded) -->
    <div v-if="!hasSearched" class="hero-section">
      <img src="/img/ai-search-cover.png" alt="AI Search Cover" class="hero-image" />
    </div>

    <!-- Collapsible Search Header -->
    <div class="search-header-container | container" :class="{ 'is-sticky': hasSearched, 'is-hero': !hasSearched }">
      <div v-if="hasSearched" class="sticky-backdrop"></div>

      <!-- Hero Title (shown in initial state, even when form expanded) -->
      <h1 v-if="!hasSearched" class="hero-title | title-xl font-bold">
        Find your perfect home with the
        <span class="viri-ai-text">
          ViriAI
        </span>
        boosted search
      </h1>

      <OrganismsAiSearchForm @submit-search="handleSearch" :has-searched="hasSearched" :initial-query="lastSearchQuery"
        :initial-location="lastLocation" :initial-radius="lastRadius" :has-saved-state="hasSavedState"
        @update:collapsed="isSearchFormCollapsed = $event" @sort="handleSort" @reset="resetForm" />
    </div>

    <!-- Search Feedback Section: Loading, No Results, Error -->
    <div v-if="shouldShowFeedback && !isMapView" class="search-feedback-wrapper">
      <div class="search-feedback-section | container container-sm">
      <OrganismsAiSearchLoading v-if="isSearching" :last-search-query="lastSearchQuery" />
      <OrganismsAiSearchNoResults v-else-if="hasNoResults" :last-search-query="lastSearchQuery" />
      </div>
    </div>
    <div v-else class="results-container">
      <div class="results-with-toggle">
        <!-- View Toggle Button -->
        <div class="view-toggle-container">
          <button 
            @click="toggleView" 
            class="view-toggle-button | button button-secondary button-sm"
          >
            {{ isMapView ? 'Show List' : 'Show Map' }}
          </button>
        </div>
        
        <!-- List View -->
        <OrganismsAiSearchResults 
          v-if="!isMapView && hasResults"
          :results="sortedResults" 
          :query-analysis="queryAnalysis" 
          :current-page="currentPage" 
          :total-pages="totalPages" 
          :total-results="totalResults"
          @page-change="handlePageChange" 
        />
        
        
        <!-- Map View (shown even with no results) -->
        <OrganismsAiSearchMapView 
          v-if="isMapView"
          :results="sortedResults"
          :location="lastLocation"
          :radius="lastRadius"
          :is-searching="isSearching"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface SearchPayload {
  location: GeocodingFeature;
  radius: number;
  query: string;
}

// Use composables for state management
const {
  // State
  searchResults,
  queryAnalysis,
  isSearching,
  hasSearched,
  searchError,
  lastSearchQuery,
  lastLocation,
  lastRadius,
  isSearchFormCollapsed,
  currentSort,
  currentPage,
  totalPages,
  totalResults,
  lastWhereClause,
  lastLocationContext,
  
  // Methods
  initializeFromSavedState,
  resetForm,
  saveCurrentState,
  aiSearch,
  paginateSearch
} = useAiSearchPage();

// Access search state for view mode persistence
const { saveSearchState, restoreSearchState } = useSearchState();

// Computed properties (belong in template, not composable)
const shouldShowFeedback = computed(() =>
  isSearching.value || (hasSearched.value && (!searchResults.value || searchResults.value.length === 0)) || searchError.value
);

const hasNoResults = computed(() =>
  hasSearched.value && (!searchResults.value || searchResults.value.length === 0)
);

const hasResults = computed(() =>
  !isSearching.value && searchResults.value && searchResults.value.length > 0
);

const hasSavedState = computed(() =>
  !!(lastSearchQuery.value || lastLocation.value || lastRadius.value)
);

// Map view state - initialize from saved state
const isMapView = ref(false);

// Initialize view state from localStorage
const initializeViewState = () => {
  if (import.meta.client) {
    const restored = restoreSearchState();
    isMapView.value = restored.viewMode === 'map';
  }
};

const toggleView = () => {
  isMapView.value = !isMapView.value;
  // Save the new view mode to localStorage
  saveSearchState({ viewMode: isMapView.value ? 'map' : 'list' });
};

const sortedResults = computed(() => {
  if (!searchResults.value) return [];
  return applySortToResults(searchResults.value, currentSort.value);
});

// Import utility functions
import { scrollToTop } from '~/utils/navigation';
import { applySortToResults } from '~/utils/searchSort';

// Initialize state on mount
onMounted(() => {
  initializeFromSavedState();
  initializeViewState();
});

// Handle sort changes
const handleSort = (sortBy: string) => {
  currentSort.value = sortBy;
  saveCurrentState();
};

const handlePageChange = async (page: number) => {
  if (page === currentPage.value || page < 1 || page > totalPages.value) return;
  
  // Scroll to top immediately
  scrollToTop();
  
  // Use cached WHERE clause for faster pagination
  if (lastWhereClause.value) {
    try {
      const response = await paginateSearch(
        lastWhereClause.value,
        page,
        20,
        lastSearchQuery.value,
        queryAnalysis.value,
        lastLocationContext.value
      );
      
      searchResults.value = response.results;
      currentPage.value = response.currentPage;
      totalPages.value = response.totalPages;
      totalResults.value = response.totalResults;
      
      // Apply current sort order to results
      searchResults.value = applySortToResults(searchResults.value, currentSort.value);
      
      // Save current state
      saveCurrentState();
      
    } catch (error: any) {
      searchError.value = error.message || "An unexpected error occurred.";
    }
  } else {
    // Fallback to full search if WHERE clause not available
    await handleSearch({
      location: lastLocation.value!,
      radius: lastRadius.value,
      query: lastSearchQuery.value
    }, page);
  }
};

// Disable body scroll when form is expanded and there are results
watch([isSearchFormCollapsed, hasResults], ([collapsed, results]) => {
  if (!collapsed && results) {
    // Form is expanded and we have results - disable body scroll
    document.body.style.overflow = 'hidden';
  } else {
    // Form is collapsed or no results - restore body scroll
    document.body.style.overflow = '';
  }
});

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = '';
});

const handleSearch = async (payload: SearchPayload, page: number = 1) => {
  // Reset state
  isSearchFormCollapsed.value = true;
  hasSearched.value = true;
  isSearching.value = true;
  searchError.value = null;
  if (page === 1) {
    searchResults.value = null;
    queryAnalysis.value = null;
  }

  // Store search parameters
  lastSearchQuery.value = payload.query;
  lastLocation.value = payload.location;
  lastRadius.value = payload.radius;
  currentPage.value = page;

  // Scroll to feedback section
  await nextTick(() => {
    document.querySelector(".search-feedback-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  try {
    const response = await aiSearch(payload.location, payload.radius, payload.query, page);
    searchResults.value = response.results;
    queryAnalysis.value = response.queryAnalysis;
    
    // Use pagination info from backend (fallback to defaults if pagination removed)
    totalResults.value = response.totalResults ?? searchResults.value?.length ?? 0;
    totalPages.value = response.totalPages ?? 1;
    currentPage.value = response.currentPage ?? 1;
    
    // Cache WHERE clause and context for efficient pagination
    lastWhereClause.value = response.generatedWhereClause;
    lastLocationContext.value = response.locationContext;
    
    // Apply current sort order to results
    searchResults.value = applySortToResults(searchResults.value, currentSort.value);
    
    // Save current state
    saveCurrentState();
    
  } catch (error: any) {
    searchError.value = error.message || "An unexpected error occurred.";
  } finally {
    isSearching.value = false;
  }
};
</script>

<style lang="scss">
// Page blur effects when form expanded
.ai-search-page-wrapper.form-expanded {

  .search-feedback-section,
  .results-container {
    filter: blur(var(--size-2));
    transition: filter 0.3s ease;
    opacity: 0.7;
  }

}

// Common margin adjustments for fixed search bar
.results-container,
.search-feedback-wrapper {
  margin-top: calc(var(--header-height) + 80px);
  
  @media (max-width: 768px) and (min-width: 600px) {
    margin-top: calc(var(--header-height) + 120px);
  }
  
  @media (max-width: 600px) {
    margin-top: calc(var(--header-height) + 140px);
  }
}

// Search feedback wrapper specifics
.search-feedback-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--size-24) 0;
}

// Hero section
.hero-section {
  position: relative;
  width: 100%;
  height: 40vh;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 45vh;
  }

  // Dark overlay for better text contrast
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.search-header-container {
  &.is-sticky {
    position: fixed;
    top: calc(var(--header-height) + var(--size-16));
    left: 0;
    right: 0;
    z-index: 20;
    margin-bottom: var(--size-24);
    background: var(--background-color);
  }

  &.is-hero {
    position: relative;
    margin-top: calc(-40vh + var(--size-40));
    z-index: 20;

    @media (min-width: 768px) {
      margin-top: calc(-45vh + var(--size-48));
    }
  }
}

// Hero title styling
.hero-title {
  text-align: center;
  color: var(--monochrome-900);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin: var(--size-40) 0 var(--size-40) 0;
  line-height: var(--lineheight-md);
}

.viri-ai-text {
  color: var(--secondary-400);
  font-weight: var(--font-bold);
  border-radius: var(--border-radius-lg);
}

// Search feedback section
.search-feedback-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--size-32);
  text-align: center;
  padding: var(--size-40);
  background: var(--background-200);
  border-radius: var(--border-radius-3xl);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}


// Error content
.error-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-32);

  .title-md {
    color: var(--danger-heading);
  }

  .body-sm {
    color: var(--danger-text);
  }
}

// Results with toggle
.results-with-toggle {
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
}

.view-toggle-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--size-16);
}

.view-toggle-button {
  min-width: 120px;
}

// No results in list view
.no-results-list-view {
  display: flex;
  justify-content: center;
  padding: var(--size-40);
}
</style>
