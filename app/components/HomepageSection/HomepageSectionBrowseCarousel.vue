<template>
  <div role="presentation">
    <h2 class="homepage-section-browse-carousel__title | title-xl">Featured properties</h2>

    <MoleculesCarousel :slides="formattedResults" slide-size="min(360px, calc(100vw - var(--container-padding)))"
      gap="var(--size-16)" show-arrows :options="{
        dragFree: false,
        watchDrag: false
      }">
      <template #default="{ slide }">
        <PropertyCardSkeleton v-if="slide.isPending" />

        <PropertyCardRoot v-else v-bind="slide" />
      </template>
    </MoleculesCarousel>
  </div>
</template>

<script setup>
const { results, isPending } = useViewAllListings({
  limit: 10
})

const formattedResults = computed(() => {
  // Show pending state whilst loading
  if (isPending.value) {
    return Array.from({ length: 10 }).map(() => ({
      isPending: true
    }))
  }

  // If no results, return an empty array
  if (!Array.isArray(results.value)) return []

  // Otherwise return properties in correct format
  return results.value.map(mapToCardProps)
})



</script>

<style lang="scss">
.homepage-section-browse-carousel {

  &__title {
    text-align: center;
    margin: 0 auto var(--size-32);
  }
}
</style>