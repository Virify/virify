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
        <MoleculesResultsContext 
          :count="results.length"
          :query-analysis="queryAnalysis"
          :location="location"
          :radius="radius"
          @open-popover="$emit('open-popover', $event)"
        />
      </div>

      <div class="o-results__grid">
        <component v-for="{ variant, fullWidth, component, result } of resultsComponents" :is="component" :variant
          :result :class="{
            'o-results__card--large': !!fullWidth
          }" />
      </div>
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
  const distributedResults = distributeListings(asArray(results))

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

    @container (1100px > width >=950px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--size-16);

      .o-results__card--large {
        grid-column: span 2;
      }
    }

    @container (1600px > width >=1100px) {
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--size-20);

      .o-results__card--large {
        grid-column: span 3;
      }
    }

    @container (width >=1600px) {
      grid-template-columns: repeat(4, 1fr);
      grid-gap: var(--size-20);

      .o-results__card--large {
        grid-column: span 4;
      }
    }
  }
}
</style>