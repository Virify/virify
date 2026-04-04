<template>
  <div class="o-results">
    <template v-if="isLoading">
      <div class="o-results__title o-results__title--skeleton | skeleton"></div>

      <div class="o-results__grid">
        <PropertyCardSkeleton v-for="key of 10" :key />
      </div>
    </template>

    <template v-else>
      <div v-if="hasSearchInfo" class="o-results__header">
        <MoleculesResultsContext :count="results.length" :query-analysis="queryAnalysis" :location="location"
          :radius="radius" @open-popover="$emit('open-popover', $event)" />
      </div>

      <div class="o-results__grid">
        <PropertyCardRoot v-for="result of paginatedResults" :key="result.id" v-bind="mapToCardProps(result)" />
      </div>

      <MoleculesPaginator v-if="requiresPagnination" :current-page="currentPage" :items-per-page="RESULTS_PER_PAGE"
        :total-items="resultsLength" @change-page="updateCurrentPage" class="o-results__pagination" />

      <div class="o-results__gradient"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading?: boolean
  results: ListingCardData[]
  queryAnalysis?: QueryAnalysis | null
  location?: GeocodingFeature | null
  radius?: number
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  queryAnalysis: null,
  location: null,
  radius: 0
})

defineEmits<{
  'open-popover': [type: 'location' | 'filters']
}>()

/**
 * Check if we have search info to display
 */
const hasSearchInfo = computed(() => {
  const hasTerms = isPopulatedArray(props.queryAnalysis?.usedTerms)
  const hasLocation = !!props.location
  const hasRadius = props.radius > 0
  return hasTerms || hasLocation || hasRadius || props.results.length > 0
})

/**
 *  Pagination
 */
const RESULTS_PER_PAGE = 24;
const currentPage = ref(1)

function updateCurrentPage(newIndex: number) {
  currentPage.value = newIndex

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}

// Get paginatable results length
const resultsLength = computed(() => {
  const results = asArray(resultsComponents.value)

  return results.length
})

// Check if pagination is necessary
const requiresPagnination = computed(() => {
  return resultsLength.value > RESULTS_PER_PAGE
})

// Get first paginated index
const firstPaginatedIndex = computed(() => {
  return 1 + (RESULTS_PER_PAGE * (currentPage.value - 1))
})

// Get last paginated index
const lastPaginatedIndex = computed(() => {
  return Math.min(firstPaginatedIndex.value + RESULTS_PER_PAGE - 1, resultsLength.value)
})

const paginatedResults = computed(() => {
  // If no results, return empty array
  if (!resultsLength.value) return []

  // Else return sliced results
  return asArray(resultsComponents.value).slice(firstPaginatedIndex.value - 1, lastPaginatedIndex.value)
})

/**
 *  Determine card props for each result
 */
const resultsComponents = computed(() => {
  return asArray(props.results)
})

// Track impressions when results are displayed
const { trackImpressions } = useAnalyticsTracking()

watch(() => props.results, (newResults) => {
  if (newResults && newResults.length > 0 && !props.isLoading) {
    // Track all listing IDs as impressions
    const listingIds = newResults.map(r => r.id).filter(Boolean)
    if (listingIds.length > 0) {
      trackImpressions(listingIds)
    }
  }
}, { immediate: true })
</script>

<style lang="scss">
.o-results {
  container-type: inline-size;

  &__header {
    margin-bottom: var(--size-16);
  }

  &__title {
    margin: 0 0 var(--size-12);

    &--skeleton {
      width: 12ch;
      height: 2.6ch;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--size-12);
    row-gap: var(--size-24);

    @container (min-width: 560px) {
      gap: var(--size-16);
    }

    @container (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--size-20);
    }

    @container (min-width: 1280px) {
      grid-template-columns: repeat(4, 1fr);
      gap: var(--size-24);
    }

    @container (min-width: 1600px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  &__pagination {
    position: relative;
    z-index: 2;
    margin: var(--size-48) 0 0;
  }

  &__gradient {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 6em;
    background: linear-gradient(to bottom, transparent, var(--background-200) 95%);
    pointer-events: none;
  }
}
</style>