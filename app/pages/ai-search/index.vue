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
        :initial-location="lastLocation" :initial-radius="lastRadius" @update:collapsed="isSearchFormCollapsed = $event"
        @sort="handleSort" />
    </div>

    <!-- Search Feedback Section: Loading, No Results, Error -->
    <div v-if="shouldShowFeedback" class="search-feedback-wrapper">
      <div class="search-feedback-section | container container-sm">
      <OrganismsAiSearchLoading v-if="isSearching" :last-search-query="lastSearchQuery" />
      <OrganismsAiSearchNoResults v-else-if="hasNoResults" :last-search-query="lastSearchQuery" />
      <div v-else-if="searchError" class="error-content | flow flow-sm">
        <h2 class="title-md">An Error Occurred</h2>
        <p class="body-sm">{{ searchError }}</p>
      </div>
      </div>
    </div>
    <div v-else class="results-container">
      <OrganismsAiSearchResults v-if="hasResults" :results="sortedResults" :query-analysis="queryAnalysis" />
    </div>
  </div>
</template>

<script setup lang="ts">

interface SearchPayload {
  location: GeocodingFeature;
  radius: number;
  query: string;
}

const { aiSearch } = useAi();

// State
const searchResults = ref<ListingWithFullProperty[] | null>(null);
const queryAnalysis = ref<QueryAnalysis | null>(null);
const isSearching = ref(false);
const hasSearched = ref(false);
const searchError = ref<string | null>(null);
const lastSearchQuery = ref("");
const lastLocation = ref<GeocodingFeature | null>(null);
const lastRadius = ref<number>(0);
const isSearchFormCollapsed = ref(true);
const currentSort = ref('relevance');

// Computed properties
const shouldShowFeedback = computed(() =>
  isSearching.value || (hasSearched.value && (!searchResults.value || searchResults.value.length === 0)) || searchError.value
);

const hasNoResults = computed(() =>
  hasSearched.value && (!searchResults.value || searchResults.value.length === 0)
);

const hasResults = computed(() =>
  !isSearching.value && searchResults.value && searchResults.value.length > 0
);

const sortedResults = computed(() => {
  if (!searchResults.value) return [];

  const listings = [...searchResults.value];
  const sortFunctions = {
    'price-asc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => (a.price || 0) - (b.price || 0),
    'price-desc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => (b.price || 0) - (a.price || 0),
    'date-asc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    'date-desc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    'relevance': () => 0
  };

  const sortFn = sortFunctions[currentSort.value as keyof typeof sortFunctions];
  return sortFn ? listings.sort(sortFn) : listings;
});


const handleSort = (sortBy: string) => {
  currentSort.value = sortBy;
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

const handleSearch = async (payload: SearchPayload) => {
  // Reset state
  isSearchFormCollapsed.value = true;
  hasSearched.value = true;
  isSearching.value = true;
  searchError.value = null;
  searchResults.value = null;
  queryAnalysis.value = null;

  // Store search parameters
  lastSearchQuery.value = payload.query;
  lastLocation.value = payload.location;
  lastRadius.value = payload.radius;

  // Scroll to feedback section
  await nextTick(() => {
    document.querySelector(".search-feedback-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  try {
    const response = await aiSearch(payload.location, payload.radius, payload.query);
    searchResults.value = response.results;
    queryAnalysis.value = response.queryAnalysis;
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
    position: sticky;
    top: var(--header-height);
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
  margin: 0;
  line-height: var(--lineheight-md);
  margin-top: var(--size-24);
}

.viri-ai-text {
  color: var(--secondary-400);
  font-weight: var(--font-bold);
  border-radius: var(--border-radius-lg);
}


// Search feedback wrapper - centers the entire section on the page
.search-feedback-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--size-24) 0;
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
</style>
