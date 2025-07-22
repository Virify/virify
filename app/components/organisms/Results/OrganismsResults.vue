<template>
  <div class="o-results">
    <h2 class="o-results__title | title-sm">{{ results.length }} matches</h2>

    <div class="o-results__grid">
      <component v-for="{ variant, fullWidth, component, result } of resultsComponents" :is="component" :variant :result
        :class="{
          'o-results__card--large': !!fullWidth
        }" />
    </div>

    <pre>{{ resultsComponents }}</pre>
  </div>
</template>

<script setup lang="ts">
import {
  MoleculesCardBasic,
  MoleculesCardFeatured,
  MoleculesCardPremium
} from '#components'

interface Props {
  results: ListingCardData[]
}

const props = defineProps<Props>()

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
 *  Determine component type, variant for each card
 */
const resultsComponents = computed(() => {
  const { results } = asObject(props)

  return asArray(results).map((result) => {
    const { variant, fullWidth, component } = getCardVariant(result)

    return { variant, fullWidth, component, result }
  })
})
</script>

<style lang="scss">
.o-results {
  container-type: inline-size;

  &__title {
    margin: 0 0 var(--size-16);
  }

  &__grid {
    display: grid;
    grid-gap: var(--size-12);
    align-items: stretch;

    @container (width > 800px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--size-16);

      .o-results__card--large {
        grid-column: span 2;
      }
    }
  }
}
</style>