<template>
  <div class="flow flow-lg">
    <!-- Collapsible Search Header -->
    <div class="search-header-container" :class="{ 'is-sticky': hasSearched }">
      <div class="container container-sm">
        <MoleculesCollapsedSearchBar v-if="hasSearched && !isSearchFormOpen" 
          key="collapsed" 
          @edit="isSearchFormOpen = true" 
          @click="isSearchFormOpen = true"
        />
        <!-- Search Form -->
        <div v-else key="form" class="p-ai-search">
          <OrganismsAiSearchForm @submit-search="handleSearch" 
            :is-searching="isSearching" 
            :initial-query="lastSearchQuery" 
            :initial-location="lastLocation" 
            :initial-radius="lastRadius" 
          />
          <button v-if="hasSearched" @click="isSearchFormOpen = false" class="collapse-button | button button-secondary">
            <AtomsIcon name="arrow-up" icon="collapse" />
          </button>
        </div>
      </div>
    </div>

    <!-- Search Feedback Section: Loading, No Results, Error -->
    <div v-if="isSearching || (hasSearched && (!searchResults || searchResults.length === 0)) || searchError" class="search-feedback-section | container container-sm">
      <!-- Loading State -->
      <OrganismsAiSearchLoading v-if="isSearching" :last-search-query="lastSearchQuery" />

      <!-- No Results State -->
      <OrganismsAiSearchNoResults v-else-if="hasSearched && (!searchResults || searchResults.length === 0)" :last-search-query="lastSearchQuery" />

      <!-- Error State -->
      <div v-else-if="searchError" class="error-content | flow flow-sm">
        <h2 class="title-md">An Error Occurred</h2>
        <p class="body-sm">{{ searchError }}</p>
      </div>
    </div>
    <div class="| container">
      <!-- Results -->
      <OrganismsAiSearchResults v-if="!isSearching && searchResults && searchResults.length > 0" :results="searchResults" :query-analysis="queryAnalysis" />
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
const isSearchFormOpen = ref(true);

interface SearchPayload {
  location: GeocodingFeature;
  radius: number;
  query: string;
}

async function handleSearch(payload: SearchPayload) {
  isSearchFormOpen.value = false;
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

.search-header-container {
  &.is-sticky {
    position: sticky;
    top: var(--header-height);
    z-index: 10;
    background-color: var(--background-color);
    padding: var(--size-16) 0;
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

.collapse-button {
  position: absolute;
  color: var(--monochrome-900);
  bottom: var(--size-24);
  right: var(--size-24);
  width: var(--size-48);
  height: var(--size-48);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-lg);
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

  .collapse-button {
    bottom: var(--size-40);
    right: var(--size-40);
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
