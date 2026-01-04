<template>
  <div class="o-results">
    <template v-if="isLoading">
      <div class="o-results__title o-results__title--skeleton | skeleton"></div>

      <div class="o-results__grid">
        <MoleculesCardPremiumSkeleton class="o-results__card--large" />
        <MoleculesCardSkeleton v-for="key of 6" :key />
      </div>
    </template>

    <template v-else>
      <div v-if="hasSearchInfo" class="o-results__header">
        <MoleculesResultsContext :count="results.length" :query-analysis="queryAnalysis" :location="location"
          :radius="radius" @open-popover="$emit('open-popover', $event)" />
      </div>

      <div class="o-results__grid">
        <component v-for="{ variant, fullWidth, component, result } of paginatedResults" :is="component" :variant
          :result :class="{
            'o-results__card--large': !!fullWidth
          }" />
      </div>

      <MoleculesPaginator v-if="requiresPagnination" :current-page="currentPage" :items-per-page="RESULTS_PER_PAGE"
        :total-items="resultsLength" @change-page="updateCurrentPage" />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  MoleculesCardBasic,
  MoleculesCardFeatured,
  MoleculesCardPremium
} from '#components'

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

// Get title for visible paginated indexes
const visibleResultsTitle = computed(() => {
  // If no pagination, show normal title
  if (!requiresPagnination.value) {
    return `Showing ${resultsLength.value} results`
  }

  return `Showing results ${firstPaginatedIndex.value} to ${lastPaginatedIndex.value} of ${resultsLength.value}`
})

const paginatedResults = computed(() => {
  // If no results, return empty array
  if (!resultsLength.value) return []

  // Else return sliced results
  return asArray(resultsComponents.value).slice(firstPaginatedIndex.value - 1, lastPaginatedIndex.value)
})

/**
 *  Get the variant of the card
 */
function getCardVariant(result: ListingCardData) {
  const { listingTier } = asObject(result)

  if (listingTier === 'PREMIUM') {
    return {
      variant: 'premium',
      component: MoleculesCardPremium,
      fullWidth: true
    }
  }

  if (listingTier === 'FEATURED') {
    return {
      variant: 'featured',
      component: MoleculesCardFeatured
    }
  }

  return {
    variant: 'basic',
    component: MoleculesCardBasic
  }
}

/**
 * Flatten the premium listing sections into a simple array 
 * while maintaining the distribution logic from the utility
 */
function distributeListings(listings: ListingCardData[]): ListingCardData[] {
  // Use the existing utility function
  const sections = distributePremiumListings(listings as ListingWithFullProperty[])
  const result: ListingCardData[] = []

  // Flatten the sections into a simple array
  for (const section of sections) {
    if (section.item) {
      result.push(section.item as ListingCardData)
    }
    if (section.items) {
      // Add all items from the section
      for (const item of section.items) {
        result.push(item as ListingCardData)
      }
    }
  }

  return result
}

/**
 *  Determine component type, variant for each card
 */
const resultsComponents = computed(() => {
  const { results } = asObject(props)

  const sortedResults = asArray(results) /* @TODO - sort here */
  const distributedResults = distributeListings(sortedResults)

  return distributedResults
    .filter((result): result is ListingCardData => !!result) // Type guard to remove undefined
    .map((result) => {
      const { variant, fullWidth, component } = getCardVariant(result)

      return { variant, fullWidth, component, result }
    })
})
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
    grid-gap: var(--size-12);
    align-items: stretch;

    @container (800px > width >=640px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--size-16);

      .o-results__card--large {
        grid-column: span 2;
      }
    }

    @container (width >=950px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--size-16);

      .o-results__card--large {
        grid-column: span 4;
      }
    }
  }
}
</style>