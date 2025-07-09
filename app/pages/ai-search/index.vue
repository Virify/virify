<template>
  <div class="flow flow-lg">
    <div class="container container-sm">
      <div class="p-ai-search">
        <OrganismsAiSearchForm @submit-search="handleSearch" :is-searching="isSearching" />
      </div>
    </div>

    <!-- Search Feedback Section: Loading, No Results, Error -->
    <div v-if="isSearching || (hasSearched && (!searchResults || searchResults.length === 0)) || searchError"
      class="search-feedback-section | container container-sm">

      <!-- Loading State -->
      <div v-if="isSearching" class="loading-content">
        <div class="loading-details">
          <span class="loading-query | body-sm">"{{ lastSearchQuery }}"</span>
        </div>
        <div class="loading-spinner">
          <AtomsBarSpinner />
        </div>
        <p class="loading-text body-sm">{{ wittyLoadingMessage }}</p>
      </div>

      <!-- No Results State -->
      <div v-else-if="hasSearched && (!searchResults || searchResults.length === 0)"
        class="no-results-content | flow flow-lg">
        <div class="loading-details">
          <span class="loading-query | body-sm">"{{ lastSearchQuery }}"</span>
        </div>
        <div class="flow flow-sm">
          <h2 class="title-md">No Results Found</h2>
          <p class="body-sm">We couldn't find any properties matching your search.</p>
        </div>
        <div class="flow flow-md">
          <h3 class="title-sm">To improve your results, try:</h3>
          <ul class="suggestions-list">
            <li v-for="tip of suggestionTips" :key="tip" class="body-sm">
              {{ tip }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="searchError" class="error-content | flow flow-sm">
        <h2 class="title-md">An Error Occurred</h2>
        <p class="body-sm">{{ searchError }}</p>
      </div>
    </div>


    <div class="| container">
      <!-- Results -->
      <OrganismsAiSearchResults v-if="!isSearching && searchResults && searchResults.length > 0"
        :results="searchResults" :query-analysis="queryAnalysis" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { aiSearch } = useAi()

const searchResults = ref<ListingWithFullProperty[] | null>(null)
const queryAnalysis = ref<QueryAnalysis | null>(null);
const isSearching = ref(false)
const hasSearched = ref(false)
const searchError = ref<string | null>(null)
const lastSearchQuery = ref('')
const wittyLoadingMessage = ref('')

// Test states for UI development
const route = useRoute()

function applyTestState(test: string | undefined) {
  if (test === 'loading') {
    isSearching.value = true
    lastSearchQuery.value = 'Show me a house with a garden and a sea view in Cornwall'
    const randomIndex = Math.floor(Math.random() * wittyLoadingMessages.length)
    wittyLoadingMessage.value = wittyLoadingMessages[randomIndex] ?? 'Searching for properties...'
  }
  else if (test === 'no-results') {
    hasSearched.value = true
    searchResults.value = []
    lastSearchQuery.value = 'A house on the moon'
  }
}

onMounted(() => {
  applyTestState(route.query.test as string | undefined)
})

watch(() => route.query.test, (newTest) => {
  applyTestState(newTest as string | undefined)
})

const wittyLoadingMessages = [
  "Please wait while the AI does your work",
  "Our premium plan is faster",
  "Enjoy this useless loading animation",
  "Teaching AI the difference between flats and houses.",
  "Convincing the AI not to become sentient (again).",
  "Calibrating your virtual assistant’s caffeine intake ☕",
  "Compiling witty responses… please wait.",
  "Convincing AI to search",
  "Doing something useful..",
  "Installing curb appeal… please wait.",
  "Fluffing virtual pillows for maximum coziness 🛋️",
  "Checking property values... and moral values.",
  "Calculating how much garden you can actually afford 🌻",
  "Staging your dream home with imaginary furniture.",
  "Consulting your neighbour's cat about market trends 🐈",
  "Photoshopping blue skies over every property photo 🌤️",
  "Updating price tags to keep pace with your hopes.",
  "Running a background check… on the neighborhood.",
  "Sweeping under the data rug for last-minute listings.",
  "Convincing the AI that 'garden-facing’ isn’t a personality.",
  "Planting virtual hedges to boost kerb appeal.",
  "Dusting off long-lost floor plans from the archives.",
];

const suggestionTips = [
  'Removing some specific requirements',
  'Searching for a different property type',
  'Expanding your location search area',
  'Using more general terms'
];

interface SearchPayload {
  location: GeocodingFeature;
  radius: number;
  query: string;
}

async function handleSearch(payload: SearchPayload) {
  const randomIndex = Math.floor(Math.random() * wittyLoadingMessages.length);
  wittyLoadingMessage.value = wittyLoadingMessages[randomIndex] ?? 'Searching for properties...';

  isSearching.value = true
  hasSearched.value = false
  searchError.value = null
  searchResults.value = null
  queryAnalysis.value = null
  lastSearchQuery.value = payload.query

  await nextTick(() => {
    const feedbackElement = document.querySelector('.search-feedback-section');
    if (feedbackElement) {
      feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  try {
    const response = await aiSearch(payload.location, payload.radius, payload.query)
    searchResults.value = response.results
    queryAnalysis.value = response.queryAnalysis
  } catch (error: any) {
    searchError.value = error.message || 'An unexpected error occurred.'
    console.error('AI Search Error:', error)
  } finally {
    isSearching.value = false
    hasSearched.value = true
  }
}
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.p-ai-search {
  background: var(--background-200);
  border-radius: var(--border-radius-3xl);
  padding: var(--size-24);
}

@media (min-width: 768px) {
  .p-ai-search {
    padding: var(--size-32);
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
}

.loading-content,
.no-results-content,
.error-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-32);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  color: var(--secondary-400);
}

.loading-text {
  color: var(--text-color);
  font-size: var(--font-size-md);
  min-height: var(--size-32);
}

.loading-details {
  margin: 0;
}

.loading-query {
  display: inline-block;
  padding: var(--size-8) var(--size-16);
  border: 1px solid fn.faded-color(15%);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  font-style: italic;
}

/* No Results */
.no-results-content {
  .title-md {
    color: var(--heading-color);
  }

  .title-sm {
    color: var(--heading-color);
    font-weight: var(--font-weight-semibold);
  }
}

.suggestions-list {
  list-style: disc;
  padding-left: var(--size-24);
  text-align: left;
  max-width: 40ch;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
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