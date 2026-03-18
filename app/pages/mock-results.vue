<template>
  <div>
    <div class="o-mock-results | container">
      <PropertyCardRoot v-for="{
        price,
        saleOrRent,
        overviewAddress,
        sellerName,
        icons,
        overview,
        viewUrl,
        labels,
        priceLabel
      } of resultsMapped" :price :overview :sale-or-rent :icons :overview-address :seller-name :view-url :labels
        :price-label />

      <PropertyCardSkeleton v-for="_ of 8" />
    </div>
  </div>
</template>

<script setup lang="ts">
const results = [
]

/**
 *  @TODO - not yet implemented
 */
// propertyImage: __getFirstImage(property as Result['property']),
// coords: __getCoords(property as Result['property']),
// sellerImage: null,

const resultsMapped = results.map(formatSearchResults)
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-mock-results {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--size-8);
  row-gap: var(--size-24);

  @include mq.small-tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--size-16);
  }

  @include mq.notebook {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--size-16);
  }

  @include mq.desktop {
    grid-template-columns: repeat(4, 1fr);
  }

  @include mq.superultrawide {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>