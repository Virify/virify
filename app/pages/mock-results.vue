<template>
  <div class="o-mock-results | container">
    <PropertyCardRoot v-for="{
      price,
      saleOrRent,
      overviewAddress,
      propertyImage,
      sellerName,
      icons,
      overview,
      viewUrl,
      labels,
      dateChanged,
      dateChangedType,
      priceLabel
    } of results" :property-image :price :overview :sale-or-rent :icons :overview-address :seller-name :date-changed
      :date-changed-type :view-url :labels :price-label />

    <PropertyCardSkeleton v-for="_ of 8" />
  </div>
</template>

<script setup lang="ts">
/**
 *  @TODO - not yet implemented
 */
// propertyImage: __getFirstImage(property as Result['property']),
// coords: __getCoords(property as Result['property']),
// sellerImage: null,

const { data: results } = await useFetch('/api/mock-cards', {
  transform: (data: ListingWithFullProperty[]) => {
    if (!Array.isArray(data)) return []

    return data.map(formatSearchResults)
  }
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-mock-results {
  --container-padding: var(--size-24);

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--size-12);
  row-gap: var(--size-24);

  @include mq.small-tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq.small-tablet {
    gap: var(--size-16);
  }

  @include mq.notebook {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--size-20);
  }

  @include mq.desktop {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--size-24);
  }

  @include mq.superultrawide {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>