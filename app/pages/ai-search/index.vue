<template>
  <div class="ai-search-page-wrapper"
    :class="{ 'initial-state': !hasSearched, 'search-expanded': !isSearchFormCollapsed && hasSearched }">
    <!-- Collapsible Search Header -->
    <div class="search-header-container" :class="{ 'is-sticky': hasSearched }">
        <OrganismsAiSearchForm @submit-search="handleSearch" :has-searched="hasSearched"
          :initial-query="lastSearchQuery" :initial-location="lastLocation" :initial-radius="lastRadius"
          @update:collapsed="isSearchFormCollapsed = $event" @sort="handleSort" />
    </div>

    <!-- Search Feedback Section: Loading, No Results, Error -->
    <div v-if="isSearching || (hasSearched && (!searchResults || searchResults.length === 0)) || searchError"
      class="search-feedback-section | container container-sm">
      <!-- Loading State -->
      <OrganismsAiSearchLoading v-if="isSearching" :last-search-query="lastSearchQuery" />

      <!-- No Results State -->
      <OrganismsAiSearchNoResults v-else-if="hasSearched && (!searchResults || searchResults.length === 0)"
        :last-search-query="lastSearchQuery" />

      <!-- Error State -->
      <div v-else-if="searchError" class="error-content | flow flow-sm">
        <h2 class="title-md">An Error Occurred</h2>
        <p class="body-sm">{{ searchError }}</p>
      </div>
    </div>
    <div class="| container">
      <!-- Results -->
      <OrganismsAiSearchResults v-if="!isSearching && searchResults && searchResults.length > 0"
        :results="sortedResults" :query-analysis="queryAnalysis" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { aiSearch } = useAi();

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

interface SearchPayload {
  location: GeocodingFeature;
  radius: number;
  query: string;
}

watch(isSearchFormCollapsed, (isCollapsed) => {
  if (hasSearched.value) {
    document.body.style.overflow = isCollapsed ? '' : 'hidden';
  }
});

const sortedResults = computed(() => {
  if (!searchResults.value) return [];
  const listings = [...searchResults.value];
  switch (currentSort.value) {
    case 'price-asc':
      return listings.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price-desc':
      return listings.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'date-asc':
      return listings.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'date-desc':
      return listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'relevance':
    default:
      return listings;
  }
});

function handleSort(sortBy: string) {
  currentSort.value = sortBy;
}

async function handleSearch(payload: SearchPayload) {
  isSearchFormCollapsed.value = true;
  hasSearched.value = true;
  isSearching.value = true;
  searchError.value = null;
  searchResults.value = null;
  queryAnalysis.value = null;
  lastSearchQuery.value = payload.query;
  lastLocation.value = payload.location;
  lastRadius.value = payload.radius;

  await nextTick(() => {
    const feedbackElement = document.querySelector(".search-feedback-section");
    if (feedbackElement) {
      feedbackElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  try {
    const response = await aiSearch(payload.location, payload.radius, payload.query);
    searchResults.value = response.results;
    queryAnalysis.value = response.queryAnalysis;
  } catch (error: any) {
    searchError.value = error.message || "An unexpected error occurred.";
    console.error("AI Search Error:", error);
  } finally {
    isSearching.value = false;
  }
}
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;

.ai-search-page-wrapper.search-expanded {
  .search-header-container {
    position: fixed;
    inset: 0;
    z-index: 50;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-16);
    margin-bottom: 0;

  }
}

.search-header-container {
  &.is-sticky {
    position: sticky;
    top: var(--header-height);
    z-index: 10;
    background-color: var(--background-color);
    margin-bottom: var(--size-24);

    .p-ai-search {
      max-height: 85vh;
      overflow-y: auto;
    }
  }
}

.p-ai-search {
  background: var(--background-200);
  border-radius: var(--border-radius-3xl);
  padding: var(--size-24);
  position: relative;
}

@media (min-width: 768px) {
  .p-ai-search {
    padding: var(--size-32);
  }

  .collapse-button {
    bottom: var(--size-32);
    right: var(--size-32);
  }
}

@media (min-width: 1024px) {
  .p-ai-search {
    padding: var(--size-40);
  }

}

/* Search Feedback Section */
.search-feedback-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-32);
  text-align: center;
  padding: var(--size-40);
  background: var(--background-200);
  border-radius: var(--border-radius-3xl);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.error-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-32);
}

/* Error Content */
.error-content {
  .title-md {
    color: var(--danger-heading);
  }

  .body-sm {
    color: var(--danger-text);
  }
}
</style>
