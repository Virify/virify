<template>
  <div class="o-mock-results | container">
    <PropertyCardSkeleton v-if="pending" v-for="_ of 8" />
    <PropertyCardRoot v-else v-for="{
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
      priceLabel,
      rentFrequency,
      listingId,
      userId,
    } of results" :property-image :price :overview :sale-or-rent :icons :overview-address :seller-name :date-changed
      :date-changed-type :view-url :labels :price-label :rent-frequency :listing-id :user-id />
  </div>
</template>

<script setup lang="ts">
/**
 *  @TODO - not yet implemented
 */
// propertyImage: __getFirstImage(property as Result['property']),
// coords: __getCoords(property as Result['property']),
// sellerImage: null,

const { data: results, pending } = await useFetch('/api/mock-cards', {
  server: false,
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